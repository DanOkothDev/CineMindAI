from app.extensions import db
from app.models.character import Character


class CharacterService:
    def create_character(self, project_id, data):
        character = Character(
            name=data.get("name"),
            role=data.get("role"),
            personality=data.get("personality"),
            appearance=data.get("appearance"),
            motivation=data.get("motivation"),
            project_id=project_id
        )

        db.session.add(character)
        db.session.commit()

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
                    "personality": c.personality,
                    "motivation": c.motivation
                } for c in characters
            ],
            "error": None
        }