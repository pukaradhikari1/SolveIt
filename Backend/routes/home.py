from flask import Blueprint, request, jsonify
from models import db, user, Question
from datetime import datetime
import os
from tag import TAGS  # <-- import your predefined tag list

home = Blueprint("home", __name__)

UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@home.route('/questions', methods=['POST'])
def create_question():
    title = request.form.get('title')
    tag = request.form.get('tag')
    body = request.form.get('body')
    user_id = request.form.get('user_id')
    file = request.files.get('file')

    if not all([title, tag, body, user_id]):
        return jsonify({'error': 'Missing fields'}), 400

    if tag not in TAGS:
        return jsonify({'error': 'Invalid tag'}), 400

    file_url = None
    if file and allowed_file(file.filename):
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        file_url = '/' + filepath

    new_question = Question(
        title=title,
        tag=tag,
        body=body,
        file_url=file_url,
        user_id=user_id
    )
    db.session.add(new_question)
    db.session.commit()

    return jsonify({'message': 'Question created'}), 201

@home.route('/questions', methods=['GET'])
def get_questions():
    questions = Question.query.order_by(Question.created_at.desc()).all()
    data = []

    for q in questions:
        data.append({
            "id": q.id,
            "title": q.title,
            "body": q.body,
            "tag": q.tag,
            "file_url": q.file_url,
            "created_at": q.created_at.isoformat(),
            "username": q.user.name if q.user else "Anonymous"
        })

    return jsonify(data)

@home.route('/tags', methods=['GET'])
def get_tags():
    return jsonify(TAGS), 200
