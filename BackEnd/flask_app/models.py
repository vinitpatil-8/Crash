from . import db
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Database Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)    
    email_verification_token = db.Column(db.String(128), nullable=True)
    language = db.Column(db.String(20), default="english")  # or user setting later
    is_verified = db.Column(db.Boolean, default=False) # Verification Status (Gets Verified Using Email)
    reset_token = db.Column(db.String(128), nullable=True)
    last_reset_requested_at = db.Column(db.DateTime, nullable=True)
    reset_token_expiration = db.Column(db.DateTime, nullable=True)



    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
