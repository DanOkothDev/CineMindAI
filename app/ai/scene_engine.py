import json

from app.ai.gemini_client import GeminiClient


class SceneEngine:
    """
    Generates cinematic scenes using Gemini AI
    with a local emotional fallback.
    """

    def __init__(self):
        self.ai = GeminiClient()


    def generate_scenes(self, story, characters):

        if not story or not characters:
            return {
                "status": "error",
                "data": None,
                "error": "Story and characters are required"
            }


        ai_result = self._generate_with_ai(
            story,
            characters
        )


        if ai_result["status"] == "success":
            print("Gemini Scene Engine Active")
            return ai_result


        print("Gemini Scene Engine failed:")
        print(ai_result["error"])

        print("Falling back to local Scene Engine")


        scenes = self._local_generate(
            story,
            characters
        )


        return {
            "status": "success",
            "data": scenes,
            "error": None
        }


    def _generate_with_ai(self, story, characters):

        prompt = f"""
        You are an expert Hollywood film director.

        Create a cinematic scene sequence.

        Story:
        {story}


        Characters:
        {characters}


        Return ONLY valid JSON.

        Format:

        [
            {{
                "title": "",
                "location": "",
                "mood": "",
                "description": "",
                "characters": [],
                "emotional_state": {{}},
                "visual_style": ""
            }}
        ]
        """


        response = self.ai.generate(prompt)


        if response["status"] != "success":
            return response


        print("\n========== GEMINI SCENE RESPONSE ==========")
        print(response["data"])
        print("===========================================\n")


        try:

            clean_data = self._clean_json(
                response["data"]
            )


            scenes = json.loads(
                clean_data
            )


            return {
                "status": "success",
                "data": scenes,
                "error": None
            }


        except Exception as e:

            return {
                "status": "error",
                "data": None,
                "error": f"AI returned invalid JSON: {e}"
            }


    def _clean_json(self, text):

        text = text.replace(
            "```json",
            ""
        )

        text = text.replace(
            "```",
            ""
        )

        return text.strip()


    def _local_generate(self, story, characters):

        structure = story.get(
            "structure",
            {}
        )


        scenes = [
            self._build_scene(
                "Opening",
                structure.get(
                    "act_1",
                    "Beginning of the journey"
                ),
                characters,
                "hopeful"
            ),

            self._build_scene(
                "Conflict",
                structure.get(
                    "act_2",
                    "The challenge grows"
                ),
                characters,
                "tense"
            ),

            self._build_scene(
                "Finale",
                structure.get(
                    "act_3",
                    "The story reaches its conclusion"
                ),
                characters,
                "emotional"
            )
        ]


        return scenes


    def _build_scene(
        self,
        title,
        description,
        characters,
        mood
    ):

        return {
            "title": title,
            "location": "Unknown",
            "mood": mood,
            "description": description,
            "characters": [
                char["name"]
                for char in characters
            ],
            "emotional_state": self._calculate_emotions(
                characters
            ),
            "visual_style": (
                "cinematic lighting, dramatic composition"
            )
        }


    def _calculate_emotions(self, characters):

        emotions = {}


        for char in characters:

            emotion = char.get(
                "emotion",
                {}
            )

            emotions[char["name"]] = (
                emotion.get(
                    "current_emotion",
                    "neutral"
                )
            )


        return emotions