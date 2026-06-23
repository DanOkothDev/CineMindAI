from flask import request, jsonify
from app.routes.api import api

from app.ai.story_engine import StoryEngine
from app.ai.character_engine import CharacterEngine
from app.ai.script_engine import ScriptEngine

from app.services.project_service import ProjectService
from app.services.character_service import CharacterService
from app.services.scene_service import SceneService


story_engine = StoryEngine()
character_engine = CharacterEngine()
script_engine = ScriptEngine()

project_service = ProjectService()
character_service = CharacterService()
scene_service = SceneService()


@api.route("/project/generate-full", methods=["POST"])
def generate_full_project():
    data = request.get_json()

    idea = data.get("idea")
    genre = data.get("genre", "drama")
    duration = data.get("duration", 10)
    project_id = data.get("project_id")

    # 1. Generate story
    story_result = story_engine.generate_story(
        idea=idea,
        genre=genre,
        duration=duration
    )

    if story_result["status"] != "success":
        return jsonify(story_result), 400

    # 2. Create project (or attach to existing)
    if not project_id:
        project_result = project_service.create_project(
            idea=idea,
            genre=genre,
            story_result=story_result
        )
        project_id = project_result["data"]["project_id"]
    else:
        project_result = project_service.get_project(project_id)

    # 3. Generate characters from story
    character_result = character_engine.generate_characters(
        story=story_result["data"]
    )

    if character_result["status"] != "success":
        return jsonify(character_result), 400

    # Save all characters
    saved_characters = []

    for char in character_result["data"]:
        saved = character_service.create_character(
            project_id=project_id,
            data=char
        )
        saved_characters.append(saved["data"])

    # 4. Generate scenes (from script engine)
    script_result = script_engine.generate_script(story_result["data"])

    scenes = script_result["data"]["scenes"]

    for scene in scenes:
        scene_service.create_scene(
            project_id=project_id,
            data=scene
        )

    # 5. Return full system output
    return jsonify({
        "status": "success",
        "data": {
            "project": project_result["data"],
            "story": story_result["data"],
            "characters": character_result["data"],
            "scenes": scenes,
            "characters": saved_characters
        },
        "error": None
    })