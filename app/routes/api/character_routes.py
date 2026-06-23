from flask import request, jsonify
from app.routes.api import api

from app.ai.character_engine import CharacterEngine
from app.services.character_service import CharacterService


character_engine = CharacterEngine()
character_service = CharacterService()


@api.route("/character/create", methods=["POST"])
def create_character():
    data = request.get_json()

    name = data.get("name")
    role = data.get("role")
    context = data.get("context", "")
    project_id = data.get("project_id")

    if not project_id:
        return jsonify({
            "status": "error",
            "data": None,
            "error": "project_id is required"
        }), 400

    # Step 1: AI generation
    ai_result = character_engine.create_character(
        name=name,
        role=role,
        idea_context=context
    )

    if ai_result["status"] != "success":
        return jsonify(ai_result), 400

    # Step 2: Save to database
    db_result = character_service.create_character(
        project_id=project_id,
        data=ai_result["data"]
    )

    return jsonify({
        "status": "success",
        "data": {
            "ai_character": ai_result["data"],
            "stored_character": db_result["data"]
        },
        "error": None
    })