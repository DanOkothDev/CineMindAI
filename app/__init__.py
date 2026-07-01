from flask import Flask

from config import Config
from app.extensions import db, migrate
from app.utils.exceptions import ApiError
from app.utils.response import error_response
from werkzeug.exceptions import HTTPException


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    # Register all models so Alembic/migrate can see them
    from app.models import User, Project, Story, Character, Scene, Dialogue, VisualPrompt  # noqa: F401

    # Register blueprints
    from app.routes.main import main
    app.register_blueprint(main)

    from app.routes.api import api

    from app.routes.api import auth_routes      # noqa: F401
    from app.routes.api import story_routes     # noqa: F401
    from app.routes.api import character_routes # noqa: F401
    from app.routes.api import scene_routes     # noqa: F401
    from app.routes.api import script_routes    # noqa: F401
    from app.routes.api import validation_routes # noqa: F401
    from app.routes.api import project_routes   # noqa: F401
    from app.routes.api import generator_routes # noqa: F401
    from app.routes.api import dialogue_routes       # noqa: F401
    from app.routes.api import visual_prompt_routes  # noqa: F401
    from app.routes.api import export_routes         # noqa: F401

    app.register_blueprint(api)

    @app.errorhandler(ApiError)
    def handle_api_error(error):
        return error_response(error.message, error.status_code, error.data)

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return error_response(error.description, error.code)

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.exception(error)
        return error_response("Internal server error", 500)

    return app
