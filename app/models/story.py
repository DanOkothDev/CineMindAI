from datetime import datetime
from app.extensions import db


class Story(db.Model):
    __tablename__ = "stories"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)

    title = db.Column(db.String(200))
    logline = db.Column(db.Text)
    act_one = db.Column(db.Text)
    act_two = db.Column(db.Text)
    act_three = db.Column(db.Text)
    themes = db.Column(db.Text)  # stored as JSON string
    structure = db.Column(db.Text)  # full structure JSON

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        themes = []
        if self.themes:
            try:
                themes = json.loads(self.themes)
            except Exception:
                themes = [self.themes]
        return {
            "id": self.id,
            "project_id": self.project_id,
            "title": self.title,
            "logline": self.logline,
            "act_one": self.act_one,
            "act_two": self.act_two,
            "act_three": self.act_three,
            "themes": themes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
