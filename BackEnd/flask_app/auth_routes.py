from flask import Blueprint, request, jsonify, redirect
from flask import make_response
from .models import db, User
from flask import session  # optional if using sessions later
from datetime import timedelta, datetime, timezone
from itsdangerous import URLSafeTimedSerializer
from flask import url_for
from .utils import generate_token, verify_token
from flask_mail import Message
from . import mail
from .utils import send_reset_email, send_verification_email
from .utils import send_welcome_email
from flask_cors import cross_origin
import secrets
import os

auth = Blueprint('auth', __name__)
s = URLSafeTimedSerializer("my_app_is_gonna_rock")

# def send_verification_email(email, username):
#     token = generate_token(email)
#     verify_url = url_for('auth.verify_email', token=token, _external=True)

#     msg = Message('Verify Your Email - Crash Bot',
#                   sender='Crash Bot <noreply@crash.com>',
#                   recipients=[email])
#     msg.body = f"Hi {username},\n\nPlease click the link below to verify your email:\n{verify_url}\n\nThanks!"
#     mail.send(msg)


# Signup Route
@auth.route('/signup', methods=['POST'])
@cross_origin(supports_credentials=True, origins=["http://127.0.0.1:5500", "http://localhost:5500"])
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()
    
    if existing_user:
        return jsonify({'error': 'User already exists'}), 409

    # ✅ Generate verification token
    token = generate_token(email)

    # ✅ Create user
    new_user = User(username=username, email=email, email_verification_token=token)
    new_user.set_password(password)

    # ✅ Add to database
    db.session.add(new_user)
    db.session.commit()

    # ✅ Send email
    send_verification_email(email, token)

    return jsonify({'message': 'User created. Check your email to verify.'}), 201




# Login Route
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    remember = data.get('remember', False)

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    if not user.is_verified:
        return jsonify({'error': 'Please verify your email before logging in.'}), 403
    session.permanent = bool(remember)
    # Optional: if using Flask session 
    session['user_id'] = user.id
    session['username'] = user.username

    # if remember:
    #     session.permanent = True
    # else:
    #     session.permanent = False

    return jsonify({'message': 'Login successful', 'username': user.username}), 200

# Remember Me Route
@auth.route('/me', methods=['GET'])
def me():
    if 'user_id' in session:
        return jsonify({
            'logged_in': True,
            'username': session['username']
        })
    return jsonify({ 'logged_in': False }), 401


# Forgot Password Route
@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User with this email not found'}), 404
    
    # Check for abuse
    if user.last_reset_requested_at:
        last_requested = user.last_reset_requested_at.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) - last_requested < timedelta(minutes=2):
            return jsonify({'error': 'Please wait before requesting again'}), 429
    user.last_reset_requested_at = datetime.now(timezone.utc)

    # Generate a reset token
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expiration = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.session.commit()

    # Build reset URL
    reset_url = url_for('auth.reset_password_token', token=token, _external=True)
    # Send email using util function
    send_reset_email(email, reset_url)

    return jsonify({'message': 'Reset link sent to your email'}), 200


# Reset Password Route
@auth.route('/reset-password', methods=['POST'])
def reset_password_token():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('newPassword')

    if not token or not new_password:
        return jsonify({'error': 'Token and new password required'}), 400

    user = User.query.filter_by(reset_token=token).first()
    if not user:
        return jsonify({'error': 'Invalid or expired token'}), 400

    # Check if token is expired
    if (user.reset_token_expiration is None or user.reset_token_expiration.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc)):
        return jsonify({'error': 'Reset token has expired'}), 400

    # Proceed with password reset
    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiration = None
    db.session.commit()

    return jsonify({'message': 'Password has been reset'}), 200

# Reset Password Get Route
@auth.route('/reset-password', methods=['GET'])
def reset_password_page():
    token = request.args.get('token')
    if not token:
        return "Token Missing", 400
    response = make_response("", 302)
    response.headers["Location"] = f"http://127.0.0.1:5500/FrontEnd/Authorization/forgot.html?token={token}"
    return response



# Verify Route
@auth.route('/verify/<token>')
def verify_email(token):
    email = verify_token(token)
    if not email:
        return "Invalid or expired token", 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return "User not found", 404

    user.is_verified = True
    user.email_verification_token = None
    db.session.commit()
    send_welcome_email(user.email, user.username)
    # return redirect("http://127.0.0.1:5500/FrontEnd/Authorization/login.html")
    response = make_response("", 302)
    response.headers["Location"] = "http://127.0.0.1:5500/FrontEnd/Authorization/login.html"
    return response


# Resend Verification Route
@auth.route('/resend-verification', methods=['POST'])
def resend_verification():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.is_verified:
        return jsonify({'message': 'Already verified'}), 200

    send_verification_email(user.email, user.username)
    return jsonify({'message': 'Verification email sent again'}), 200
