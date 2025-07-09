#create databases in this file 

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db=SQLAlchemy()

class user(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(9), unique=True, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    otp = db.Column(db.String(6))           
    is_verified = db.Column(db.Boolean, default=False)  
    