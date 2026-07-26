from datetime import datetime
from app.extensions import db


class Dialogue(db.Model):
    __tablename__ = "dialogues"

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    scene_id = db.Column(db.Integer, db.ForeignKey("scenes.id"), nullable=True)

    scene_title = db.Column(db.String(255))
    character = db.Column(db.String(255), nullable=False)
    line = db.Column(db.Text, nullable=False)
    emotion = db.Column(db.String(255))
    order_index = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "scene_id": self.scene_id,
            "scene_title": self.scene_title,
            "character": self.character,
            "line": self.line,
            "emotion": self.emotion,
            "order_index": self.order_index,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
