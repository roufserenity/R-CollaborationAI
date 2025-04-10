from instagrapi import Client
import os

def login_akun1(username, password):
    cl = Client()
    session_dir = "backend/sessions"
    os.makedirs(session_dir, exist_ok=True)

    session_file = os.path.join(session_dir, f"{username}.json")

    try:
        if os.path.exists(session_file):
            cl.load_settings(session_file)
            cl.login(username, password)
        else:
            cl.login(username, password)
            cl.dump_settings(session_file)

    except Exception as e:
        if "Two-factor authentication required" in str(e):
            code = input("🔐 Masukkan kode verifikasi 2FA: ")
            cl.login(username, password, verification_code=code)
            cl.dump_settings(session_file)
        else:
            raise e

    print(f"✅ Login sukses ke akun: {username}")
    return cl

def login_akun2(username, password):
    cl = Client()
    session_dir = "backend/sessions"
    os.makedirs(session_dir, exist_ok=True)

    session_file = os.path.join(session_dir, f"{username}.json")

    try:
        if os.path.exists(session_file):
            cl.load_settings(session_file)
            cl.login(username, password)
        else:
            cl.login(username, password)
            cl.dump_settings(session_file)
    except Exception as e:
        if "Two-factor authentication required" in str(e):
            code = input("🔐 Masukkan kode verifikasi 2FA (Akun 2): ")
            cl.login(username, password, verification_code=code)
            cl.dump_settings(session_file)
        else:
            raise e

    print(f"✅ Akun 2 ({username}) berhasil login!")
    return cl
