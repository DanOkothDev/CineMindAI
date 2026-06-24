class AIClient:
    """
    Central AI gateway for CineMindAI.
    Every engine will talk to AI through this class.
    """

    def __init__(self, enabled=False):
        self.enabled = enabled

    def generate(self, prompt):
        """
        Sends prompt to AI.
        For now we simulate AI responses.
        Real API integration comes next.
        """

        if not self.enabled:
            return None

        return f"AI generated response for: {prompt[:50]}..."