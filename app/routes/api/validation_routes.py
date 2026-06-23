from flask import request, jsonify
from app.routes.api import api
from app.ai.continuity_checker import ContinuityChecker


checker = ContinuityChecker()


@api.route("/validate/continuity", methods=["POST"])
def validate_continuity():
    data = request.get_json()

    story = data.get("story")
    characters = data.get("characters", [])
    scenes = data.get("scenes", [])

    result = checker.check_consistency(
        story=story,
        characters=characters,
        scenes=scenes
    )

    return jsonify(result)