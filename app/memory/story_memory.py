class StoryMemory:
    """
    Stores runtime narrative state for a single project session.
    This is NOT persistent DB memory (yet), just in-process memory layer.
    """

    def __init__(self):
        self.story_states = {}

    def init_story(self, project_id, story):
        self.story_states[project_id] = {
            "story": story,
            "scene_index": 0,
            "emotion_history": {},
            "scene_history": []
        }

    def update_scene(self, project_id, scene):
        state = self.story_states.get(project_id)
        if not state:
            return

        state["scene_history"].append(scene)
        state["scene_index"] += 1

    def update_emotion(self, project_id, character_name, emotion):
        state = self.story_states.get(project_id)
        if not state:
            return

        if character_name not in state["emotion_history"]:
            state["emotion_history"][character_name] = []

        state["emotion_history"][character_name].append(emotion)

    def get_state(self, project_id):
        return self.story_states.get(project_id)