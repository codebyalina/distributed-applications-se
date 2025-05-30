from flask import Blueprint, request, jsonify
from models.user import User
from models import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 400

    hashed_pw = generate_password_hash(data["password"])
    user = User(
        email=data["email"],
        username=data["username"],
        password_hash=hashed_pw
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token})

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Връщаме най-важните полета
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "reputation": user.reputation,
        "wallet": user.wallet,
        "avatar_url": user.avatar_url,
    }), 200