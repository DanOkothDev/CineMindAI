from app.extensions import db
from app.models.project import Project


class ProjectService:
    def create_project(self, idea, genre, story_result, user_id=None):
        if not idea or not story_result or story_result.get("status") != "success":
            return {"status": "error", "data": None, "error": "Invalid story data"}

        story_data = story_result.get("data")
        if not story_data or not story_data.get("title"):
            return {"status": "error", "data": None, "error": "Missing story title"}

        import json
        structure = story_data.get("structure")
        project = Project(
            title=story_data.get("title"),
            genre=genre,
            idea=idea,
            logline=story_data.get("logline"),
            summary=json.dumps(structure) if structure else str(story_data),
            user_id=user_id,
        )

        try:
            db.session.add(project)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "data": None, "error": "Database error creating project"}

        return {
            "status": "success",
            "data": {
                "project_id": project.id,
                "title": project.title,
                "genre": project.genre,
            },
        }

    def get_project(self, project_id):
        project = Project.query.get(project_id)
        if not project:
            return {"status": "error", "data": None, "error": "Project not found"}
        return {"status": "success", "data": project.to_dict()}

    def get_user_projects(self, user_id):
        projects = Project.query.filter_by(user_id=user_id).order_by(Project.created_at.desc()).all()
        return {"status": "success", "data": [p.to_dict() for p in projects]}

    def get_all_projects(self):
        projects = Project.query.order_by(Project.created_at.desc()).all()
        return {"status": "success", "data": [p.to_dict() for p in projects]}

    def update_project(self, project_id, data, user_id=None):
        project = Project.query.get(project_id)
        if not project:
            return {"status": "error", "error": "Project not found"}

        if user_id and project.user_id and project.user_id != user_id:
            return {"status": "error", "error": "Forbidden", "status_code": 403}

        for field in ("title", "genre", "logline", "summary", "status"):
            if field in data:
                setattr(project, field, data[field])

        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error updating project"}

        return {"status": "success", "data": project.to_dict()}

    def delete_project(self, project_id, user_id=None):
        project = Project.query.get(project_id)
        if not project:
            return {"status": "error", "error": "Project not found"}

        if user_id and project.user_id and project.user_id != user_id:
            return {"status": "error", "error": "Forbidden", "status_code": 403}

        try:
            db.session.delete(project)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error deleting project"}

        return {"status": "success", "data": None}

    def get_full_project(self, project_id):
        """Return project + all related entities for workspace initialization."""
        project = Project.query.get(project_id)
        if not project:
            return {"status": "error", "error": "Project not found"}

        story = project.stories[0].to_dict() if project.stories else None
        characters = [c.to_dict() for c in project.characters]
        scenes = [s.to_dict() for s in project.scenes]
        dialogues = [d.to_dict() for d in project.dialogues]
        visual_prompts = [v.to_dict() for v in project.visual_prompts]

        return {
            "status": "success",
            "data": {
                "project": project.to_dict(),
                "story": story,
                "characters": characters,
                "scenes": scenes,
                "dialogues": dialogues,
                "visual_prompts": visual_prompts,
            },
        }
