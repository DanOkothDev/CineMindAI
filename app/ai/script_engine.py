class ScriptEngine:
    """
    Converts structured story into screenplay format.
    """

    def generate_script(self, story: dict):
        if not story:
            return {
                "status": "error",
                "data": None,
                "error": "Missing story input"
            }

        script = {
            "format": "screenplay",
            "scenes": self._generate_scenes(story),
            "dialogue_style": "naturalistic",
            "tone": story.get("genre", "drama")
        }

        return {
            "status": "success",
            "data": script,
            "error": None
        }

    def _generate_scenes(self, story):
        theme = story.get("logline", "")

        return [
            {
                "title": "Opening World",
                "description": f"Introduction of world shaped by: {theme}",
                "location": "Establishing environment",
                "mood": "calm"
            },
            {
                "title": "Conflict Emerges",
                "description": "Protagonist encounters opposition forces",
                "location": "Tension setting",
                "mood": "tense"
            },
            {
                "title": "Resolution",
                "description": "Final confrontation and transformation",
                "location": "Climax zone",
                "mood": "emotional"
            }
        ]