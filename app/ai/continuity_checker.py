class ContinuityChecker:
    """
    Ensures consistency across story, characters, and scenes.
    """

    def check_consistency(self, story: dict, characters: list, scenes: list):
        issues = []

        if not story:
            return {
                "status": "error",
                "data": None,
                "error": "Missing story"
            }

        if len(scenes) < 2:
            issues.append("Story may be underdeveloped: too few scenes")

        for char in characters:
            if "motivation" not in char:
                issues.append(f"Character {char.get('name')} missing motivation")

        result = {
            "is_consistent": len(issues) == 0,
            "issues": issues,
            "recommendation": self._generate_recommendation(issues)
        }

        return {
            "status": "success",
            "data": result,
            "error": None
        }

    def _generate_recommendation(self, issues):
        if not issues:
            return "Story structure is consistent"

        return "Review character motivations and scene progression"