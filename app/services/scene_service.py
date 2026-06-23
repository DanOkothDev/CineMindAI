from app.extensions import db
from app.models.scene import Scene


class SceneService:
    def create_scene(self, project_id, data):
        scene = Scene(
            title=data.get("title"),
            description=data.get("description"),
            location=data.get("location"),
            mood=data.get("mood"),
            project_id=project_id
        )

        db.session.add(scene)
        db.session.commit()

        return {
            "status": "success",
            "data": {
                "id": scene.id,
                "title": scene.title
            },
            "error": None
        }

    def get_scenes(self, project_id):
        scenes = Scene.query.filter_by(project_id=project_id).all()

        return {
            "status": "success",
            "data": [
                {
                    "id": s.id,
                    "title": s.title,
                    "description": s.description,
                    "mood": s.mood
                } for s in scenes
            ],
            "error": None
        }