from app.extensions import db
from app.models.project import Project


class ProjectService:
    """
    Handles creation, retrieval, and storage of film projects.
    """

    def create_project(self, idea, genre, story_result):
        if not idea or not story_result or story_result.get("status") != "success":
            return {
                "status": "error",
                "data": None,
                "error": "Invalid story data"
            }

        story_data = story_result.get("data")
        if not story_data or not story_data.get("title"):
            return {
                "status": "error",
                "data": None,
                "error": "Missing story title"
            }

        project = Project(
            title=story_data.get("title"),
            genre=genre,
            idea=idea,
            logline=story_data.get("logline"),
            summary=str(story_data.get("structure"))
        )

        try:
            db.session.add(project)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {
                "status": "error",
                "data": None,
                "error": "Database error creating project"
            }

        return {
            "status": "success",
            "data": {
                "project_id": project.id,
                "title": project.title,
                "genre": project.genre
            },
            "error": None
        }

    def get_project(self, project_id):
        project = Project.query.get(project_id)

        if not project:
            return {
                "status": "error",
                "data": None,
                "error": "Project not found"
            }

        return {
            "status": "success",
            "data": {
                "id": project.id,
                "title": project.title,
                "genre": project.genre,
                "idea": project.idea,
                "logline": project.logline,
                "summary": project.summary,
                "created_at": str(project.created_at)
            },
            "error": None
        }