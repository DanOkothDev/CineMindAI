from app.extensions import db
from app.models.dialogue import Dialogue


class DialogueService:
    def create_dialogue(self, project_id, data, scene_id=None):
        if not data or not data.get("character") or not data.get("line") or not project_id:
            return {"status": "error", "data": None, "error": "Invalid dialogue payload"}

        dialogue = Dialogue(
            project_id=project_id,
            scene_id=scene_id or data.get("scene_id"),
            scene_title=data.get("scene") or data.get("scene_title"),
            character=data.get("character"),
            line=data.get("line"),
            emotion=data.get("emotion"),
            order_index=data.get("order_index", 0),
        )

        try:
            db.session.add(dialogue)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "data": None, "error": "Database error creating dialogue"}

        return {"status": "success", "data": dialogue.to_dict()}

    def get_project_dialogues(self, project_id):
        try:
            dialogues = Dialogue.query.filter_by(project_id=project_id).order_by(
                Dialogue.scene_id, Dialogue.order_index
            ).all()
            return {"status": "success", "data": [d.to_dict() for d in dialogues]}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def update_dialogue(self, dialogue_id, project_id, data):
        dialogue = Dialogue.query.filter_by(id=dialogue_id, project_id=project_id).first()
        if not dialogue:
            return {"status": "error", "error": "Dialogue not found"}

        if "character" in data:
            dialogue.character = data["character"]
        if "line" in data:
            dialogue.line = data["line"]
        if "emotion" in data:
            dialogue.emotion = data["emotion"]

        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error updating dialogue"}

        return {"status": "success", "data": dialogue.to_dict()}
