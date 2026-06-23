class StoryEngine:
    """
    Converts a raw idea into a structured film narrative.
    """

    def generate_story(self, idea: str, genre: str = "drama", duration: int = 10):
        if not idea or len(idea.strip()) < 5:
            return {
                "status": "error",
                "data": None,
                "error": "Idea is too short or empty"
            }

        story = {
            "title": self._generate_title(idea),
            "logline": self._generate_logline(idea, genre),
            "genre": genre,
            "duration_minutes": duration,
            "structure": {
                "act_1": "Setup: introduce world and characters",
                "act_2": "Conflict: challenge and escalation",
                "act_3": "Resolution: climax and ending"
            },
            "themes": self._extract_themes(idea)
        }

        return {
            "status": "success",
            "data": story,
            "error": None
        }

    def _generate_title(self, idea: str):
        words = idea.split()
        return " ".join(words[:4]).title()

    def _generate_logline(self, idea: str, genre: str):
        return f"A {genre} story about {idea.lower()}."

    def _extract_themes(self, idea: str):
        keywords = []
        for word in idea.lower().split():
            if len(word) > 4:
                keywords.append(word)
        return list(set(keywords))[:5]