# R-Collaboration AI

Website layanan Instagram untuk auto-accept collaboration dan posting terjadwal dengan dukungan A2F Authenticator, login manual, cookie, dan admin panel.

## Fitur Utama

- Login dengan 3 mode:
  - Login Manual (username & password)
  - Login Automatic (menggunakan kode)
  - Login Admin Panel
- Deteksi dan handle A2F (Two-Factor Authentication)
- Upload foto/video dengan drag & drop
- Posting terjadwal
- Auto-accept collaboration
- Batasan 5 postingan terjadwal (non-admin)
- Admin panel untuk manajemen pengguna
- Sistem kode login otomatis

## Struktur Proyek

```
R-CollaborationAI/
├── css/
│   ├── style.css
│   ├── login.css
│   ├── dashboard.css
│   └── admin.css
├── js/
│   ├── main.js
│   ├── login.js
│   ├── login-auto.js
│   ├── dashboard.js
│   └── admin.js
├── index.html
├── login-manual.html
├── login-auto.html
├── dashboard.html
├── admin-panel.html
└── README.md
```

## Cara Penggunaan

### Login Manual

1. Klik "Login Manual" pada halaman utama
2. Masukkan username dan password Instagram untuk kedua akun
3. Jika akun menggunakan A2F, masukkan kode A2F
4. Centang "Ingat Saya" jika ingin menyimpan data login
5. Klik "Login"

### Login Automatic

1. Klik "Login Automatic" pada halaman utama
2. Isi form permintaan kode dengan email dan username Instagram
3. Tunggu verifikasi dari admin (maksimal 24 jam)
4. Setelah disetujui, masukkan kode yang diterima
5. Klik "Login"

### Upload & Jadwalkan Post

1. Setelah login, masukkan file foto/video (max 50MB)
2. Isi caption postingan
3. Set jadwal posting (tanggal, bulan, tahun, jam, menit, detik)
4. Masukkan username untuk kolaborasi
5. Klik "Kirim & Ajukan Kolaborasi"

### Admin Panel

Akses admin panel tersedia untuk username berikut:
- @roufdarkside
- @roufserenity
- @exclusive4queeen
- @helminana177

Fitur admin:
- Verifikasi permintaan kode login
- Kelola pengguna terdaftar
- Monitor postingan terjadwal
- Hapus pengguna/postingan

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage untuk penyimpanan data
- Font Awesome untuk ikon
- GitHub Pages untuk hosting

## Keamanan

- Deteksi A2F otomatis
- Kode login sekali pakai
- Verifikasi admin untuk login otomatis
- Enkripsi data login
- Batasan upload dan posting

## Kontribusi

Silakan buat pull request untuk kontribusi. Untuk perubahan besar, harap buka issue terlebih dahulu untuk diskusi.

## Lisensi

[MIT License](LICENSE)

## Kontak

- Instagram: [@roufdarkside](https://instagram.com/roufdarkside)
- Email: roufprivate@gmail.com
- GitHub: [R-CollaborationAI](https://github.com/yourusername/R-CollaborationAI) 