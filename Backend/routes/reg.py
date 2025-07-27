from flask import Blueprint, request, jsonify
from models import db, user
import hashlib 
from flask_mail import Mail, Message
import random
from datetime import datetime,timedelta

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
                "user_id": user_data.id,
                "username": user_data.username,
                "email": user_data.email
            }), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401
    else:
        return jsonify({"message": "Please use POST method to login"}), 405


@reg.route('/reset-request', methods=['POST'])
def reset_request():
    data = request.get_json()
    email = data.get("email", "").strip().lower()

    tmp = user.query.filter_by(email=email).first()
    if not tmp:
        return jsonify({"message": "Email not found"}), 404

    otp = f"{random.randint(100000, 999999):06d}"
    tmp.otp = otp
    tmp.otp_sent_at = datetime.utcnow()  # ✅ Fixed usage
    db.session.commit()

    msg = Message(
        subject="SolveIt : Password Reset OTP",
        recipients=[email],
        body=f"Your OTP for password reset is: {otp}. It will expire in 2 minutes. Please do not share it with anyone."
    )

    try:
        mail.send(msg)
        return jsonify({"message": "OTP sent successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Failed to send OTP", "error": str(e)}), 500
    
@reg.route('/verify-reset-otp', methods=['POST'])
def verify_reset_otp():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    otp = data.get("otp", "").strip()
    tmp= user.query.filter_by(email=email).first()
    
    if not tmp or tmp.otp != otp or not tmp.otp_sent_at:
        return jsonify({"message": "Email not found"}), 404
    if datetime.utcnow() - tmp.otp_sent_at > timedelta(minutes=2): 
        return jsonify({"message": "OTP expired"}), 400
    return jsonify({"message": "OTP verified successfully"}), 200

@reg.route('/reset-password', methods=['POST'])
def reset_password():
    data=request.get_json()
    email=data.get("email", "").strip().lower()
    new_password = data.get("new_password", "").strip()
    
    tmp=user.query.filter_by(email=email).first()
    
    if not tmp:
        return jsonify({"message": "Email not found"}),404
    tmp.password= hash_password(new_password)
    tmp.otp = None
    tmp.otp_sent_at = None
    db.session.commit()
    return jsonify({"message": "Password changed successfully"}), 200
    
    
    
    
    
        
    
