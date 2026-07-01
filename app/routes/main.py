from flask import Blueprint, jsonify

main = Blueprint("main", __name__)

@main.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "CineMindAI API is running."
    })