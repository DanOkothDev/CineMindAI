class CharacterEngine:
    """
    Generates structured characters for a film universe.
    """

    def create_character(self, name: str, role: str, idea_context: str):
        if not name:
            return {
                "status": "error",
                "data": None,
                "error": "Character name is required"
            }

        character = {
            "name": name,
            "role": role,
            "personality": self._generate_personality(role),
            "appearance": self._generate_appearance(name),
            "motivation": self._generate_motivation(idea_context),
            "conflict": self._generate_conflict(role)
        }

        return {
            "status": "success",
            "data": character,
            "error": None
        }

    def _generate_personality(self, role):
        return f"{role}-driven personality with strong emotional depth"

    def _generate_appearance(self, name):
        return f"Distinct visual identity for {name}"

    def _generate_motivation(self, context):
        return f"Driven by events in: {context[:60]}"

    def _generate_conflict(self, role):
        return f"Internal conflict based on {role} responsibilities"