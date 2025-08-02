from flask import Blueprint, request, jsonify
from models import db, user, Question
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from tag import TAGS  # <-- import your predefined tag list

home = Blueprint("home", __name__)


UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif", "txt"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@home.route("/questions", methods=["POST"])
def create_question():
    title = request.form.get("title")
    tag = request.form.get("tag")
    body = request.form.get("body")
    user_id = request.form.get("user_id")
    file = request.files.get("file")

    if not all([title, tag, body, user_id]):
        return jsonify({"error": "Missing fields"}), 400

    if tag not in TAGS:
        return jsonify({"error": "Invalid tag"}), 400

    file_url = None
    if file and allowed_file(file.filename):
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        file_url = "/" + filepath

    new_question = Question(
        title=title, tag=tag, body=body, file_url=file_url, user_id=user_id
    )
    db.session.add(new_question)
    db.session.commit()

    return jsonify({"message": "Question created"}), 201


@home.route("/questions", methods=["GET"])
def get_questions():
    questions = Question.query.order_by(Question.created_at.desc()).all()
    data = []
    for q in questions:
        data.append(
            {
                "id": q.id,
                "title": q.title,
                "body": q.body,
                "tag": q.tag,
                "file_url": q.file_url,
                "created_at": q.created_at.isoformat(),
                "username": q.user.username if q.user else "Anonymous",
            }
        )
    return jsonify(data)


@home.route("/tags", methods=["GET"])
def get_tags():
    return jsonify(TAGS), 200


@home.route("/tags_list", methods=["GET"])
def get_tags_list():
    return jsonify(TAGS), 200


PROFILE_UPLOAD_FOLDER = "static/uploads/profile_images"
ALLOWED_PROFILE_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_profile_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_PROFILE_EXTENSIONS
    )


@home.route("/profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    u = user.query.get(user_id)
    if not u:
        return jsonify({"error": "User not found"}), 404
    return jsonify(
        {
            "user_id": u.id,
            "username": u.username,
            "email": u.email,
            "phone": u.phone,
            "bio": u.bio or "",
            "profileImage": u.profile_image_url or "https://via.placeholder.com/150",
        }
    )


@home.route("/profile/<int:user_id>/image", methods=["POST"])
def upload_profile_image(user_id):
    u = user.query.get(user_id)
    if not u:
        return jsonify({"error": "User not found"}), 404

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_profile_file(file.filename):
        return jsonify({"error": "Invalid file"}), 400

    os.makedirs(PROFILE_UPLOAD_FOLDER, exist_ok=True)
    filename = secure_filename(f"user_{user_id}_{file.filename}")
    filepath = os.path.join(PROFILE_UPLOAD_FOLDER, filename)
    file.save(filepath)

    from flask import url_for

    rel_path = f"uploads/profile_images/{filename}"
    full_url = url_for("static", filename=rel_path, _external=True)

    u.profile_image_url = full_url
    db.session.commit()
    return jsonify(
        {
            "message": "Image uploaded",
            "profileImage": full_url,
        }
    )


@home.route("/profile/<int:user_id>/tags", methods=["GET"])
def get_profile_tags(user_id):
    u = user.query.get(user_id)
    if not u:
        return jsonify({"error": "User not found"}), 404

    user_tags = u.tags.split(",") if u.tags else []
    return jsonify({"tags": user_tags})


@home.route("/profile/<int:user_id>/tags", methods=["POST", "PUT"])
def update_profile_tags(user_id):
    u = user.query.get(user_id)
    if not u:
        return jsonify({"error": "User not found"}), 404

    tags = request.json.get("tags", [])
    if not isinstance(tags, list) or not all(tag in TAGS for tag in tags):
        return jsonify({"error": "Invalid tags"}), 400

    u.tags = ",".join(tags)
    print(f"Updating tags for user {user_id}: {u.tags}")
    db.session.commit()
    return jsonify({"message": "Tags updated"})


@home.route("/profile/<int:user_id>", methods=["DELETE"])
def delete_profile(user_id):
    u = user.query.get(user_id)
    if not u:
        return jsonify({"error": "User not found"}), 404
    db.session.delete(u)
    db.session.commit()
    return jsonify({"message": "User deleted"})

@home.route("/profile/<int:user_id>/edit", methods=["PUT"])
def edit_profile(user_id):
    u = user.query.get(user_id)
    if not u:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    u.username = data.get("username", u.username)
    u.email = data.get("email", u.email)
    u.phone = data.get("phone", u.phone)
    u.bio = data.get("bio", u.bio)

    db.session.commit()
    return jsonify({"message": "Profile updated successfully"})

@home.route("/about-us", methods=["GET"])
def about_us():
    return jsonify({
        "message": "SolveIt is a platform designed to help users solve problems collaboratively. Our mission is to connect people with diverse skills and knowledge to tackle challenges together.",
        "team": [
            {"name": "Sakar", "Pukar": "Backend Developer"},
            {"name": "Aryan Mahato", "Aryan Thagunna" : "Frontend Designer"}
        ]
    }), 200

@home.route("/questions/<int:id>", methods=["GET"])
def get_question(id):
    q = Question.query.get(id)
    if not q:
        return jsonify({"error": "Question not found"}), 404

    return jsonify({
        "id": q.id,
        "title": q.title,
        "body": q.body,
        "tag": q.tag,
        "username": q.username, 
        "created_at": q.created_at.isoformat() if q.created_at else None
    })