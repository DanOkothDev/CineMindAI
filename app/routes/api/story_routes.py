from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response
from app.ai.story_engine import StoryEngine


story_engine = StoryEngine()


@api.route("/story/generate", methods=["POST"])
def generate_story():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    idea = data.get("idea")
    genre = data.get("genre", "drama")
    duration = data.get("duration", 10)

    result = story_engine.generate_story(
        idea=idea,
        genre=genre,
        duration=duration
    )

    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])
