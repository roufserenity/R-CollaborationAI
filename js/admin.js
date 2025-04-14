// Daftar admin yang diizinkan
const ADMIN_USERNAMES = ['roufdarkside', 'roufserenity', 'exclusive4queeen', 'helminana177'];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
    loadAllData();
});

// Cek akses admin
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = ADMIN_USERNAMES.includes(currentUser.username);

    if (!isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('admin-username').textContent = currentUser.username;
}

// Load semua data
function loadAllData() {
    loadCodeRequests();
    loadRegisteredUsers();
    loadScheduledPosts();
}

// Load permintaan kode
function loadCodeRequests() {
    const requests = JSON.parse(localStorage.getItem('codeRequests') || '[]');
    const requestsList = document.getElementById('code-requests');
    requestsList.innerHTML = '';

    requests.forEach((request, index) => {
        const requestElement = document.createElement('div');
        requestElement.className = 'request-item';
        requestElement.innerHTML = `
            <div class="item-info">
                <p><strong>Email:</strong> ${request.email}</p>
                <p><strong>Username:</strong> ${request.username}</p>
                <p><strong>Status:</strong> 
                    <span class="status-badge status-${request.status}">${request.status}</span>
                </p>
                <p><strong>Tanggal:</strong> ${formatDate(request.timestamp)}</p>
            </div>
            <div class="item-actions">
                ${request.status === 'pending' ? `
                    <button class="action-button approve" onclick="approveRequest(${index})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-button reject" onclick="rejectRequest(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
                <button class="action-button delete" onclick="deleteRequest(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        requestsList.appendChild(requestElement);
    });
}

// Load pengguna terdaftar
function loadRegisteredUsers() {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const usersList = document.getElementById('registered-users');
    usersList.innerHTML = '';

    users.forEach((user, index) => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.innerHTML = `
            <div class="item-info">
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Status:</strong> 
                    <span class="status-badge status-${user.status}">${user.status}</span>
                </p>
            </div>
            <div class="item-actions">
                <button class="action-button delete" onclick="deleteUser(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        usersList.appendChild(userElement);
    });
}

// Load postingan terjadwal
function loadScheduledPosts() {
    const posts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
    const postsList = document.getElementById('scheduled-posts');
    postsList.innerHTML = '';

    posts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        postElement.innerHTML = `
            <div class="item-info">
                <p><strong>File:</strong> ${post.file.name}</p>
                <p><strong>Jadwal:</strong> ${formatDate(post.schedule)}</p>
                <p><strong>Username:</strong> ${post.collabUsername}</p>
            </div>
            <div class="item-actions">
                <button class="action-button delete" onclick="deletePost(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        postsList.appendChild(postElement);
    });
}

// Approve request
function approveRequest(index) {
    const requests = JSON.parse(localStorage.getItem('codeRequests') || '[]');
    requests[index].status = 'approved';
    localStorage.setItem('codeRequests', JSON.stringify(requests));
    
    // Kirim email dengan kode
    sendEmail(
        requests[index].email,
        'Kode Login R-Collaboration AI',
        `Kode login Anda: ${requests[index].code}`
    );

    showNotification('Permintaan disetujui dan kode telah dikirim');
    loadCodeRequests();
}

// Reject request
function rejectRequest(index) {
    const requests = JSON.parse(localStorage.getItem('codeRequests') || '[]');
    requests[index].status = 'rejected';
    localStorage.setItem('codeRequests', JSON.stringify(requests));
    
    // Kirim email penolakan
    sendEmail(
        requests[index].email,
        'Status Permintaan R-Collaboration AI',
        'Maaf, permintaan Anda ditolak.'
    );

    showNotification('Permintaan ditolak');
    loadCodeRequests();
}

// Delete request
function deleteRequest(index) {
    if (confirm('Apakah Anda yakin ingin menghapus permintaan ini?')) {
        const requests = JSON.parse(localStorage.getItem('codeRequests') || '[]');
        requests.splice(index, 1);
        localStorage.setItem('codeRequests', JSON.stringify(requests));
        showNotification('Permintaan dihapus');
        loadCodeRequests();
    }
}

// Delete user
function deleteUser(index) {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        users.splice(index, 1);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        showNotification('Pengguna dihapus');
        loadRegisteredUsers();
    }
}

// Delete post
function deletePost(index) {
    if (confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
        const posts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
        posts.splice(index, 1);
        localStorage.setItem('scheduledPosts', JSON.stringify(posts));
        showNotification('Postingan dihapus');
        loadScheduledPosts();
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.textContent = message;
    notification.style.display = 'flex';
}

// Close notification
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
}

// Send email (simulasi)
function sendEmail(to, subject, message) {
    console.log(`Email terkirim ke ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    return true;
} 