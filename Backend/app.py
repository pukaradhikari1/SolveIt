from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from flask_sqlalchemy import SQLAlchemy
from models import db,user
from routes import register_routes
from flask_mail import Mail 

app= Flask(__name__)
app.config.from_object(Config)
app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024  # 4MB max file size to be uploaded for questions and answers


CORS(app, supports_credentials=True)

db.init_app(app)
register_routes(app)

with app.app_context():
    db.create_all()
    print("Database created")

mail = Mail(app)

if __name__ == "__main__":
    app.run(debug=True)