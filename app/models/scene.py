from datetime import datetime
from app.extensions import db


class Scene(db.Model):
    __tablename__ = "scenes"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)

    location = db.Column(db.String(150), nullable=True)
    mood = db.Column(db.String(100), nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)