import json

from app.ai.gemini_client import GeminiClient


class DialogueEngine:
    """
    Hybrid dialogue system:
    - AI generates cinematic scene conversations
    - Rule engine provides reliable fallback
    """

    def __init__(self):
        self.ai = GeminiClient()


    def generate_dialogues(self, story, characters, scenes):
        if not story or not characters or not scenes:
            return {
                "status": "error",
                "data": None,
                "error": "Story, characters and scenes are required"
            }


        ai_result = self._generate_with_ai(
            story,
            characters,
            scenes
        )


        if ai_result["status"] == "success":
            print("Gemini Dialogue Engine Active")
            return ai_result


        print("Gemini Dialogue Engine failed:")
        print(ai_result["error"])

        print("Falling back to local Dialogue Engine")


        dialogues = []

        for scene in scenes:
            result = self._local_generate(
                scene,
                characters
            )

            dialogues.append({
                "scene": scene["title"],
                "dialogue": result
            })


        return {
            "status": "success",
            "data": dialogues,
            "error": None
        }


    def _generate_with_ai(self, story, characters, scenes):

        prompt = f"""
        You are a professional Hollywood screenplay writer.

        Story:
        {story}

        Characters:
        {characters}

        Scenes:
        {scenes}

        Create emotional and realistic dialogue.

        Return ONLY valid JSON:

        [
            {{
                "scene": "",
                "dialogue": [
                    {{
                        "character": "",
                        "line": ""
                    }}
                ]
            }}
        ]
        """


        response = self.ai.generate(prompt)


        if response["status"] != "success":
            return response



        try:
            data = response["data"]

            if "```json" in data:
                data = data.replace("```json", "")

            data = data.replace("```", "").strip()


            dialogues = json.loads(data)


            return {
                "status": "success",
                "data": dialogues,
                "error": None
            }


        except Exception as e:
            return {
                "status": "error",
                "data": None,
                "error": f"AI returned invalid JSON: {str(e)}"
            }


    def _local_generate(self, scene, characters):

        dialogue = []


        for char in characters:

            emotion = self._extract_emotion(char)


            line = self._generate_line(
                role=char.get("role"),
                emotion=emotion,
                mood=scene.get("mood", "neutral")
            )


            dialogue.append({
                "character": char.get("name"),
                "line": line
            })


        return dialogue


    def _generate_line(self, role, emotion, mood):

        if role == "hero":
            return self._hero_line(
                emotion["current"],
                mood
            )


        if role == "guide":
            return self._mentor_line(
                emotion["current"],
                mood
            )


        if role == "opposition":
            return self._antagonist_line(
                emotion["current"],
                mood
            )


        return "..."


    def _hero_line(self, emotion, mood):

        if "fear" in emotion:
            return "I can't do this... but I can't stop now."


        if "doubt" in emotion:
            return "What if I was never meant for this?"


        if "determ" in emotion:
            return "No matter what happens, I will move forward."


        if mood == "chaotic":
            return "Everything is breaking around me, but I must stand."


        return "I will keep going."


    def _mentor_line(self, emotion, mood):

        if mood == "chaotic":
            return "Hold your ground. Do not lose yourself."


        if "watch" in emotion or "concern" in emotion:
            return "You already know what you must do."


        return "Trust what you already understand."


    def _antagonist_line(self, emotion, mood):

        if "desper" in emotion:
            return "This is not over. Not even close."


        if mood == "chaotic":
            return "Let everything collapse. I will remain."


        return "You cannot change what has already been written."


    def _extract_emotion(self, character):

        emotion = character.get("emotion", {})


        return {
            "base": emotion.get(
                "base_emotion",
                "neutral"
            ),
            "current": emotion.get(
                "current_emotion",
                "neutral"
            ),
            "arc": emotion.get(
                "emotional_arc",
                []
            )
        }