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

// Rate limiting system
const RATE_LIMITS = {
    login: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        blockDuration: 30 * 60 * 1000 // 30 minutes
    },
    codeRequest: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000, // 1 hour
        blockDuration: 24 * 60 * 60 * 1000 // 24 hours
    }
};

function checkRateLimit(type, identifier) {
    const limits = RATE_LIMITS[type];
    if (!limits) return true;

    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rateLimit_${type}_${identifier}`) || '[]');
    
    // Clean old attempts
    const validAttempts = attempts.filter(time => now - time < limits.windowMs);
    
    // Check if blocked
    const lastBlock = localStorage.getItem(`rateLimit_block_${type}_${identifier}`);
    if (lastBlock && now - parseInt(lastBlock) < limits.blockDuration) {
        return false;
    }
    
    // Check attempts
    if (validAttempts.length >= limits.maxAttempts) {
        // Block the identifier
        localStorage.setItem(`rateLimit_block_${type}_${identifier}`, now.toString());
        return false;
    }
    
    // Add new attempt
    validAttempts.push(now);
    localStorage.setItem(`rateLimit_${type}_${identifier}`, JSON.stringify(validAttempts));
    return true;
}

function getRemainingAttempts(type, identifier) {
    const limits = RATE_LIMITS[type];
    if (!limits) return Infinity;

    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rateLimit_${type}_${identifier}`) || '[]');
    const validAttempts = attempts.filter(time => now - time < limits.windowMs);
    
    return Math.max(0, limits.maxAttempts - validAttempts.length);
}

function getBlockTimeRemaining(type, identifier) {
    const lastBlock = localStorage.getItem(`rateLimit_block_${type}_${identifier}`);
    if (!lastBlock) return 0;

    const now = Date.now();
    const blockEnd = parseInt(lastBlock) + RATE_LIMITS[type].blockDuration;
    return Math.max(0, blockEnd - now);
}

// Fungsi untuk menangani login
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Check rate limit
    if (!checkRateLimit('login', username)) {
        const blockTime = getBlockTimeRemaining('login', username);
        const minutes = Math.ceil(blockTime / 60000);
        showNotification(`Too many login attempts. Please try again in ${minutes} minutes.`, 'error');
        return;
    }
    
    try {
        const result = await processInstagramLogin({ username, password });
        if (result.success) {
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            }
            window.location.href = 'dashboard.html';
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed: ' + error.message, 'error');
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