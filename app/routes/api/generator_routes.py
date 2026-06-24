from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response

from app.ai.story_engine import StoryEngine
from app.ai.character_engine import CharacterEngine
from app.ai.script_engine import ScriptEngine
from app.ai.dialogue_engine import DialogueEngine
from app.ai.emotion_scene_engine import EmotionSceneEngine
from app.memory.story_memory import StoryMemory
from app.ai.ai_client import AIClient

from app.services.project_service import ProjectService
from app.services.character_service import CharacterService
from app.services.scene_service import SceneService


story_engine = StoryEngine()
character_engine = CharacterEngine()
script_engine = ScriptEngine()
emotion_scene_engine = EmotionSceneEngine()
ai_client = AIClient(enabled=True)
dialogue_engine = DialogueEngine()

project_service = ProjectService()
character_service = CharacterService()
scene_service = SceneService()
story_memory = StoryMemory()


@api.route("/project/generate-full", methods=["POST"])
def generate_full_project():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    idea = data.get("idea")
    genre = data.get("genre", "drama")
    duration = data.get("duration", 10)
    project_id = data.get("project_id")

    # 1. STORY
    story_result = story_engine.generate_story(
        idea=idea,
        genre=genre,
        duration=duration
    )

    if story_result["status"] != "success":
        raise BadRequestError(story_result["error"])

    story_data = story_result["data"]

    # 2. PROJECT
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

    # NOW SAFE TO INIT MEMORY
    story_memory.init_story(project_id, story_data)

    # 3. CHARACTERS
    character_result = character_engine.generate_characters(
        story=story_data
    )

    if character_result["status"] != "success":
        raise BadRequestError(character_result["error"])

    characters = character_result["data"]["characters"]
    relationships = character_result["data"]["relationships"]

    saved_characters = []

    for char in characters:
        saved = character_service.create_character(
            project_id=project_id,
            data=char
        )
        if saved["status"] != "success":
            raise BadRequestError(saved["error"])
        saved_characters.append(saved["data"])

    # 4. SCENES (EMOTION ENGINE)
    scene_result = emotion_scene_engine.generate_scenes(
        story=story_data,
        characters=characters,
        relationships=relationships
    )

    if scene_result["status"] != "success":
        raise BadRequestError(scene_result["error"])

    scenes = scene_result["data"]

    for scene in scenes:
        scene_result_db = scene_service.create_scene(
            project_id=project_id,
            data=scene
        )
        if scene_result_db["status"] != "success":
            raise BadRequestError(scene_result_db["error"])

        story_memory.update_scene(project_id, scene)

    # 5. DIALOGUES
    dialogues = []

    for scene in scenes:
        dialogue_result = dialogue_engine.generate_dialogue(
            scene=scene,
            characters=character_result["data"]["characters"]
        )
        if dialogue_result["status"] != "success":
            raise BadRequestError(dialogue_result["error"])

        dialogues.append(dialogue_result["data"])

    # 6. EMOTION MEMORY UPDATE
    for char in characters:
        if "emotion" in char:
            story_memory.update_emotion(
                project_id,
                char["name"],
                char["emotion"]["current_emotion"]
            )

    return success_response({
        "project": project_result["data"],
        "story": story_data,
        "characters": character_result["data"],
        "scenes": scenes,
        "saved_characters": saved_characters,
        "dialogues": dialogues
    })