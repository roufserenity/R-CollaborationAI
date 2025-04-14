// Fungsi untuk generate kode unik
function generateUniqueCode() {
    return 'RC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Fungsi untuk menyimpan permintaan kode
function saveCodeRequest(request) {
    const requests = JSON.parse(localStorage.getItem('codeRequests') || '[]');
    requests.push({
        ...request,
        code: generateUniqueCode(),
        timestamp: new Date().toISOString(),
        used: false
    });
    localStorage.setItem('codeRequests', JSON.stringify(requests));
}

// Fungsi untuk memverifikasi kode
function verifyCode(code) {
    const requests = JSON.parse(localStorage.getItem('codeRequests') || '[]');
    const request = requests.find(r => r.code === code && !r.used);
    
    if (!request) {
        return {
            success: false,
            message: 'Kode tidak valid atau sudah digunakan'
        };
    }

    // Tandai kode sebagai sudah digunakan
    request.used = true;
    localStorage.setItem('codeRequests', JSON.stringify(requests));

    return {
        success: true,
        message: 'Login berhasil',
        data: request
    };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Setup form login otomatis
    const autoLoginForm = document.getElementById('auto-login-form');
    autoLoginForm.addEventListener('submit', handleAutoLogin);

    // Setup form permintaan kode
    const codeRequestForm = document.getElementById('code-request-form');
    codeRequestForm.addEventListener('submit', handleCodeRequest);
});

// Handle Auto Login
async function handleAutoLogin(e) {
    e.preventDefault();
    
    const code = document.getElementById('auto-code').value;
    const result = verifyCode(code);

    if (result.success) {
        // Simpan data login
        localStorage.setItem('currentUser', JSON.stringify(result.data));
        
        // Redirect ke dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert(result.message);
    }
}

// Handle Code Request
async function handleCodeRequest(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;

    // Validasi input
    if (!email || !username) {
        alert('Mohon lengkapi semua field');
        return;
    }

    try {
        // Simpan permintaan
        saveCodeRequest({
            email,
            username,
            status: 'pending'
        });

        // Tampilkan pesan sukses
        alert('Permintaan kode telah dikirim. Silakan tunggu verifikasi dari admin.');

        // Reset form
        e.target.reset();
    } catch (error) {
        console.error('Error requesting code:', error);
        alert('Terjadi kesalahan saat mengirim permintaan');
    }
}

// Fungsi untuk mengecek status permintaan (untuk admin)
function checkRequestStatus(email) {
    const requests = JSON.parse(localStorage.getItem('codeRequests') || '[]');
    return requests.find(r => r.email === email);
}

// Fungsi untuk mengirim email (simulasi)
function sendEmail(to, subject, message) {
    console.log(`Email terkirim ke ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    return true;
} 