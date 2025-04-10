<<<<<<< HEAD
from flask import Flask
from flask_cors import CORS
from login_route import init_login_routes
from werkzeug.utils import secure_filename
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Inisialisasi route login dari file login_route.py
init_login_routes(app)

@app.route("/")
def home():
    return "R-Collaboration AI Backend Aktif 💜"

if __name__ == '__main__':
    app.run(debug=True)

UPLOAD_FOLDER = "backend/uploads"
DATA_FILE = "data/schedule.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_post():
    file = request.files["file"]
    caption = request.form["caption"]
    schedule = request.form["schedule"]
    filename = secure_filename(file.filename)

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    post_data = {
        "filename": filename,
        "caption": caption,
        "schedule": datetime.fromisoformat(schedule).strftime("%Y-%m-%d %H:%M:%S"),
        "akun1": "akun_pengirim",
        "akun2": "akun_penerima"
    }

    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
    else:
        data = []

    data.append(post_data)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

    return jsonify({"message": "Upload sukses! Postingan akan dijadwalin ya sayang 😘"})

=======
from flask import Flask
from flask_cors import CORS
from login_route import init_login_routes
from werkzeug.utils import secure_filename
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Inisialisasi route login dari file login_route.py
init_login_routes(app)

@app.route("/")
def home():
    return "R-Collaboration AI Backend Aktif 💜"

if __name__ == '__main__':
    app.run(debug=True)

UPLOAD_FOLDER = "backend/uploads"
DATA_FILE = "data/schedule.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_post():
    file = request.files["file"]
    caption = request.form["caption"]
    schedule = request.form["schedule"]
    filename = secure_filename(file.filename)

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    post_data = {
        "filename": filename,
        "caption": caption,
        "schedule": datetime.fromisoformat(schedule).strftime("%Y-%m-%d %H:%M:%S"),
        "akun1": "akun_pengirim",
        "akun2": "akun_penerima"
    }

    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
    else:
        data = []

    data.append(post_data)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

    return jsonify({"message": "Upload sukses! Postingan akan dijadwalin ya sayang 😘"})

>>>>>>> faf15dbb669a09caac86572f5b7a2b46bc3f08a7
