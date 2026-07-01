import re
from werkzeug.security import generate_password_hash, check_password_hash

from app.extensions import db
from app.models.user import User


_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class AuthService:
    def register(self, username, email, password):
        if not username or not email or not password:
            return {"status": "error", "error": "username, email, and password are required"}

        if not _EMAIL_RE.match(email):
            return {"status": "error", "error": "Invalid email address"}

        if len(password) < 8:
            return {"status": "error", "error": "Password must be at least 8 characters"}

        if User.query.filter_by(email=email).first():
            return {"status": "error", "error": "An account with that email already exists"}

        if User.query.filter_by(username=username).first():
            return {"status": "error", "error": "That username is already taken"}

        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
        )

        try:
            db.session.add(user)
            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"status": "error", "error": "Database error during registration"}

        return {"status": "success", "data": user.to_dict()}

    def login(self, email, password):
        if not email or not password:
            return {"status": "error", "error": "email and password are required"}

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password_hash, password):
            return {"status": "error", "error": "Invalid credentials"}

        return {"status": "success", "data": user}
