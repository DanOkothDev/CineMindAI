from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response
from app.ai.continuity_checker import ContinuityChecker


checker = ContinuityChecker()


@api.route("/validate/continuity", methods=["POST"])
def validate_continuity():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    story = data.get("story")
    characters = data.get("characters", [])
    scenes = data.get("scenes", [])

    result = checker.check_consistency(
        story=story,
        characters=characters,
        scenes=scenes
    )

    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])
