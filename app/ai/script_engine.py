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
        return [
            {
                "scene": 1,
                "description": "Opening setup of world and characters",
                "purpose": "introduction"
            },
            {
                "scene": 2,
                "description": "Conflict begins to emerge",
                "purpose": "rising action"
            },
            {
                "scene": 3,
                "description": "Climax and resolution",
                "purpose": "ending"
            }
        ]