<<<<<<< HEAD
from flask import request, jsonify
import json
import os

def init_login_routes(app):
    @app.route("/login/manual", methods=["POST"])
    def login_manual():
        data = request.get_json()

        akun1 = data.get("akun1")
        akun1_pass = data.get("akun1_pass")
        akun2 = data.get("akun2")
        akun2_pass = data.get("akun2_pass")

        if not akun1 or not akun1_pass or not akun2 or not akun2_pass:
            return jsonify({"success": False, "message": "Isi semua data login!"}), 400

        # Simpan ke file login.json
        login_data = {
            "akun1": akun1,
            "akun1_pass": akun1_pass,
            "akun2": akun2,
            "akun2_pass": akun2_pass
        }

        os.makedirs("data", exist_ok=True)
        with open("data/login.json", "w") as f:
            json.dump(login_data, f)

        return jsonify({"success": True, "message": "Login manual berhasil dan data tersimpan!"})

    @app.route("/login/cookie", methods=["POST"])
    def login_cookie():
        data = request.get_json()
        cookie = data.get("cookie")

        if not cookie:
            return jsonify({"success": False, "message": "Cookie belum diisi!"}), 400

        return jsonify({"success": True, "message": "Login pakai cookie berhasil (simulasi)!"})
=======
from flask import request, jsonify
import json
import os

def init_login_routes(app):
    @app.route("/login/manual", methods=["POST"])
    def login_manual():
        data = request.get_json()

        akun1 = data.get("akun1")
        akun1_pass = data.get("akun1_pass")
        akun2 = data.get("akun2")
        akun2_pass = data.get("akun2_pass")

        if not akun1 or not akun1_pass or not akun2 or not akun2_pass:
            return jsonify({"success": False, "message": "Isi semua data login!"}), 400

        # Simpan ke file login.json
        login_data = {
            "akun1": akun1,
            "akun1_pass": akun1_pass,
            "akun2": akun2,
            "akun2_pass": akun2_pass
        }

        os.makedirs("data", exist_ok=True)
        with open("data/login.json", "w") as f:
            json.dump(login_data, f)

        return jsonify({"success": True, "message": "Login manual berhasil dan data tersimpan!"})

    @app.route("/login/cookie", methods=["POST"])
    def login_cookie():
        data = request.get_json()
        cookie = data.get("cookie")

        if not cookie:
            return jsonify({"success": False, "message": "Cookie belum diisi!"}), 400

        return jsonify({"success": True, "message": "Login pakai cookie berhasil (simulasi)!"})
>>>>>>> faf15dbb669a09caac86572f5b7a2b46bc3f08a7
