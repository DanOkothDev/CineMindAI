from flask import request, jsonify
from app.routes.api import api
from app.ai.character_engine import CharacterEngine


character_engine = CharacterEngine()


@api.route("/character/create", methods=["POST"])
def create_character():
    data = request.get_json()

    name = data.get("name")
    role = data.get("role")
    context = data.get("context", "")

    result = character_engine.create_character(
        name=name,
        role=role,
        idea_context=context
    )

    return jsonify(result)