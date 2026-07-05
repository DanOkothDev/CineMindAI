from app.extensions import db
from app.models.project import Project


class ProjectService:
    @staticmethod
    def _paginate_items(items, page=1, per_page=50):
        items = list(items or [])
        page = max(1, int(page or 1))
        per_page = max(1, int(per_page or 50))
        total = len(items)
        pages = max(1, (total + per_page - 1) // per_page) if total else 1
        start = (page - 1) * per_page
        end = start + per_page

        return {
            "items": items[start:end],
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": pages,
        }

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

    def get_full_project(self, project_id, include=None, page=1, per_page=50):
        """Return project + related entities for workspace initialization."""
        project = Project.query.get(project_id)
        if not project:
            return {"status": "error", "error": "Project not found"}

        include_items = []
        if isinstance(include, str):
            include_items = [item.strip() for item in include.split(",") if item.strip()]
        elif include:
            include_items = [item for item in include if item]

        story = project.stories[0].to_dict() if project.stories else None
        characters = [c.to_dict() for c in project.characters]
        scenes = [s.to_dict() for s in project.scenes]
        dialogues = [d.to_dict() for d in project.dialogues]
        visual_prompts = [v.to_dict() for v in project.visual_prompts]

        payload = {
            "project": project.to_dict(),
        }

        if not include_items or "story" in include_items:
            payload["story"] = story

        if not include_items or "characters" in include_items:
            paged_characters = self._paginate_items(characters, page=page, per_page=per_page)
            payload["characters"] = paged_characters["items"]
            payload["characters_pagination"] = {
                "page": paged_characters["page"],
                "per_page": paged_characters["per_page"],
                "total": paged_characters["total"],
                "pages": paged_characters["pages"],
            }

        if not include_items or "scenes" in include_items:
            paged_scenes = self._paginate_items(scenes, page=page, per_page=per_page)
            payload["scenes"] = paged_scenes["items"]
            payload["scenes_pagination"] = {
                "page": paged_scenes["page"],
                "per_page": paged_scenes["per_page"],
                "total": paged_scenes["total"],
                "pages": paged_scenes["pages"],
            }

        if not include_items or "dialogues" in include_items:
            paged_dialogues = self._paginate_items(dialogues, page=page, per_page=per_page)
            payload["dialogues"] = paged_dialogues["items"]
            payload["dialogues_pagination"] = {
                "page": paged_dialogues["page"],
                "per_page": paged_dialogues["per_page"],
                "total": paged_dialogues["total"],
                "pages": paged_dialogues["pages"],
            }

        if not include_items or "visual_prompts" in include_items:
            paged_visual_prompts = self._paginate_items(visual_prompts, page=page, per_page=per_page)
            payload["visual_prompts"] = paged_visual_prompts["items"]
            payload["visual_prompts_pagination"] = {
                "page": paged_visual_prompts["page"],
                "per_page": paged_visual_prompts["per_page"],
                "total": paged_visual_prompts["total"],
                "pages": paged_visual_prompts["pages"],
            }

        return {
            "status": "success",
            "data": payload,
        }
