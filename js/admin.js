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

// Logging system
const LOG_TYPES = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success'
};

function logActivity(type, action, details) {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    const log = {
        timestamp: new Date().toISOString(),
        type,
        action,
        details,
        user: currentUser
    };
    
    logs.unshift(log);
    // Keep only last 1000 logs
    if (logs.length > 1000) {
        logs.pop();
    }
    
    localStorage.setItem('activityLogs', JSON.stringify(logs));
}

function getActivityLogs(filters = {}) {
    let logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    
    // Apply filters
    if (filters.type) {
        logs = logs.filter(log => log.type === filters.type);
    }
    if (filters.user) {
        logs = logs.filter(log => log.user === filters.user);
    }
    if (filters.startDate) {
        logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
        logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
    }
    
    return logs;
}

function exportLogs(format = 'json') {
    const logs = getActivityLogs();
    
    if (format === 'json') {
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-logs-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    } else if (format === 'csv') {
        const headers = ['timestamp', 'type', 'action', 'details', 'user'];
        const csvContent = [
            headers.join(','),
            ...logs.map(log => [
                log.timestamp,
                log.type,
                log.action,
                `"${log.details}"`,
                log.user
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity-logs-${new Date().toISOString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Update existing functions to include logging
function approveRequest(requestId) {
    const request = codeRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'approved';
        request.approvedAt = new Date().toISOString();
        request.approvedBy = currentUser;
        
        // Log the approval
        logActivity(LOG_TYPES.SUCCESS, 'approve_request', {
            requestId,
            username: request.username,
            email: request.email
        });
        
        saveCodeRequests();
        loadCodeRequests();
        showNotification('Request approved successfully', 'success');
    }
}

function rejectRequest(requestId) {
    const request = codeRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'rejected';
        request.rejectedAt = new Date().toISOString();
        request.rejectedBy = currentUser;
        
        // Log the rejection
        logActivity(LOG_TYPES.WARNING, 'reject_request', {
            requestId,
            username: request.username,
            email: request.email
        });
        
        saveCodeRequests();
        loadCodeRequests();
        showNotification('Request rejected', 'warning');
    }
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