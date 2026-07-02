import json

from app.ai.gemini_client import GeminiClient


class StoryEngine:
    """
    Converts a raw idea into a structured film narrative
    using Gemini AI with a local fallback.
    """

    def __init__(self):
        self.ai = GeminiClient()


    def generate_story(
        self,
        idea: str,
        genre: str = "drama",
        duration: int = 10
    ):
        if not idea or len(idea.strip()) < 5:
            return {
                "status": "error",
                "data": None,
                "error": "Idea is too short or empty"
            }


        ai_result = self._generate_with_ai(
            idea,
            genre,
            duration
        )


        if ai_result["status"] == "success":
            print("emini Story Engine Active")
            return ai_result


        story = self._local_generate(
            idea,
            genre,
            duration
        )

        return {
            "status": "success",
            "data": story,
            "error": None
        }


    def _generate_with_ai(
        self,
        idea,
        genre,
        duration
    ):
        prompt = f"""
            You are an expert Hollywood screenwriter.

            Create a movie story.

            Idea:
            {idea}

            Genre:
            {genre}

            Duration:
            {duration} minutes


            Return ONLY raw JSON.
            Do not use Markdown.
            Do not wrap the response in ```json blocks.

            Use this exact format:

            {{
                "title": "",
                "logline": "",
                "genre": "{genre}",
                "duration_minutes": {duration},
                "structure": {{
                    "act_1": "",
                    "act_2": "",
                    "act_3": ""
                }},
                "themes": []
            }}
        """

        response = self.ai.generate(prompt)


        if response["status"] != "success":
            return response
      

        try:
            cleaned_response = self._clean_json_response(
                response["data"]
            )

            story = json.loads(cleaned_response)

            return {
                "status": "success",
                "data": story,
                "error": None
            }

        except Exception:
            return {
                "status": "error",
                "data": None,
                "error": "AI returned invalid JSON"
            }

    def _clean_json_response(self, text):
        """
        Removes Markdown JSON code block wrappers from AI responses.
        """
        text = text.replace("```json", "")
        text = text.replace("```", "")

        return text.strip()

    def _local_generate(
        self,
        idea,
        genre,
        duration
    ):
        return {
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


    def _generate_title(self, idea):
        words = idea.split()
        return " ".join(words[:4]).title()


    def _generate_logline(self, idea, genre):
        return f"A {genre} story about {idea.lower()}."


    def _extract_themes(self, idea):
        keywords = []

        for word in idea.lower().split():
            if len(word) > 4:
                keywords.append(word)

        return list(set(keywords))[:5]