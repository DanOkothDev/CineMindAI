from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response

from app.ai.story_engine import StoryEngine
from app.services.project_service import ProjectService


story_engine = StoryEngine()
project_service = ProjectService()


@api.route("/project/create", methods=["POST"])
def create_project():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    idea = data.get("idea")
    genre = data.get("genre", "drama")
    duration = data.get("duration", 10)

    story_result = story_engine.generate_story(
        idea=idea,
        genre=genre,
        duration=duration
    )

    if story_result["status"] != "success":
        raise BadRequestError(story_result["error"])

    project_result = project_service.create_project(
        idea=idea,
        genre=genre,
        story_result=story_result
    )

    if project_result["status"] != "success":
        raise BadRequestError(project_result["error"])

    return success_response(project_result["data"])


@api.route("/project/<int:project_id>", methods=["GET"])
def get_project(project_id):
    result = project_service.get_project(project_id)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response(result["data"])
