from flask import request, jsonify
from app.routes.api import api
from app.ai.story_engine import StoryEngine


story_engine = StoryEngine()


@api.route("/story/generate", methods=["POST"])
def generate_story():
    data = request.get_json()

    idea = data.get("idea")
    genre = data.get("genre", "drama")
    duration = data.get("duration", 10)

    result = story_engine.generate_story(
        idea=idea,
        genre=genre,
        duration=duration
    )

    return jsonify(result)