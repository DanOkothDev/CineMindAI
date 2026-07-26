from datetime import datetime
from app.extensions import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    title = db.Column(db.String(255), nullable=False)
    genre = db.Column(db.String(255))
    idea = db.Column(db.Text, nullable=False)
    logline = db.Column(db.Text)
    summary = db.Column(db.Text)
    status = db.Column(db.String(255), default="draft")
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    characters = db.relationship("Character", backref="project", lazy=True, cascade="all, delete-orphan")
    scenes = db.relationship("Scene", backref="project", lazy=True, cascade="all, delete-orphan")
    dialogues = db.relationship("Dialogue", backref="project", lazy=True, cascade="all, delete-orphan")
    visual_prompts = db.relationship("VisualPrompt", backref="project", lazy=True, cascade="all, delete-orphan")
    stories = db.relationship("Story", backref="project", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "genre": self.genre,
            "idea": self.idea,
            "logline": self.logline,
            "summary": self.summary,
            "status": self.status,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
