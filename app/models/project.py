from datetime import datetime
from app.extensions import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)
    genre = db.Column(db.String(50))
    idea = db.Column(db.Text, nullable=False)
    logline = db.Column(db.Text)
    summary = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    characters = db.relationship("Character", backref="project", lazy=True)
    scenes = db.relationship("Scene", backref="project", lazy=True)