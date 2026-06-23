from flask import request, jsonify
from app.routes.api import api
from app.ai.script_engine import ScriptEngine


script_engine = ScriptEngine()


@api.route("/script/generate", methods=["POST"])
def generate_script():
    data = request.get_json()

    story = data.get("story")

    result = script_engine.generate_script(story)

    return jsonify(result)