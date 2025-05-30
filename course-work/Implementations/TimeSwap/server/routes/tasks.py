from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.task import Task
from models.user import User
from models import db
from datetime import datetime

tasks_bp = Blueprint("tasks", __name__, url_prefix="/tasks")

# ----- GET ALL TASKS -----
@tasks_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required(optional=True)
def get_tasks():
    tasks = Task.query.all()
    data = []
    for t in tasks:
        data.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "deadline": t.deadline.isoformat(),
            "reward": t.reward,
            "status": t.status,
            "created_by": t.created_by,
            "claimed_by": t.claimed_by,
        })
    return jsonify({"tasks": data}), 200

# ----- GET MY TASKS -----
@tasks_bp.route("/my", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_my_tasks():
    user_id = int(get_jwt_identity())
    tasks = Task.query.filter_by(created_by=user_id).all()
    data = [{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "deadline": t.deadline.isoformat(),
        "reward": t.reward,
        "status": t.status,
        "created_by": t.created_by,
        "claimed_by": t.claimed_by,
    } for t in tasks]
    return jsonify({"tasks": data}), 200

# ----- GET CLAIMED TASKS -----
@tasks_bp.route("/claimed", methods=["GET"], strict_slashes=False)
@jwt_required()
def get_claimed_tasks():
    user_id = int(get_jwt_identity())
    tasks = Task.query.filter_by(claimed_by=user_id).all()
    data = [{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "deadline": t.deadline.isoformat(),
        "reward": t.reward,
        "status": t.status,
        "created_by": t.created_by,
        "claimed_by": t.claimed_by,
    } for t in tasks]
    return jsonify({"tasks": data}), 200

# ----- CREATE TASK -----
@tasks_bp.route("/", methods=["POST"], strict_slashes=False)
@jwt_required()
def create_task():
    data = request.get_json()
    errors = []

    title = data.get("title", "")
    description = data.get("description", "")
    reward = data.get("reward")
    deadline = data.get("deadline", "")

    # ------- ВАЛИДАЦИЯ -------
    if not title or not isinstance(title, str) or len(title.strip()) < 3 or len(title) > 120:
        errors.append("Title is required (min 3, max 120 chars).")
    if not description or not isinstance(description, str) or len(description.strip()) < 3 or len(description) > 500:
        errors.append("Description is required (min 3, max 500 chars).")
    if reward is None or not isinstance(reward, (int, float)) or reward <= 0:
        errors.append("Reward must be a positive number.")
    try:
        deadline_dt = datetime.fromisoformat(deadline)
    except Exception:
        errors.append("Deadline must be a valid ISO date string.")

    if errors:
        return jsonify({"errors": errors}), 400

    user_id = int(get_jwt_identity())
    task = Task(
        title=title.strip(),
        description=description.strip(),
        deadline=deadline_dt,
        reward=reward,
        created_by=user_id,
        status="open"
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created successfully!", "task_id": task.id}), 201

# ----- GET TASK BY ID -----
@tasks_bp.route("/<int:task_id>", methods=["GET"], strict_slashes=False)
@jwt_required(optional=True)
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify({
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "deadline": task.deadline.isoformat(),
        "reward": task.reward,
        "status": task.status,
        "created_by": task.created_by,
        "claimed_by": task.claimed_by,
    }), 200

# ----- UPDATE TASK -----
@tasks_bp.route("/<int:task_id>", methods=["PUT"], strict_slashes=False)
@jwt_required()
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    user_id = int(get_jwt_identity())
    if int(task.created_by) != user_id:
        return jsonify({"error": "Only the creator can update this task!"}), 403

    data = request.get_json()
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    deadline_str = data.get("deadline")
    if deadline_str:
        task.deadline = datetime.fromisoformat(deadline_str)
    task.reward = data.get("reward", task.reward)
    db.session.commit()
    return jsonify({"message": "Task updated successfully."}), 200

# ----- DELETE TASK -----
@tasks_bp.route("/<int:task_id>", methods=["DELETE"], strict_slashes=False)
@jwt_required()
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    user_id = int(get_jwt_identity())
    if int(task.created_by) != user_id:
        return jsonify({"error": "Only the creator can delete this task!"}), 403
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully."}), 200

# ----- CLAIM TASK -----
@tasks_bp.route("/<int:task_id>/claim", methods=["POST"], strict_slashes=False)
@jwt_required()
def claim_task(task_id):
    task = Task.query.get_or_404(task_id)
    if task.status != "open":
        return jsonify({"error": "Task is already claimed or completed!"}), 400
    user_id = int(get_jwt_identity())
    task.claimed_by = user_id
    task.status = "claimed"
    db.session.commit()
    return jsonify({"message": "Task successfully claimed!"}), 200

# ----- COMPLETE TASK -----
@tasks_bp.route("/<int:task_id>/complete", methods=["POST"], strict_slashes=False)
@jwt_required()
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    user_id = int(get_jwt_identity())
    if task.claimed_by != user_id:
        return jsonify({"error": "Only the claimer can complete this task!"}), 403
    task.status = "completed"
    db.session.commit()
    return jsonify({"message": "Task marked as completed!"}), 200

# ----- BROWSE PUBLIC TASKS -----
@tasks_bp.route("/browse", methods=["GET", "OPTIONS"], strict_slashes=False)
@jwt_required(optional=True)
def browse_tasks():
    if request.method == "OPTIONS":
        return '', 200

    user_id = None
    try:
        user_id = int(get_jwt_identity())
    except Exception:
        user_id = None

    query = Task.query.filter(Task.status == "open")
    if user_id:
        query = query.filter(Task.created_by != user_id)
    tasks = query.all()
    data = [{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "deadline": t.deadline.isoformat(),
        "reward": t.reward,
        "status": t.status,
        "created_by": t.created_by,
        "claimed_by": t.claimed_by,
    } for t in tasks]
    return jsonify({"tasks": data}), 200

# ----- SEARCH TASK -----
@tasks_bp.route("/search", methods=["GET"], strict_slashes=False)
@jwt_required(optional=True)
def search_tasks():
    status = request.args.get("status")
    created_by = request.args.get("created_by")
    claimed_by = request.args.get("claimed_by")
    deadline_before = request.args.get("deadline_before")
    deadline_after = request.args.get("deadline_after")
    reward_min = request.args.get("reward_min", type=float)
    reward_max = request.args.get("reward_max", type=float)

    query = Task.query

    if status:
        query = query.filter(Task.status == status)
    if created_by:
        query = query.filter(Task.created_by == int(created_by))
    if claimed_by:
        query = query.filter(Task.claimed_by == int(claimed_by))
    if deadline_before:
        try:
            deadline_dt = datetime.fromisoformat(deadline_before)
            query = query.filter(Task.deadline <= deadline_dt)
        except ValueError:
            return jsonify({"error": "Invalid deadline_before format (should be ISO8601)"}), 400
    if deadline_after:
        try:
            deadline_dt = datetime.fromisoformat(deadline_after)
            query = query.filter(Task.deadline >= deadline_dt)
        except ValueError:
            return jsonify({"error": "Invalid deadline_after format (should be ISO8601)"}), 400
    if reward_min is not None:
        query = query.filter(Task.reward >= reward_min)
    if reward_max is not None:
        query = query.filter(Task.reward <= reward_max)

    tasks = query.all()

    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "deadline": t.deadline.isoformat(),
            "reward": t.reward,
            "status": t.status,
            "created_by": t.created_by,
            "claimed_by": t.claimed_by,
        })

    return jsonify({"tasks": result}), 200
