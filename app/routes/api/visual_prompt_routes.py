from flask import request
from app.routes.api import api
from app.utils.exceptions import BadRequestError
from app.utils.response import success_response

from app.services.visual_prompt_service import VisualPromptService
from app.ai.visual_prompt_engine import VisualPromptEngine


service = VisualPromptService()
engine = VisualPromptEngine()


@api.route("/project/<int:project_id>/visual-prompts", methods=["GET"])
def get_project_visual_prompts(project_id):
    result = service.get_project_visual_prompts(project_id)
    if result["status"] != "success":
        raise BadRequestError(result["error"])
    return success_response(result["data"])


@api.route("/visual-prompts/regenerate", methods=["POST"])
def regenerate_visual_prompts():
    data = request.get_json(silent=True)
    if not data:
        raise BadRequestError("Invalid JSON body")

    project_id = data.get("projectId") or data.get("project_id")
    project_id = int(project_id)
    if not project_id:
        raise BadRequestError("projectId is required")

    # Delete existing prompts
    service.delete_project_visual_prompts(project_id)

    # Get project data for regeneration
    from app.services.project_service import ProjectService
    from app.services.scene_service import SceneService
    from app.services.character_service import CharacterService

    project_service = ProjectService()
    scene_service = SceneService()
    character_service = CharacterService()

    project_result = project_service.get_project(project_id)
    if project_result["status"] != "success":
        raise BadRequestError(project_result["error"])

    scenes_result = scene_service.get_scenes(project_id)
    characters_result = character_service.get_characters(project_id)

    scenes = scenes_result.get("data", [])
    characters = characters_result.get("data", [])
    project = project_result.get("data", {})

    # Generate new prompts
    ai_result = engine.generate_visual_prompts(
        story=project,
        characters=characters,
        scenes=scenes
    )

    if ai_result["status"] != "success":
        raise BadRequestError(ai_result["error"])

    # Store new prompts
    prompts_data = ai_result["data"]
    stored = []

    for prompt_info in prompts_data:
        result = service.create_visual_prompt(project_id, prompt_info)
        if result["status"] == "success":
            stored.append(result["data"])

    return success_response(stored)
