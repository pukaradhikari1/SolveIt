from flask import Blueprint, request, jsonify
from models import db, user
import hashlib 
from flask_mail import Mail, Message
import random


reg= Blueprint('reg', __name__)
mail = Mail()


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def send_otp_email(recipient, otp):
    msg = Message("Verify your email - OTP", recipients=[recipient])
    msg.body = f"Your OTP is: {otp}"
    mail.send(msg)

@reg.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = hash_password(data.get("password"))
    phone = data.get("phone")

    if user.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409
    if user.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already used'}), 409

    if not username or not email or not password:
        return jsonify({"message": "All required fields missing"}), 400

    otp = str(random.randint(100000, 999999))

    new_user = user(
        username=username,
        email=email,
        password=password,
        phone=phone,
        otp=otp,
        is_verified=False
    )
    db.session.add(new_user)
    db.session.commit()

    try:
        send_otp_email(email, otp)
    except Exception as e:
        return jsonify({"message": "User created, but email sending failed", "error": str(e)}), 500

    return jsonify({"message": "User created successfully. OTP sent to email.", "email": email}), 201

@reg.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    user_data = user.query.filter_by(email=email).first()

    if not user_data:
        return jsonify({"message": "User not found"}), 404

    if user_data.otp == otp:
        user_data.is_verified = True
        user_data.otp = None  
        db.session.commit()
        return jsonify({"message": "OTP verified successfully"}), 200
    else:
        return jsonify({"message": "Invalid OTP"}), 400
    
@reg.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get("email")
        password = hash_password(data.get("password"))

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user_data = user.query.filter_by(email=email, password=password).first()

        if user_data:
            if not user_data.is_verified:
                return jsonify({"message": "Please verify your email before logging in"}), 403

            return jsonify({
                "message": "Login successful",
                "data": {
                    "username": user_data.username,
                    "email": user_data.email
                }
            }), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401
    else:
        return jsonify({"message": "Please use POST method to login"}), 405
