from datetime import datetime
from app.extensions import db


class VisualPrompt(db.Model):
    __tablename__ = "visual_prompts"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    scene_id = db.Column(db.Integer, db.ForeignKey("scenes.id"), nullable=True)

    scene_title = db.Column(db.String(200))
    prompt = db.Column(db.Text, nullable=False)
    camera = db.Column(db.String(200))
    lighting = db.Column(db.String(200))
    style = db.Column(db.String(200))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "scene_id": self.scene_id,
            "scene_title": self.scene_title,
            "prompt": self.prompt,
            "camera": self.camera,
            "lighting": self.lighting,
            "style": self.style,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
