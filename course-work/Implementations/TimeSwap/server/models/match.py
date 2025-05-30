from models import db
from datetime import datetime

class Match(db.Model):
    __tablename__ = "matches"
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_completed = db.Column(db.Boolean, default=False)
    __table_args__ = (
        db.UniqueConstraint('task_id', 'user_id', name='_task_user_uc'),
    )
