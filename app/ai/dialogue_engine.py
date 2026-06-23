class DialogueEngine:
    """
    Hybrid dialogue system:
    - RULES: deterministic fallback (current system)
    - AI: future LLM-based generation
    - HYBRID: decides dynamically
    """

    def __init__(self, use_ai=False, ai_client=None):
        self.use_ai = use_ai
        self.ai_client = ai_client  # placeholder for OpenAI / local model

    def generate_dialogue(self, scene, characters):
        if not scene or not characters:
            return {
                "status": "error",
                "data": None,
                "error": "Scene and characters are required"
            }

        mood = scene.get("mood", "neutral")
        title = scene.get("title", "Scene")

        dialogue = []

        for char in characters:
            role = char.get("role", "unknown")
            name = char.get("name", "Unknown")
            emotion_data = self._extract_emotion(char)

            line = self._generate_line(
                name=name,
                role=role,
                emotion_data=emotion_data,
                mood=mood,
                scene=scene,
                character=char
            )

            dialogue.append({
                "character": name,
                "line": line
            })

        return {
            "status": "success",
            "data": dialogue,
            "error": None
        }

    
    def _generate_line(self, name, role, emotion_data, mood, scene, character):

        # HYBRID SWITCH
        if self.use_ai and self.ai_client:
            ai_line = self._ai_generate_line(name, role, emotion_data, mood, scene, character)
            if ai_line:
                return ai_line  # fallback only if AI succeeds

        # fallback = rule-based
        return self._rule_generate_line(role, emotion_data, mood)

    
    def _rule_generate_line(self, role, emotion, mood):

        current = emotion.get("current", "")
        base = emotion.get("base", "")

        if role == "hero":
            return self._hero_line(current, mood)

        if role == "guide":
            return self._mentor_line(current, mood)

        if role == "opposition":
            return self._antagonist_line(current, mood)

        return "..."

    def _hero_line(self, emotion, mood):
        if "fear" in emotion:
            return "I can't do this... but I can't stop now."
        if "doubt" in emotion:
            return "What if I'm not meant for this?"
        if "determ" in emotion:
            return "No matter what happens, I will move forward."
        if mood == "chaotic":
            return "Everything is breaking... but so am I."
        return "I will keep going."

    def _mentor_line(self, emotion, mood):
        if mood == "chaotic":
            return "Hold your ground. Do not lose yourself."
        if "watch" in emotion or "concern" in emotion:
            return "You already know what you must do."
        return "Trust what you already understand."

    def _antagonist_line(self, emotion, mood):
        if "desper" in emotion:
            return "This is not over... not even close."
        if mood == "chaotic":
            return "Let everything collapse. I will remain."
        return "You cannot change what is already set."

    
    def _ai_generate_line(self, name, role, emotion, mood, scene, character):
        """
        Future AI integration point.
        Right now returns None (forces fallback safely).
        """

        prompt = f"""
        Character: {name}
        Role: {role}
        Emotion: {emotion}
        Mood: {mood}
        Scene: {scene.get('title')}

        Write a short emotional dialogue line.
        """

        try:
            # Example placeholder:
            # response = self.ai_client.generate(prompt)
            # return response.text

            return None  # safe fallback for now

        except Exception:
            return None


    def _extract_emotion(self, char):
        emotion_block = char.get("emotion", {})

        return {
            "base": emotion_block.get("base_emotion", "neutral"),
            "current": emotion_block.get("current_emotion", "neutral"),
            "arc": emotion_block.get("emotional_arc", [])
        }