from app.extensions import db
from app.models.character import Character


class CharacterService:
    def create_character(self, project_id, data):
        if not data or not data.get("name") or not data.get("role") or not project_id:
            return {
                "status": "error",
                "data": None,
                "error": "Invalid character payload"
            }

        character = Character(
            name=data.get("name"),
            role=data.get("role"),
            relationship=data.get("relationship"),
            alignment=data.get("alignment"),
            personality=data.get("personality"),
            appearance=data.get("appearance"),
            motivation=data.get("motivation"),
            project_id=project_id
        )

        try:
            db.session.add(character)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {
                "status": "error",
                "data": None,
                "error": "Database error creating character"
            }

        return {
            "status": "success",
            "data": {
                "id": character.id,
                "name": character.name
            },
            "error": None
        }

    def get_characters(self, project_id):
        characters = Character.query.filter_by(project_id=project_id).all()

        return {
            "status": "success",
            "data": [
                {
                    "id": c.id,
                    "name": c.name,
                    "role": c.role,
                    "alignment": c.alignment,
                    "relationship": c.relationship,
                    "personality": c.personality,
                    "appearance": c.appearance,
                    "motivation": c.motivation
                }for c in characters
            ],
            "error": None
        }
    

    def get_project_characters(self, project_id):
        try:
            characters = Character.query.filter_by(project_id=project_id).all()

            return {
                "status": "success",
                "data": [
                    character.to_dict()
                    for character in characters
                ]
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }