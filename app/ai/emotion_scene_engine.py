# app/ai/emotion_scene_engine.py

class EmotionSceneEngine:
    """
    Generates scenes based on character emotions and relationships.
    """

    def generate_scenes(self, story, characters, relationships):
        if not story or not characters:
            return {
                "status": "error",
                "data": None,
                "error": "Story and characters are required"
            }

        hero = self._find_character(characters, "hero")
        guide = self._find_character(characters, "guide")
        antagonist = self._find_character(characters, "opposition")

        scenes = [
            self._opening_scene(story, hero, guide),
            self._rising_tension_scene(hero, antagonist),
            self._midpoint_break_scene(hero),
            self._final_confrontation_scene(hero, antagonist),
            self._resolution_scene(hero, guide)
        ]

        return {
            "status": "success",
            "data": scenes,
            "error": None
        }

    def _find_character(self, characters, role):
        for c in characters:
            if c.get("role") == role:
                return c
        return None

    def _opening_scene(self, story, hero, guide):
        return {
            "title": "Awakening",
            "mood": "calm",
            "purpose": "Establish emotional baseline and world",
            "description": f"{hero['name']} begins in a state of {hero['emotion']['current_emotion']}.",
            "emotional_state": {
                "hero": hero["emotion"]["current_emotion"],
                "guide": guide["emotion"]["current_emotion"] if guide else None
            }
        }

    def _rising_tension_scene(self, hero, antagonist):
        return {
            "title": "First Disturbance",
            "mood": "tense",
            "purpose": "Introduce conflict pressure",
            "description": f"{hero['name']} feels pressure from {antagonist['name']}.",
            "emotional_shift": {
                "hero": "fear begins",
                "antagonist": antagonist["emotion"]["current_emotion"]
            }
        }

    def _midpoint_break_scene(self, hero):
        return {
            "title": "Breaking Point",
            "mood": "emotional",
            "purpose": "Hero loses emotional stability",
            "description": f"{hero['name']} questions their purpose.",
            "emotional_shift": {
                "hero": "doubt"
            }
        }

    def _final_confrontation_scene(self, hero, antagonist):
        return {
            "title": "Storm Clash",
            "mood": "chaotic",
            "purpose": "Direct confrontation between opposing forces",
            "description": f"{hero['name']} confronts {antagonist['name']}.",
            "emotional_shift": {
                "hero": "determination",
                "antagonist": "desperation"
            }
        }

    def _resolution_scene(self, hero, guide):
        return {
            "title": "Aftermath",
            "mood": "peaceful",
            "purpose": "Emotional resolution",
            "description": f"{hero['name']} reflects on transformation.",
            "emotional_state": {
                "hero": "fulfilled",
                "guide": guide["emotion"]["current_emotion"] if guide else None
            }
        }