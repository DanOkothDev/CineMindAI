import json

from app.ai.gemini_client import GeminiClient


class VisualPromptEngine:
    """
    Converts story scenes into cinematic AI image/video prompts.
    """

    def __init__(self):
        self.ai = GeminiClient()


    def generate_visual_prompts(
        self,
        story,
        characters,
        scenes
    ):
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
            print("Gemini Visual Engine Active")
            return ai_result



        prompts = self._local_generate(
            characters,
            scenes
        )


        return {
            "status": "success",
            "data": prompts,
            "error": None
        }


    def _generate_with_ai(
        self,
        story,
        characters,
        scenes
    ):

        prompt = f"""
        You are a Hollywood cinematographer and AI prompt engineer.

        Analyze this movie information and create cinematic visual prompts.

        Story:
        {story}

        Characters:
        {characters}

        Scenes:
        {scenes}


        Return ONLY valid JSON:

        [
            {{
                "scene": "",
                "camera": "",
                "lighting": "",
                "style": "",
                "visual_prompt": ""
            }}
        ]
        """


        response = self.ai.generate(prompt)


        if response["status"] != "success":
            return response



        try:
            data = response["data"]


            if "```json" in data:
                data = data.replace(
                    "```json",
                    ""
                )


            data = data.replace(
                "```",
                ""
            ).strip()


            visuals = json.loads(data)


            return {
                "status": "success",
                "data": visuals,
                "error": None
            }


        except Exception as e:
            return {
                "status": "error",
                "data": None,
                "error": f"AI returned invalid JSON: {str(e)}"
            }


    def _local_generate(
        self,
        characters,
        scenes
    ):

        visuals = []


        for scene in scenes:

            visuals.append({
                "scene": scene.get(
                    "title",
                    "Unknown Scene"
                ),
                "camera": self._camera_angle(
                    scene
                ),
                "lighting": self._lighting(
                    scene
                ),
                "style": (
                    "cinematic movie style, "
                    "high detail, realistic textures"
                ),
                "visual_prompt": self._build_prompt(
                    scene,
                    characters
                )
            })


        return visuals


    def _build_prompt(
        self,
        scene,
        characters
    ):

        names = []

        for char in characters:
            names.append(
                char["name"]
            )


        character_text = ", ".join(
            names
        )


        return (
            f"{scene.get('description')}. "
            f"Featuring {character_text}. "
            f"{self._lighting(scene)}. "
            f"{self._camera_angle(scene)}. "
            "cinematic composition, dramatic atmosphere, "
            "ultra detailed, movie quality."
        )


    def _camera_angle(
        self,
        scene
    ):

        mood = scene.get(
            "mood",
            "neutral"
        )


        angles = {
            "hopeful": "wide-angle heroic shot",
            "calm": "soft medium shot",
            "tense": "close-up dramatic shot",
            "chaotic": "dynamic low-angle action shot",
            "emotional": "intimate close-up shot",
            "dark": "high contrast cinematic shot",
            "intense": "fast moving action shot"
        }


        return angles.get(
            mood,
            "cinematic camera shot"
        )


    def _lighting(
        self,
        scene
    ):

        mood = scene.get(
            "mood",
            "neutral"
        )


        lights = {
            "hopeful": "golden sunrise lighting",
            "calm": "natural soft lighting",
            "tense": "shadowy dramatic lighting",
            "chaotic": "lightning flashes and strong contrast",
            "emotional": "warm soft emotional lighting",
            "dark": "dark shadows and cold colors",
            "intense": "high contrast cinematic lighting"
        }


        return lights.get(
            mood,
            "professional cinematic lighting"
        )