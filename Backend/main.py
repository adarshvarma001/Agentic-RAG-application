from flask import Flask
from flask_cors import CORS

from api.chat import chat_bp
from api.analytics import analytics_bp

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

app.register_blueprint(chat_bp)

app.register_blueprint(analytics_bp)


@app.route("/")
def health():

    return {
        "status": "running"
    }


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )