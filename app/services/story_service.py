import json

from app.extensions import db
from app.models.story import Story


class StoryService:
    def create_story(self, project_id, story_data):
        if not project_id or not story_data:
            return {"status": "error", "error": "Invalid story payload"}

        # Extract three-act structure — AI returns act_1/2/3; also accept legacy key shapes
        structure = story_data.get("structure", {})
        act_one = (
            structure.get("act_1") or structure.get("act_one")
            or structure.get("act1") or structure.get("setup")
        )
        act_two = (
            structure.get("act_2") or structure.get("act_two")
            or structure.get("act2") or structure.get("confrontation")
        )
        act_three = (
            structure.get("act_3") or structure.get("act_three")
            or structure.get("act3") or structure.get("resolution")
        )

        themes = story_data.get("themes", [])

        story = Story(
            project_id=project_id,
            title=story_data.get("title"),
            logline=story_data.get("logline"),
            act_one=act_one,
            act_two=act_two,
            act_three=act_three,
            themes=json.dumps(themes) if themes else None,
            structure=json.dumps(structure) if structure else None,
        )

        try:
            db.session.add(story)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error creating story"}

        return {"status": "success", "data": story.to_dict()}

    def get_project_story(self, project_id):
        story = Story.query.filter_by(project_id=project_id).first()
        if not story:
            return {"status": "error", "error": "Story not found"}
        return {"status": "success", "data": story.to_dict()}
