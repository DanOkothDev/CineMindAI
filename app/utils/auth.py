import jwt
import datetime
from functools import wraps
from flask import request, current_app, g

from app.models.user import User


def generate_jwt(user_id: int, username: str = "", email: str = "") -> str:
    payload = {
        "sub": str(user_id),
        "username": username,
        "email": email,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def decode_jwt(token: str):
    return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])


def get_current_user():
    """Return the authenticated User or None. Reads Authorization: Bearer <token>."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[7:]
    try:
        payload = decode_jwt(token)
        return User.query.get(int(payload["sub"]))
    except Exception:
        return None


def require_auth(f):
    """Decorator that enforces JWT authentication, passes the user as first argument."""
    @wraps(f)
    def decorated(*args, **kwargs):
        from app.utils.response import error_response
        user = get_current_user()
        if not user:
            return error_response("Authentication required", 401)
        g.current_user = user
        return f(user, *args, **kwargs)
    return decorated


def optional_auth(f):
    """Decorator that attaches the user if a valid token is present but does not require it."""
    @wraps(f)
    def decorated(*args, **kwargs):
        g.current_user = get_current_user()
        return f(*args, **kwargs)
    return decorated
