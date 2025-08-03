from itsdangerous import URLSafeTimedSerializer
from flask import current_app
from flask_mail import Message
from flask import url_for
from . import mail
import os
from threading import Thread

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def generate_token(email):
    s = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))
    return s.dumps(email, salt='email-confirm-salt')

def verify_token(token, max_age=3600):
    s = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))
    try:
        email = s.loads(token, salt='email-confirm-salt', max_age=max_age)
        return email
    except Exception:
        return None
    
def send_verification_email(email, token):
    # verify_url = f"http://127.0.0.1:5050/verify/{token}"
    verify_url = url_for('auth.verify_email', token=token, _external=True)
    msg = Message(subject="Verify Your CrashBot Account",
                  sender=os.getenv("EMAIL_USER"),
                  recipients=[email])
    msg.body = f"Hello!\n\nClick The Link To Verify Your Account:\n{verify_url}\n\nIf This Wasnt You Ignore This Email"
    # mail.send(msg)
    Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()

def send_reset_email(email, link):
    msg = Message(subject="Reset Your Password",sender=os.getenv("EMAIL_USER"), recipients=[email])
    msg.body = f"Click the link below to reset your password:\n\n{link}"
    Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()
    
def send_welcome_email(email, username):
    msg = Message(subject="👋 Welcome to Crash!",sender=os.getenv("EMAIL_USER"), recipients=[email])
    msg.body = f"Hey {username},\n\nWelcome to Crash! We're thrilled to have you here. 🚀\n\nYou can now log in and start chatting with your AI assistant!"
    Thread(target=send_async_email, args=(current_app._get_current_object(), msg)).start()
