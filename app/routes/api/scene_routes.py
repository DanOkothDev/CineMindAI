from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response
from app.services.scene_service import SceneService

service = SceneService()


@api.route("/project/<int:project_id>/scene", methods=["POST"])
def add_scene(project_id):
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    result = service.create_scene(project_id, data)
    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])


@api.route("/project/<int:project_id>/scenes", methods=["GET"])
def get_scenes(project_id):
    result = service.get_scenes(project_id)
    return success_response(result["data"])
