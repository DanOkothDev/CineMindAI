from app.ai.story_engine import StoryEngine
from app.ai.character_engine import CharacterEngine
from app.ai.scene_engine import SceneEngine
from app.ai.dialogue_engine import DialogueEngine
from app.ai.visual_prompt_engine import VisualPromptEngine


class ProjectEngine:
    """
    Controls the entire CineMindAI creation pipeline.
    """

    def __init__(self):
        self.story_engine = StoryEngine()
        self.character_engine = CharacterEngine()
        self.scene_engine = SceneEngine()
        self.dialogue_engine = DialogueEngine()
        self.visual_engine = VisualPromptEngine()


    def generate_project(
        self,
        idea,
        genre="drama",
        duration=10
    ):
        """
        Generates a complete AI movie package.
        """


        # STEP 1: STORY
        story = self.story_engine.generate_story(
            idea,
            genre,
            duration
        )


        if story["status"] != "success":
            return story


        # STEP 2: CHARACTERS
        characters = self.character_engine.generate_characters(
            story["data"]
        )


        if characters["status"] != "success":
            return characters


        # STEP 3: SCENES
        scenes = self.scene_engine.generate_scenes(
            story["data"],
            characters["data"]["characters"]
        )


        if scenes["status"] != "success":
            return scenes


        # STEP 4: DIALOGUES
        dialogues = self.dialogue_engine.generate_dialogues(
            story["data"],
            characters["data"]["characters"],
            scenes["data"]
        )


        if dialogues["status"] != "success":
            return dialogues


        # STEP 5: VISUAL PROMPTS
        visuals = self.visual_engine.generate_visual_prompts(
            story["data"],
            characters["data"]["characters"],
            scenes["data"]
        )


        if visuals["status"] != "success":
            return visuals



        return {
            "status": "success",
            "data": {
                "story": story["data"],
                "characters": characters["data"],
                "scenes": scenes["data"],
                "dialogues": dialogues["data"],
                "visuals": visuals["data"]
            },
            "error": None
        }