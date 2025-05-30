from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.profile import profile_bp
from routes.like import like_bp
from routes.match import match_bp
from routes.wallet import wallet_bp
from config import Config
import os

app = Flask(__name__)
app.config.from_object(Config)

CORS(
    app,
    resources={r"/*": {"origins": app.config["FRONTEND_ORIGIN"]}},
    supports_credentials=True
)

db.init_app(app)

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(like_bp)
app.register_blueprint(match_bp)
app.register_blueprint(wallet_bp)

@app.route('/static/avatars/<path:filename>')
def serve_avatar(filename):
    return send_from_directory(os.path.join(app.root_path, 'static', 'avatars'), filename)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
