from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password_hash = db.Column(db.String(200), nullable=False)
    reputation = db.Column(db.Float, default=5.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.String(50), default='student')
    wallet = db.Column(db.Float, default=0.0)
    avatar_url = db.Column(db.String(255), default=None)

    def __repr__(self):
        return f"<User {self.username} ({self.email})>"
