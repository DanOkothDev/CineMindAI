from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response
from app.utils.auth import get_current_user

from app.ai.story_engine import StoryEngine
from app.ai.character_engine import CharacterEngine
from app.ai.dialogue_engine import DialogueEngine
from app.ai.emotion_scene_engine import EmotionSceneEngine
from app.ai.visual_prompt_engine import VisualPromptEngine
from app.memory.story_memory import StoryMemory

from app.services.project_service import ProjectService
from app.services.character_service import CharacterService
from app.services.scene_service import SceneService
from app.services.dialogue_service import DialogueService
from app.services.visual_prompt_service import VisualPromptService
from app.services.story_service import StoryService


story_engine = StoryEngine()
character_engine = CharacterEngine()
emotion_scene_engine = EmotionSceneEngine()
dialogue_engine = DialogueEngine()
visual_prompt_engine = VisualPromptEngine()

project_service = ProjectService()
character_service = CharacterService()
scene_service = SceneService()
dialogue_service = DialogueService()
visual_prompt_service = VisualPromptService()
story_service = StoryService()
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

    user = get_current_user()
    user_id = user.id if user else None

    # 1. STORY
    story_result = story_engine.generate_story(idea=idea, genre=genre, duration=duration)
    if story_result["status"] != "success":
        raise BadRequestError(story_result["error"])

    story_data = story_result["data"]

    # 2. PROJECT
    if not project_id:
        project_result = project_service.create_project(
            idea=idea, genre=genre, story_result=story_result, user_id=user_id
        )
        if project_result["status"] != "success":
            raise BadRequestError(project_result["error"])
        project_id = project_result["data"]["project_id"]
    else:
        project_result = project_service.get_project(project_id)
        if project_result["status"] != "success":
            raise BadRequestError(project_result["error"])

    # 3. STORY RECORD
    story_service.create_story(project_id, story_data)

    # 4. INIT STORY MEMORY
    story_memory.init_story(project_id, story_data)

    # 5. CHARACTERS
    character_result = character_engine.generate_characters(story=story_data)
    if character_result["status"] != "success":
        raise BadRequestError(character_result["error"])

    characters = character_result["data"]["characters"]
    relationships = character_result["data"]["relationships"]

    saved_characters = []
    for char in characters:
        saved = character_service.create_character(project_id=project_id, data=char)
        if saved["status"] != "success":
            raise BadRequestError(saved["error"])
        saved_characters.append(saved["data"])

    # 6. SCENES
    scene_result = emotion_scene_engine.generate_scenes(
        story=story_data, characters=characters, relationships=relationships
    )
    if scene_result["status"] != "success":
        raise BadRequestError(scene_result["error"])

    scenes = scene_result["data"]
    saved_scenes = []
    for i, scene in enumerate(scenes):
        scene["number"] = i + 1
        saved = scene_service.create_scene(project_id=project_id, data=scene)
        if saved["status"] != "success":
            raise BadRequestError(saved["error"])
        saved_scenes.append(saved["data"])
        story_memory.update_scene(project_id, scene)

    # 7. DIALOGUES
    dialogue_result = dialogue_engine.generate_dialogues(
        story=story_data, characters=characters, scenes=scenes
    )
    if dialogue_result["status"] != "success":
        raise BadRequestError(dialogue_result["error"])

    dialogue_data = dialogue_result["data"]
    saved_dialogues = []

    # dialogue_data is a list of {"scene": str, "dialogue": [...]} or flat list
    if isinstance(dialogue_data, list):
        for item in dialogue_data:
            if isinstance(item, dict) and "dialogue" in item:
                scene_title = item.get("scene", "")
                for line in item["dialogue"]:
                    if isinstance(line, dict) and line.get("character") and line.get("line"):
                        d = dialogue_service.create_dialogue(
                            project_id, {"character": line["character"], "line": line["line"],
                                         "emotion": line.get("emotion", ""), "scene": scene_title}
                        )
                        if d["status"] == "success":
                            saved_dialogues.append(d["data"])
            elif isinstance(item, dict) and item.get("character") and item.get("line"):
                d = dialogue_service.create_dialogue(project_id, item)
                if d["status"] == "success":
                    saved_dialogues.append(d["data"])

    # 8. VISUAL PROMPTS
    vp_result = visual_prompt_engine.generate_visual_prompts(
        story=story_data, characters=characters, scenes=scenes
    )
    saved_visual_prompts = []
    if vp_result["status"] == "success":
        for vp in vp_result["data"]:
            saved = visual_prompt_service.create_visual_prompt(project_id, vp)
            if saved["status"] == "success":
                saved_visual_prompts.append(saved["data"])

    # 9. EMOTION MEMORY UPDATE
    for char in characters:
        if "emotion" in char:
            story_memory.update_emotion(
                project_id, char["name"], char["emotion"].get("current_emotion", "neutral")
            )

    result = {
        "project": project_result["data"],
        "story": story_data,
        "characters": characters,
        "saved_characters": saved_characters,
        "scenes": saved_scenes,
        "dialogues": saved_dialogues,
        "visual_prompts": saved_visual_prompts,
        "relationships": relationships,
    }

    return success_response(result)
