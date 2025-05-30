from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.task import Task
from models import db
import os

profile_bp = Blueprint("profile", __name__, url_prefix="/profile")

def absolute_avatar_url(avatar_url: str):
    """
    Връща абсолютен URL за аватара (пример: http://localhost:5000/static/avatars/...)
    """
    base_url = request.host_url.rstrip('/')  # напр. http://localhost:5000
    if not avatar_url.startswith("/"):
        avatar_url = "/" + avatar_url
    return f"{base_url}{avatar_url}"

@profile_bp.route("/", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    tasks = Task.query.filter_by(created_by=user_id).all()
    claimed = Task.query.filter_by(claimed_by=user_id).all()

    avatar_url = user.avatar_url or "/static/avatars/default.gif"
    avatar_url = absolute_avatar_url(avatar_url)

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "reputation": user.reputation,
        "role": user.role,
        "avatar_url": avatar_url,
        "created_at": user.created_at.isoformat(),
        "created_tasks_count": len(tasks),
        "claimed_tasks_count": len(claimed),
        "created_tasks": [
            {
                "id": t.id,
                "title": t.title,
                "status": t.status
            } for t in tasks
        ],
        "claimed_tasks": [
            {
                "id": t.id,
                "title": t.title,
                "status": t.status
            } for t in claimed
        ]
    }), 200

# ----------- ВЗИМАЙ АВАТАРА (за фронта, на всяко влизане)
@profile_bp.route("/avatar", methods=["GET"])
@jwt_required()
def get_avatar():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    avatar_url = user.avatar_url or "/static/avatars/default.gif"
    avatar_url = absolute_avatar_url(avatar_url)
    return jsonify({"avatar_url": avatar_url}), 200

# ----------- КАЧВАНЕ НА АВАТАР (POST)
@profile_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user_id = get_jwt_identity()
    if 'avatar' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['avatar']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Ограничи типове по желание!
    allowed = {"png", "jpg", "jpeg", "gif"}
    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in allowed:
        return jsonify({"error": "Invalid file type"}), 400

    filename = f"user_{user_id}_avatar.{ext}"
    upload_dir = os.path.join(current_app.root_path, 'static', 'avatars')
    os.makedirs(upload_dir, exist_ok=True)
    filepath = os.path.join(upload_dir, filename)
    file.save(filepath)

    # Обнови профила на user-а
    user = User.query.get(user_id)
    user.avatar_url = f"/static/avatars/{filename}"
    db.session.commit()

    avatar_url = absolute_avatar_url(user.avatar_url)

    return jsonify({"avatar_url": avatar_url}), 200
