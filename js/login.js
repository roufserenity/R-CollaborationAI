// Fungsi untuk generate nomor seri acak
function generateSerialNumber() {
    return 'RC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Fungsi untuk menyimpan data login
function saveLoginData(accountNumber, data) {
    const key = `instagramLogin_${accountNumber}`;
    localStorage.setItem(key, JSON.stringify(data));
}

// Fungsi untuk mengambil data login yang tersimpan
function getSavedLoginData(accountNumber) {
    const key = `instagramLogin_${accountNumber}`;
    return JSON.parse(localStorage.getItem(key) || '{}');
}

// Fungsi untuk menangani login
async function handleLogin() {
    const account1Data = {
        username: document.getElementById('username1').value,
        password: document.getElementById('password1').value,
        a2f: document.getElementById('a2f1').value,
        rememberMe: document.getElementById('remember1').checked
    };

    const account2Data = {
        username: document.getElementById('username2').value,
        password: document.getElementById('password2').value,
        a2f: document.getElementById('a2f2').value,
        rememberMe: document.getElementById('remember2').checked
    };

    // Validasi input
    if (!account1Data.username || !account1Data.password || !account2Data.username || !account2Data.password) {
        alert('Mohon lengkapi semua field yang diperlukan');
        return;
    }

    try {
        // Simpan data jika "Ingat Saya" dicentang
        if (account1Data.rememberMe) {
            const serialNumber1 = generateSerialNumber();
            account1Data.serialNumber = serialNumber1;
            saveLoginData('1', account1Data);
        }

        if (account2Data.rememberMe) {
            const serialNumber2 = generateSerialNumber();
            account2Data.serialNumber = serialNumber2;
            saveLoginData('2', account2Data);
        }

        // Proses login Instagram (akan diimplementasikan dengan metode non-API)
        const loginResult = await processInstagramLogin(account1Data, account2Data);
        
        if (loginResult.success) {
            // Redirect ke halaman dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert(loginResult.message || 'Login gagal. Silakan coba lagi.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
}

// Fungsi untuk memproses login Instagram
async function processInstagramLogin(account1Data, account2Data) {
    // Implementasi login Instagram akan ditambahkan di sini
    // Menggunakan metode non-API sesuai permintaan
    return {
        success: true,
        message: 'Login berhasil'
    };
}

// Event listener untuk form
document.addEventListener('DOMContentLoaded', () => {
    // Cek data login yang tersimpan
    const savedAccount1 = getSavedLoginData('1');
    const savedAccount2 = getSavedLoginData('2');

    // Auto-fill form jika ada data tersimpan
    if (savedAccount1.username) {
        document.getElementById('username1').value = savedAccount1.username;
        document.getElementById('password1').value = savedAccount1.password;
        document.getElementById('remember1').checked = true;
    }

    if (savedAccount2.username) {
        document.getElementById('username2').value = savedAccount2.username;
        document.getElementById('password2').value = savedAccount2.password;
        document.getElementById('remember2').checked = true;
    }
}); 