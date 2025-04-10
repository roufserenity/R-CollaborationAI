import json
import time
import os
from datetime import datetime
from ig_login import login_akun1, login_akun2

SCHEDULE_FOLDER = "data"
SCHEDULE_FILE = os.path.join(SCHEDULE_FOLDER, "schedule.json")
LOGIN_FILE = os.path.join(SCHEDULE_FOLDER, "login.json")

def ensure_schedule_file():
    if not os.path.exists(SCHEDULE_FOLDER):
        os.makedirs(SCHEDULE_FOLDER)
    if not os.path.exists(SCHEDULE_FILE):
        with open(SCHEDULE_FILE, "w") as f:
            json.dump([], f)

def load_schedule():
    ensure_schedule_file()
    with open(SCHEDULE_FILE, "r") as f:
        return json.load(f)

def save_schedule(data):
    ensure_schedule_file()
    with open(SCHEDULE_FILE, "w") as f:
        json.dump(data, f, indent=2)

def load_login():
    if not os.path.exists(LOGIN_FILE):
        return {}
    with open(LOGIN_FILE, "r") as f:
        return json.load(f)

def check_and_post():
    print("🕒 Jadwal checker aktif...")
    while True:
        schedule = load_schedule()
        login_data = load_login()
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        remaining = []
        for post in schedule:
            if post["schedule"] == now:
                print(f"🚀 POSTING: {post['filename']} | Caption: {post['caption']}")

                akun1 = post["akun1"]
                akun2 = post["akun2"]
                akun1_pass = login_data.get("akun1_pass")
                akun2_pass = login_data.get("akun2_pass")
                filepath = os.path.join("backend/uploads", post["filename"])

                try:
                    cl1 = login_akun1(akun1, akun1_pass)
                    if post["filename"].endswith(".mp4"):
                        cl1.clip_upload(filepath, post["caption"])
                    else:
                        cl1.photo_upload(filepath, post["caption"])
                    print(f"✅ Berhasil posting ke akun {akun1}")
                except Exception as e:
                    print(f"❌ Gagal upload: {e}")

                try:
                    cl2 = login_akun2(akun2, akun2_pass)
                    pending = cl2.collaborator_requests_pending()
                    if not pending:
                        print(f"⚠️ {akun2} belum menerima ajakan collab dari {akun1}. Kirim manual yaa sayang 😢")
                    else:
                        print(f"📩 {akun2} menerima {len(pending)} permintaan collab")
                        for req in pending:
                            cl2.collaborator_request_approve(req.pk)
                            print(f"🤝 Auto-accept collab dari: {req.user.username}")
                except Exception as e:
                    print(f"❌ Gagal auto-accept collab: {e}")
            else:
                remaining.append(post)

        save_schedule(remaining)
        time.sleep(1)
