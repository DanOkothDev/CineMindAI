import json

from app.ai.gemini_client import GeminiClient
from app.ai.emotion_engine import EmotionEngine


class CharacterEngine:
    """
    Generates structured characters, relationships,
    and emotional states using Gemini AI with local fallback.
    """

    def __init__(self):
        self.ai = GeminiClient()
        self.emotion_engine = EmotionEngine()


    def generate_characters(self, story: dict):

        if not story:
            return {
                "status": "error",
                "data": None,
                "error": "Story is required"
            }

        ai_result = self._generate_with_ai(story)

        if ai_result["status"] == "success":
            print("Gemini Character Engine Active")
            return ai_result


        data = self._local_generate(story)

        return {
            "status": "success",
            "data": data,
            "error": None
        }


    def _generate_with_ai(self, story):

        prompt = f"""
        You are an expert Hollywood character designer.

        Analyze the story and create important characters.

        Story Title:
        {story.get("title")}

        Logline:
        {story.get("logline")}


        Return ONLY valid JSON:

        {{
            "characters": [
                {{
                    "name": "",
                    "role": "",
                    "alignment": "",
                    "personality": "",
                    "appearance": "",
                    "motivation": "",
                    "conflict": "",
                    "emotion": {{
                        "base_emotion": "",
                        "current_emotion": "",
                        "emotional_arc": []
                    }}
                }}
            ]
        }}
        """

        response = self.ai.generate(prompt)


        if response["status"] != "success":
            return response



        try:

            clean_data = self._clean_json(
                response["data"]
            )

            characters_data = json.loads(clean_data)


            relationships = self.build_relationships(
                characters_data["characters"]
            )


            return {
                "status": "success",
                "data": {
                    "characters": characters_data["characters"],
                    "relationships": relationships
                },
                "error": None
            }


        except Exception as e:

            return {
                "status": "error",
                "data": None,
                "error": f"AI returned invalid JSON: {e}"
            }


    def _clean_json(self, text):

        text = text.replace("```json", "")
        text = text.replace("```", "")

        return text.strip()


    def _local_generate(self, story):

        context = story.get("logline", "")


        characters = [

            self._create_character(
                "Protagonist",
                "hero",
                context
            ),

            self._create_character(
                "Mentor",
                "guide",
                context
            ),

            self._create_character(
                "Antagonist",
                "opposition",
                context
            )
        ]


        relationships = self.build_relationships(
            characters
        )


        return {
            "characters": characters,
            "relationships": relationships
        }


    def _create_character(self, name, role, context):

        character = {
            "name": name,
            "role": role,
            "alignment": role,
            "personality": self._generate_personality(role),
            "appearance": self._generate_appearance(role),
            "motivation": self._generate_motivation(context, role),
            "conflict": self._generate_conflict(role)
        }


        character["emotion"] = (
            self.emotion_engine.generate_emotion(character)
        )


        return character


    def _generate_personality(self, role):

        personalities = {
            "hero": "brave, curious, emotionally driven",
            "guide": "wise, calm, strategic thinker",
            "opposition": (
                "intelligent, unpredictable, driven by control"
            )
        }

        return personalities.get(
            role,
            "neutral personality"
        )


    def _generate_appearance(self, role):

        return (
            f"Visual identity reflecting {role} archetype"
        )


    def _generate_motivation(self, context, role):

        return (
            f"{role} shaped by: {context[:80]}"
        )


    def _generate_conflict(self, role):

        conflicts = {
            "hero":
            "Struggles with self-doubt and external obstacles",

            "guide":
            "Hides deeper knowledge that could change the outcome",

            "opposition":
            "Believes control is the only path to survival"
        }

        return conflicts.get(
            role,
            "Internal struggle tied to identity"
        )


    def build_relationships(self, characters):

        relationships = []


        for char in characters:

            for other in characters:

                if char["name"] == other["name"]:
                    continue


                relationships.append({
                    "from": char["name"],
                    "to": other["name"],
                    "relationship":
                    self._infer_relationship(
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
            ("opposition", "guide"): "manipulation"
        }


        return rules.get(
            (role1, role2),
            "neutral"
        )