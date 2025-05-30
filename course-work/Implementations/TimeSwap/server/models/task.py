from datetime import datetime
from models import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    reward = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="open")
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    claimed_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
