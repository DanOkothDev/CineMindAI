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

    if not project_id or not name:
        raise BadRequestError("project_id and name are required")

    ai_result = character_engine.create_character(
        name=name,
        role=role or "supporting",
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

    return success_response(db_result["data"])


@api.route("/project/<int:project_id>/characters", methods=["GET"])
def get_project_characters(project_id):
    result = character_service.get_project_characters(project_id)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response(result["data"])


@api.route("/character/<int:character_id>", methods=["PUT"])
def update_character(character_id):
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    project_id = data.get("project_id")
    if not project_id:
        raise BadRequestError("project_id is required in request body")

    result = character_service.update_character(character_id, project_id, data)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response(result["data"])


@api.route("/character/<int:character_id>", methods=["DELETE"])
def delete_character(character_id):
    from flask import request as req
    project_id = req.args.get("project_id", type=int)
    if not project_id:
        raise BadRequestError("project_id query param is required")

    result = character_service.delete_character(character_id, project_id)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response({"deleted": True})
