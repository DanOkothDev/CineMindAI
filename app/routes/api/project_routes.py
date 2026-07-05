from flask import request, g
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response, error_response
from app.utils.auth import get_current_user, require_auth

from app.services.project_service import ProjectService


project_service = ProjectService()


@api.route("/projects", methods=["GET"])
def list_projects():
    user = get_current_user()
    if user:
        result = project_service.get_user_projects(user.id)
    else:
        result = project_service.get_all_projects()

    return success_response(result["data"])


@api.route("/health", methods=["GET"])
def health_check():
    return success_response({"status": "ok"})


@api.route("/project/<int:project_id>", methods=["GET"])
def get_project(project_id):
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=50, type=int)
    include_param = request.args.get("include", default="", type=str)
    include = [item.strip() for item in include_param.split(",") if item.strip()] if include_param else None

    result = project_service.get_full_project(project_id, include=include, page=page, per_page=per_page)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response(result["data"])


@api.route("/project/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    user = get_current_user()
    user_id = user.id if user else None

    result = project_service.update_project(project_id, data, user_id=user_id)
    if result["status"] != "success":
        status_code = result.get("status_code", 400)
        return error_response(result["error"], status_code)

    return success_response(result["data"])


@api.route("/project/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    user = get_current_user()
    user_id = user.id if user else None

    result = project_service.delete_project(project_id, user_id=user_id)
    if result["status"] != "success":
        status_code = result.get("status_code", 400)
        return error_response(result["error"], status_code)

    return success_response({"deleted": True})
