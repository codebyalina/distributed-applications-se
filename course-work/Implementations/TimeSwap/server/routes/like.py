from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.like import Like
from models.task import Task
from models.user import User
from models import db

like_bp = Blueprint("like", __name__, url_prefix="/like")

# 1. Харесване на задача
@like_bp.route("/task/<int:task_id>", methods=["POST"])
@jwt_required()
def like_task(task_id):
    user_id = int(get_jwt_identity())
    task = Task.query.get_or_404(task_id)
    if task.created_by == user_id:
        return jsonify({"error": "Не можеш да харесваш собствените си задачи!"}), 400

    already_liked = Like.query.filter_by(user_id=user_id, task_id=task_id).first()
    if already_liked:
        return jsonify({"error": "Вече си харесал тази задача!"}), 400

    new_like = Like(user_id=user_id, task_id=task_id)
    db.session.add(new_like)
    db.session.commit()
    return jsonify({"message": "Успешно харесахте задачата!"}), 200

# 2. Махане на харесване (unlike)
@like_bp.route("/task/<int:task_id>", methods=["DELETE"])
@jwt_required()
def unlike_task(task_id):
    user_id = int(get_jwt_identity())
    like = Like.query.filter_by(user_id=user_id, task_id=task_id).first()
    if not like:
        return jsonify({"error": "Не си харесал тази задача!"}), 404
    db.session.delete(like)
    db.session.commit()
    return jsonify({"message": "Задачата вече не е харесана."}), 200

# 3. Всички задачи, които съм харесал
@like_bp.route("/mine", methods=["GET"])
@jwt_required()
def my_likes():
    user_id = int(get_jwt_identity())
    likes = Like.query.filter_by(user_id=user_id).all()
    tasks = [Task.query.get(like.task_id) for like in likes]
    result = [{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "deadline": t.deadline.isoformat(),
        "reward": t.reward,
        "status": t.status,
        "created_by": t.created_by,
        "claimed_by": t.claimed_by,
    } for t in tasks if t]
    return jsonify({"liked_tasks": result}), 200

# 4. Кой е харесал моите задачи (нотификации)
@like_bp.route("/notifications", methods=["GET"])
@jwt_required()
def who_liked_my_tasks():
    user_id = int(get_jwt_identity())
    my_tasks = Task.query.filter_by(created_by=user_id).all()
    my_task_ids = [t.id for t in my_tasks]
    likes = Like.query.filter(Like.task_id.in_(my_task_ids)).all()
    notifications = []
    for like in likes:
        liker = User.query.get(like.user_id)
        notifications.append({
            "task_id": like.task_id,
            "task_title": Task.query.get(like.task_id).title,
            "liked_by_id": like.user_id,
            "liked_by_username": liker.username if liker else "Unknown"
        })
    return jsonify({"notifications": notifications}), 200

