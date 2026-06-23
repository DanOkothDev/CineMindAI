class CharacterEngine:
    """
    Generates multiple characters based on story context.
    """

    def generate_characters(self, story: dict):
        if not story:
            return {
                "status": "error",
                "data": None,
                "error": "Story is required"
            }

        idea = story.get("logline", "")

        characters = [
            self._create_character(
                name="Protagonist",
                role="hero",
                context=idea
            ),
            self._create_character(
                name="Mentor",
                role="guide",
                context=idea
            ),
            self._create_character(
                name="Antagonist",
                role="opposition",
                context=idea
            )
        ]

        return {
            "status": "success",
            "data": characters,
            "error": None
        }

    def _create_character(self, name, role, context):
        return {
            "name": name,
            "role": role,
            "personality": self._generate_personality(role),
            "appearance": self._generate_appearance(role),
            "motivation": self._generate_motivation(context, role),
            "conflict": self._generate_conflict(role)
        }

    def _generate_personality(self, role):
        personalities = {
            "hero": "brave, curious, emotionally driven",
            "guide": "wise, calm, strategic thinker",
            "opposition": "intelligent, unpredictable, driven by control"
        }
        return personalities.get(role, "neutral personality")

    def _generate_appearance(self, role):
        return f"Visual identity reflecting {role} archetype"

    def _generate_motivation(self, context, role):
        return f"{role} is shaped by: {context[:80]}"

    def _generate_conflict(self, role):
        return f"Internal and external conflict tied to {role} role"