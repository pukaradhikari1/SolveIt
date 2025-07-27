
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db=SQLAlchemy()

class user(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(9), unique=False, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    otp = db.Column(db.String(6))           
    is_verified = db.Column(db.Boolean, default=False)
    otp_sent_at = db.Column(db.DateTime, default=None)  
    questions = db.relationship('Question', back_populates='user', lazy=True)


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title=db.Column(db.String(10), nullable=False)
    tag=db.Column(db.String(10), nullable=False)
    body=db.Column(db.String(500), nullable=False)
    file_url=db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    user=db.relationship("user", back_populates="questions")
    
    def to_dict(self):
        return {
        "id": self.id,
        "title": self.title,
        "tag": self.tag,
        "body": self.body,
        "file_url": self.file_url,
        "created_at": self.created_at.isoformat(),
        "updated_at": self.updated_at.isoformat(),
        "user_id": self.user_id,
        "username": self.user.username if self.user else None
    }
