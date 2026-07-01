from app.extensions import db
from app.models.scene import Scene


class SceneService:
    def create_scene(self, project_id, data):
        if not data or not data.get("title") or not data.get("description") or not project_id:
            return {"status": "error", "data": None, "error": "Invalid scene payload"}

        scene = Scene(
            title=data.get("title"),
            description=data.get("description"),
            location=data.get("location"),
            mood=data.get("mood"),
            number=data.get("number"),
            project_id=project_id,
        )

        try:
            db.session.add(scene)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "data": None, "error": "Database error creating scene"}

        return {"status": "success", "data": scene.to_dict()}

    def get_scenes(self, project_id):
        scenes = Scene.query.filter_by(project_id=project_id).order_by(Scene.number, Scene.id).all()
        return {"status": "success", "data": [s.to_dict() for s in scenes]}

    def get_project_scenes(self, project_id):
        return self.get_scenes(project_id)

    def update_scene(self, scene_id, project_id, data):
        scene = Scene.query.filter_by(id=scene_id, project_id=project_id).first()
        if not scene:
            return {"status": "error", "error": "Scene not found"}

        for field in ("title", "description", "location", "mood", "number"):
            if field in data:
                setattr(scene, field, data[field])
        # Allow heading/content aliases from frontend
        if "heading" in data:
            scene.title = data["heading"]
        if "content" in data:
            scene.description = data["content"]

        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error updating scene"}

        return {"status": "success", "data": scene.to_dict()}

    def delete_scene(self, scene_id, project_id):
        scene = Scene.query.filter_by(id=scene_id, project_id=project_id).first()
        if not scene:
            return {"status": "error", "error": "Scene not found"}
        try:
            db.session.delete(scene)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error deleting scene"}
        return {"status": "success", "data": None}
