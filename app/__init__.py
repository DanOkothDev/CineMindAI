from flask import Flask

from config import Config
from app.extensions import db, migrate


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

    return app