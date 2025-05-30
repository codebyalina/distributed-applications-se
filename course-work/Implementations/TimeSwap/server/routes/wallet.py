from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models import db

wallet_bp = Blueprint("wallet", __name__, url_prefix="/wallet")

@wallet_bp.route("/balance", methods=["GET"])
@jwt_required()
def get_balance():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    return jsonify({"wallet": user.wallet}), 200

@wallet_bp.route("/deposit", methods=["POST"])
@jwt_required()
def deposit():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    amount = float(data.get("amount", 0))
    if amount <= 0:
        return jsonify({"error": "Сумата трябва да е положителна!"}), 400
    user.wallet += amount
    db.session.commit()
    return jsonify({"message": f"Балансът ти вече е {user.wallet}!"}), 200
