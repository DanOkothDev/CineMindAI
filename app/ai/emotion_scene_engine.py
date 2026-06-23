class EmotionSceneEngine:
    """
    Generates emotionally continuous scenes influenced by:
    - story progression
    - character emotional states
    - relationship pressure
    - memory layer
    """

    def generate_scenes(self, story, characters, relationships, memory=None):
        if not story or not characters:
            return {
                "status": "error",
                "data": None,
                "error": "Story and characters required"
            }

        scenes = []
        previous_emotions = {}

        base_mood = "calm"

        for i, act in enumerate(story.get("structure", {}).values()):

            scene = self._build_scene(
                index=i,
                act=act,
                story=story,
                characters=characters,
                relationships=relationships,
                previous_emotions=previous_emotions,
                memory=memory
            )

            # update emotional state tracker
            previous_emotions = scene.get("emotional_state", previous_emotions)

            scenes.append(scene)

        return {
            "status": "success",
            "data": scenes,
            "error": None
        }

    
    def _build_scene(self, index, act, story, characters, relationships, previous_emotions, memory):

        hero = self._get_character(characters, "hero")
        guide = self._get_character(characters, "guide")
        villain = self._get_character(characters, "opposition")

        hero_emotion = self._evolve_emotion(hero, previous_emotions.get("hero", "curious"))
        guide_emotion = self._evolve_emotion(guide, previous_emotions.get("guide", "watchful"))
        villain_emotion = self._evolve_emotion(villain, previous_emotions.get("opposition", "confident"))

        mood = self._derive_mood(hero_emotion, villain_emotion)

        scene = {
            "title": self._scene_title(index, act),
            "description": self._scene_description(act, hero_emotion, villain_emotion),
            "mood": mood,
            "purpose": act,
            "emotional_state": {
                "hero": hero_emotion,
                "guide": guide_emotion,
                "antagonist": villain_emotion
            }
        }

        return scene

    
    def _evolve_emotion(self, character, previous_emotion):

        role = character.get("role", "unknown")
        base_emotion = character.get("emotion", {}).get("current_emotion", "neutral")

        # progression logic (simple but powerful)
        transitions = {
            "curious": "fearful",
            "fearful": "determined",
            "determined": "resistant",
            "confident": "frustrated",
            "frustrated": "desperate",
            "watchful": "concerned",
            "concerned": "sacrificial"
        }

        # blend memory + previous state
        if previous_emotion in transitions:
            return transitions[previous_emotion]

        return base_emotion

    
    def _derive_mood(self, hero_emotion, villain_emotion):

        if hero_emotion in ["fearful", "desperate"] and villain_emotion in ["confident", "dominating"]:
            return "tense"

        if hero_emotion in ["determined", "resistant"]:
            return "intense"

        if hero_emotion == "broken":
            return "emotional"

        return "calm"

    
    def _scene_title(self, index, act):
        titles = ["Awakening", "Rising Conflict", "Breaking Point", "Storm Clash", "Aftermath"]
        return titles[index] if index < len(titles) else f"Scene {index + 1}"

    def _scene_description(self, act, hero_emotion, villain_emotion):
        return f"{act} driven by emotional tension between hero ({hero_emotion}) and antagonist ({villain_emotion})"

    def _get_character(self, characters, role):
        for c in characters:
            if c.get("role") == role:
                return c
        return {}