from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response
from app.utils.auth import require_auth, optional_auth

from app.services.dialogue_service import DialogueService


service = DialogueService()


@api.route("/project/<int:project_id>/dialogues", methods=["GET"])
def get_project_dialogues(project_id):
    result = service.get_project_dialogues(project_id)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response(result["data"])


@api.route("/project/<int:project_id>/dialogue", methods=["POST"])
@require_auth
def add_dialogue(user, project_id):
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    result = service.create_dialogue(project_id, data)
    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])


@api.route("/dialogue/<int:dialogue_id>", methods=["PUT"])
@require_auth
def update_dialogue(user, dialogue_id):
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    project_id = data.get("project_id")
    if not project_id:
        raise BadRequestError("project_id is required")

    result = service.update_dialogue(dialogue_id, project_id, data)
    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])
