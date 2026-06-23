from flask import request, jsonify
from app.routes.api import api
from app.services.scene_service import SceneService

service = SceneService()


@api.route("/project/<int:project_id>/scene", methods=["POST"])
def add_scene(project_id):
    data = request.get_json()
    result = service.create_scene(project_id, data)
    return jsonify(result)


@api.route("/project/<int:project_id>/scenes", methods=["GET"])
def get_scenes(project_id):
    result = service.get_scenes(project_id)
    return jsonify(result)