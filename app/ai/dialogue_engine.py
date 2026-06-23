class DialogueEngine:
    """
    Generates dialogue based on character roles and scene context.
    """

    def generate_dialogue(self, scene, characters):
        dialogue = []

        if not characters:
            return {
                "status": "error",
                "data": None,
                "error": "No characters provided"
            }

        for char in characters:
            line = self._create_line(char, scene)
            dialogue.append({
                "character": char["name"],
                "line": line
            })

        return {
            "status": "success",
            "data": dialogue,
            "error": None
        }

    def _create_line(self, character, scene):
        role = character.get("role")

        templates = {
            "hero": "I can't give up now. I must continue.",
            "guide": "The path ahead is uncertain, but trust yourself.",
            "opposition": "You will never succeed in this."
        }

        return templates.get(role, "...")