from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response
from app.utils.auth import generate_jwt

from app.services.auth_service import AuthService


auth_service = AuthService()


@api.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    result = auth_service.register(
        username=data.get("username"),
        email=data.get("email"),
        password=data.get("password"),
    )

    if result["status"] != "success":
        raise BadRequestError(result["error"])

    user = result["data"]
    token = generate_jwt(user["id"], user["username"], user["email"])

    return success_response({
        "user": user,
        "token": token,
    })


@api.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    result = auth_service.login(
        email=data.get("email"),
        password=data.get("password"),
    )

    if result["status"] != "success":
        raise BadRequestError(result["error"])

    user = result["data"]
    token = generate_jwt(user.id, user.username, user.email)

    return success_response({
        "user": user.to_dict(),
        "token": token,
    })
