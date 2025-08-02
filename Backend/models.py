
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db=SQLAlchemy()

class user(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(9), unique=False, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    otp = db.Column(db.String(6))           
    is_verified = db.Column(db.Boolean, default=False)
    otp_sent_at = db.Column(db.DateTime, default=None)  
    bio = db.Column(db.String(500), default="")
    profile_image_url = db.Column(db.String(300), default=None)
    questions = db.relationship('Question', back_populates='user', lazy=True)
    answers = db.relationship('Answer', back_populates='user', lazy=True)
    votes = db.relationship('Votes', back_populates='user', lazy=True)
    tags=db.Column(db.String(200), nullable=True)



class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title=db.Column(db.String(10), nullable=False)
    tag=db.Column(db.String(10), nullable=False)
    body=db.Column(db.String(500), nullable=False)
    file_url=db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at  = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    user=db.relationship("user", back_populates="questions")
    answers = db.relationship("Answer", back_populates="question", lazy=True, cascade="all, delete-orphan")
    
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


class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    body = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    question_id = db.Column(db.Integer, db.ForeignKey("question.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    file_url = db.Column(db.String(200))
    question = db.relationship("Question", back_populates="answers")
    user = db.relationship("user", back_populates="answers")
    
    def to_dict(self):
        return {
            "id": self.id,
            "body": self.body,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "question_id": self.question_id,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None
        }

class Votes(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    object_id = db.Column(db.Integer, nullable=False)  # Now can be used for both questions and answers
    content_type = db.Column(db.String(10), nullable=False)  # 'question' or 'answer'
    vote_type = db.Column(db.Integer, nullable=False)  # 1 = upvote, -1 = downvote
    user = db.relationship("user", back_populates="votes")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "object_id": self.object_id,
            "content_type": self.content_type,
            "vote_type": self.vote_type
        }
    
    @property
    def target(self):
        if self.content_type == "question":
            return Question.query.get(self.object_id)
        elif self.content_type == "answer":
            return Answer.query.get(self.object_id)
        return None
    

