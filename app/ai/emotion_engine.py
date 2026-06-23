class EmotionEngine:
    """
    Generates emotional states and arcs for characters.
    """

    def generate_emotion(self, character):
        role = character.get("role")

        emotion_data = {
            "hero": {
                "base_emotion": "hopeful",
                "current_emotion": "curious",
                "emotional_arc": [
                    "hopeful",
                    "fearful",
                    "determined",
                    "fulfilled"
                ]
            },

            "guide": {
                "base_emotion": "calm",
                "current_emotion": "watchful",
                "emotional_arc": [
                    "wise",
                    "concerned",
                    "sacrificial",
                    "peaceful"
                ]
            },

            "opposition": {
                "base_emotion": "controlling",
                "current_emotion": "confident",
                "emotional_arc": [
                    "powerful",
                    "frustrated",
                    "desperate",
                    "defeated"
                ]
            }
        }

        return emotion_data.get(
            role,
            {
                "base_emotion": "neutral",
                "current_emotion": "neutral",
                "emotional_arc": ["neutral"]
            }
        )