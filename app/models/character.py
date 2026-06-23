from datetime import datetime
from app.extensions import db


class Character(db.Model):
    __tablename__ = "characters"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    relationship = db.Column(db.String(100))
    alignment = db.Column(db.String(50))  # hero, neutral, villain

    personality = db.Column(db.Text)
    appearance = db.Column(db.Text)
    motivation = db.Column(db.Text)

    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)