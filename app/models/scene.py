from datetime import datetime
from app.extensions import db


class Scene(db.Model):
    __tablename__ = "scenes"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)

    location = db.Column(db.String(255))
    mood = db.Column(db.String(255))
    number = db.Column(db.Integer)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    dialogues = db.relationship("Dialogue", backref="scene", lazy=True, cascade="all, delete-orphan")
    visual_prompts = db.relationship("VisualPrompt", backref="scene", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "mood": self.mood,
            "number": self.number,
            "heading": self.title,
            "content": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
