from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response

from app.ai.story_engine import StoryEngine
from app.ai.character_engine import CharacterEngine
from app.ai.script_engine import ScriptEngine
from app.ai.dialogue_engine import DialogueEngine

from app.services.project_service import ProjectService
from app.services.character_service import CharacterService
from app.services.scene_service import SceneService


story_engine = StoryEngine()
character_engine = CharacterEngine()
script_engine = ScriptEngine()
dialogue_engine = DialogueEngine()

project_service = ProjectService()
character_service = CharacterService()
scene_service = SceneService()


@api.route("/project/generate-full", methods=["POST"])
def generate_full_project():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    idea = data.get("idea")
    genre = data.get("genre", "drama")
    duration = data.get("duration", 10)
    project_id = data.get("project_id")

    story_result = story_engine.generate_story(
        idea=idea,
        genre=genre,
        duration=duration
    )

    if story_result["status"] != "success":
        raise BadRequestError(story_result["error"])

    if not project_id:
        project_result = project_service.create_project(
            idea=idea,
            genre=genre,
            story_result=story_result
        )
        if project_result["status"] != "success":
            raise BadRequestError(project_result["error"])
        project_id = project_result["data"]["project_id"]
    else:
        project_result = project_service.get_project(project_id)
        if project_result["status"] != "success":
            raise BadRequestError(project_result["error"])

    character_result = character_engine.generate_characters(
        story=story_result["data"]
    )

    if character_result["status"] != "success":
        raise BadRequestError(character_result["error"])

    saved_characters = []

    for char in character_result["data"]["characters"]:
        saved = character_service.create_character(
            project_id=project_id,
            data=char
        )
        if saved["status"] != "success":
            raise BadRequestError(saved["error"])
        saved_characters.append(saved["data"])

    script_result = script_engine.generate_script(story_result["data"])
    if script_result["status"] != "success":
        raise BadRequestError(script_result["error"])

    scenes = script_result["data"].get("scenes", [])

    for scene in scenes:
        scene_result = scene_service.create_scene(
            project_id=project_id,
            data=scene
        )
        if scene_result["status"] != "success":
            raise BadRequestError(scene_result["error"])

    dialogues = []

    for scene in scenes:
        dialogue_result = dialogue_engine.generate_dialogue(
            scene=scene,
            characters=saved_characters
        )
        if dialogue_result["status"] != "success":
            raise BadRequestError(dialogue_result["error"])
        dialogues.append(dialogue_result["data"])

    return success_response({
        "project": project_result["data"],
        "story": story_result["data"],
        "characters": character_result["data"],
        "scenes": scenes,
        "saved_characters": saved_characters,
        "dialogues": dialogues
    })
