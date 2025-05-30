from models import db
from datetime import datetime

class Like(db.Model):
    __tablename__ = "likes"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)   # Кой харесва задачата
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)    # Коя задача харесва
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Допълнително: можеш да добавиш unique constraint (user_id, task_id)
    __table_args__ = (
        db.UniqueConstraint('user_id', 'task_id', name='_user_task_uc'),
    )
