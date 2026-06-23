from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response
from app.ai.script_engine import ScriptEngine


script_engine = ScriptEngine()


@api.route("/script/generate", methods=["POST"])
def generate_script():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    story = data.get("story")
    if not story:
        raise BadRequestError("story is required")

    result = script_engine.generate_script(story)
    if result["status"] != "success":
        raise BadRequestError(result["error"])

    return success_response(result["data"])
