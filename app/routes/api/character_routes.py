from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response

from app.ai.character_engine import CharacterEngine
from app.services.character_service import CharacterService


character_engine = CharacterEngine()
character_service = CharacterService()


@api.route("/character/create", methods=["POST"])
def create_character():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    name = data.get("name")
    role = data.get("role")
    context = data.get("context", "")
    project_id = data.get("project_id")

    if not project_id or not name or not role:
        raise BadRequestError("project_id, name, and role are required")

    ai_result = character_engine.create_character(
        name=name,
        role=role,
        idea_context=context
    )

    if ai_result["status"] != "success":
        raise BadRequestError(ai_result["error"])

    db_result = character_service.create_character(
        project_id=project_id,
        data=ai_result["data"]
    )

    if db_result["status"] != "success":
        raise BadRequestError(db_result["error"])

    return success_response({
        "ai_character": ai_result["data"],
        "stored_character": db_result["data"]
    })

@api.route("/project/<int:project_id>/characters", methods=["GET"])
def get_project_characters(project_id):
    result = character_service.get_project_characters(project_id)

    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])
