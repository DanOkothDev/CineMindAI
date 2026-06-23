from flask import request, jsonify
from app.routes.api import api

from app.ai.story_engine import StoryEngine
from app.services.project_service import ProjectService


story_engine = StoryEngine()
project_service = ProjectService()


@api.route("/project/create", methods=["POST"])
def create_project():
    data = request.get_json()

    idea = data.get("idea")
    genre = data.get("genre", "drama")
    duration = data.get("duration", 10)

    story_result = story_engine.generate_story(
        idea=idea,
        genre=genre,
        duration=duration
    )

    project_result = project_service.create_project(
        idea=idea,
        genre=genre,
        story_result=story_result
    )

    return jsonify(project_result)


@api.route("/project/<int:project_id>", methods=["GET"])
def get_project(project_id):
    result = project_service.get_project(project_id)
    return jsonify(result)