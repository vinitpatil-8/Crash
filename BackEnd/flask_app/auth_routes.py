from flask import Blueprint, request, jsonify
from .models import db, User
from flask import session  # optional if using sessions later
from datetime import timedelta

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    remember = data.get('remember', False)

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        return jsonify({'error': 'User already exists'}), 409

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201




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
    
    session.permanent = bool(remember)
    # Optional: if using Flask session 
    session['user_id'] = user.id
    session['username'] = user.username

    # if remember:
    #     session.permanent = True
    # else:
    #     session.permanent = False

    return jsonify({'message': 'Login successful', 'username': user.username}), 200


@auth.route('/me', methods=['GET'])
def me():
    if 'user_id' in session:
        return jsonify({
            'logged_in': True,
            'username': session['username']
        })
    return jsonify({ 'logged_in': False }), 401




@auth.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('newPassword')

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.set_password(new_password)
    db.session.commit()
    return jsonify({'message': 'Password reset successful'}), 200
