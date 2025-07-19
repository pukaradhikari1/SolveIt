from flask import Blueprint, request, jsonify
from models import db, user, questions

home= Blueprint('home', __name__)

@home.route('/questions', methods=['GET'])
def get_questions():
    questions_list = questions.query.all()
    return jsonify([q.to_dict() for q in questions_list]), 200
