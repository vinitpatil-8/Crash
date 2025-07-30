from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # app.config.from_object(Config)
    app.config.from_object('flask_app.config.Config')
    CORS(app, supports_credentials=True, origins=["http://127.0.0.1:5500"])
    db.init_app(app)
    

    from .routes import main as main_blueprint
    from .auth_routes import auth
    app.register_blueprint(main_blueprint)
    app.register_blueprint(auth)

    return app

from . import models