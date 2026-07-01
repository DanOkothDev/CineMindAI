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

    # Accept heading as alias for title, content as alias for description
    if "heading" in data and "title" not in data:
        data["title"] = data["heading"]
    if "content" in data and "description" not in data:
        data["description"] = data["content"]

    result = service.create_scene(project_id, data)
    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])


@api.route("/project/<int:project_id>/scenes", methods=["GET"])
def get_scenes(project_id):
    result = service.get_scenes(project_id)
    return success_response(result["data"])


@api.route("/scene/<int:scene_id>", methods=["PUT"])
def update_scene(scene_id):
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    project_id = data.get("project_id")
    if not project_id:
        raise BadRequestError("project_id is required in request body")

    result = service.update_scene(scene_id, project_id, data)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response(result["data"])


@api.route("/scene/<int:scene_id>", methods=["DELETE"])
def delete_scene(scene_id):
    project_id = request.args.get("project_id", type=int)
    if not project_id:
        raise BadRequestError("project_id query param is required")

    result = service.delete_scene(scene_id, project_id)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response({"deleted": True})
