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

    
    from app.models import project, character, scene

   
    from app.routes.main import main
    app.register_blueprint(main)

    
    from app.routes.api import api

    # Import routes so they attach to the api blueprint
    from app.routes.api import story_routes
    from app.routes.api import character_routes
    from app.routes.api import script_routes
    from app.routes.api import validation_routes
    from app.routes.api import project_routes
    from app.routes.api import scene_routes
    from app.routes.api import generator_routes

    app.register_blueprint(api)

    @app.errorhandler(ApiError)
    def handle_api_error(error):
        return error_response(
            error.message,
            error.status_code,
            error.data
        )


    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return error_response(
            error.description,
            error.code
        )


    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.exception(error)
        return error_response(
            "Internal server error",
            500
        )

    return app