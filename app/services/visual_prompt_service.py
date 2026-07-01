from app.extensions import db
from app.models.visual_prompt import VisualPrompt


class VisualPromptService:
    def create_visual_prompt(self, project_id, data, scene_id=None):
        if not data or not project_id:
            return {"status": "error", "data": None, "error": "Invalid visual prompt payload"}

        prompt_text = (
            data.get("visual_prompt")
            or data.get("prompt")
            or data.get("text")
            or ""
        )

        vp = VisualPrompt(
            project_id=project_id,
            scene_id=scene_id or data.get("scene_id"),
            scene_title=data.get("scene") or data.get("scene_title"),
            prompt=prompt_text,
            camera=data.get("camera"),
            lighting=data.get("lighting"),
            style=data.get("style"),
        )

        try:
            db.session.add(vp)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "data": None, "error": "Database error creating visual prompt"}

        return {"status": "success", "data": vp.to_dict()}

    def get_project_visual_prompts(self, project_id):
        try:
            prompts = VisualPrompt.query.filter_by(project_id=project_id).all()
            return {"status": "success", "data": [p.to_dict() for p in prompts]}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def delete_project_visual_prompts(self, project_id):
        try:
            VisualPrompt.query.filter_by(project_id=project_id).delete()
            db.session.commit()
            return {"status": "success"}
        except Exception as e:
            db.session.rollback()
            return {"status": "error", "error": str(e)}
