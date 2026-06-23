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

    return app