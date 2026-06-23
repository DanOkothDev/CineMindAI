from datetime import datetime
from app.extensions import db


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150), nullable=False)
    genre = db.Column(db.String(50), nullable=True)

    idea = db.Column(db.Text, nullable=False)
    logline = db.Column(db.Text, nullable=True)
    summary = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)