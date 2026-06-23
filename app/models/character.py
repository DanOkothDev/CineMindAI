from datetime import datetime
from app.extensions import db


class Character(db.Model):
    __tablename__ = "characters"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=True)

    personality = db.Column(db.Text, nullable=True)
    appearance = db.Column(db.Text, nullable=True)
    motivation = db.Column(db.Text, nullable=True)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)