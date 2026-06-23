from app.ai.emotion_engine import EmotionEngine


class CharacterEngine:
    """
    Generates structured characters, relationships, and emotional states.
    """

    def __init__(self):
        self.emotion_engine = EmotionEngine()

    def generate_characters(self, story: dict):
        if not story:
            return {
                "status": "error",
                "data": None,
                "error": "Story is required"
            }

        context = story.get("logline", "")

        characters = [
            self._create_character(
                name="Protagonist",
                role="hero",
                context=context
            ),
            self._create_character(
                name="Mentor",
                role="guide",
                context=context
            ),
            self._create_character(
                name="Antagonist",
                role="opposition",
                context=context
            )
        ]

        relationships = self.build_relationships(characters)

        return {
            "status": "success",
            "data": {
                "characters": characters,
                "relationships": relationships
            },
            "error": None
        }

    def _create_character(self, name, role, context):
        base_character = {
            "name": name,
            "role": role,
            "alignment": role,
            "personality": self._generate_personality(role),
            "appearance": self._generate_appearance(role),
            "motivation": self._generate_motivation(context, role),
            "conflict": self._generate_conflict(role)
        }

        emotion = self.emotion_engine.generate_emotion(base_character)

        base_character["emotion"] = emotion

        return base_character

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
        return f"{role} shaped by: {context[:80]}"

    def _generate_conflict(self, role):
        conflicts = {
            "hero": "Struggles with self-doubt and external obstacles",
            "guide": "Hides deeper knowledge that could change the outcome",
            "opposition": "Believes control is the only path to survival"
        }
        return conflicts.get(role, "Internal struggle tied to identity")

    def build_relationships(self, characters):
        """
        Builds directed relationship graph between characters.
        """

        relationships = []

        for char in characters:
            for other in characters:
                if char["name"] == other["name"]:
                    continue

                relationships.append({
                    "from": char["name"],
                    "to": other["name"],
                    "relationship": self._infer_relationship(
                        char["role"],
                        other["role"]
                    )
                })

        return relationships

    def _infer_relationship(self, role1, role2):
        rules = {
            ("hero", "opposition"): "conflict",
            ("opposition", "hero"): "conflict",
            ("hero", "guide"): "trust",
            ("guide", "hero"): "mentorship",
            ("guide", "opposition"): "suspicion",
            ("opposition", "guide"): "manipulation",
        }

        return rules.get((role1, role2), "neutral")