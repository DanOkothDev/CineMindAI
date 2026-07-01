from app.extensions import db
from app.models.character import Character


class CharacterService:
    def create_character(self, project_id, data):
        if not data or not data.get("name") or not project_id:
            return {"status": "error", "data": None, "error": "Invalid character payload"}

        character = Character(
            name=data.get("name"),
            role=data.get("role"),
            relationship=data.get("relationship"),
            alignment=data.get("alignment"),
            personality=data.get("personality"),
            appearance=data.get("appearance"),
            motivation=data.get("motivation"),
            project_id=project_id,
        )

        try:
            db.session.add(character)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "data": None, "error": "Database error creating character"}

        return {"status": "success", "data": character.to_dict()}

    def get_characters(self, project_id):
        return self.get_project_characters(project_id)

    def get_project_characters(self, project_id):
        try:
            characters = Character.query.filter_by(project_id=project_id).all()
            return {"status": "success", "data": [c.to_dict() for c in characters]}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def update_character(self, character_id, project_id, data):
        character = Character.query.filter_by(id=character_id, project_id=project_id).first()
        if not character:
            return {"status": "error", "error": "Character not found"}

        for field in ("name", "role", "relationship", "alignment", "personality", "appearance", "motivation"):
            if field in data:
                setattr(character, field, data[field])

        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error updating character"}

        return {"status": "success", "data": character.to_dict()}

    def delete_character(self, character_id, project_id):
        character = Character.query.filter_by(id=character_id, project_id=project_id).first()
        if not character:
            return {"status": "error", "error": "Character not found"}
        try:
            db.session.delete(character)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error deleting character"}
        return {"status": "success", "data": None}
