// Konstanta untuk batasan
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB dalam bytes
const MAX_SCHEDULED_POSTS = 5;

// State untuk menyimpan data
let scheduledPosts = [];
let currentFile = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupFileUpload();
    loadScheduledPosts();
});

// Inisialisasi Dashboard
function initializeDashboard() {
    // Tampilkan username dari data login yang tersimpan
    const account1Data = JSON.parse(localStorage.getItem('instagramLogin_1') || '{}');
    const account2Data = JSON.parse(localStorage.getItem('instagramLogin_2') || '{}');

    document.getElementById('account1-username').textContent = account1Data.username || '';
    document.getElementById('account2-username').textContent = account2Data.username || '';

    // Setup form submission
    document.getElementById('upload-form').addEventListener('submit', handleFormSubmit);
}

// Setup File Upload
function setupFileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('media-upload');

    // Handle click pada drop zone
    dropZone.addEventListener('click', () => fileInput.click());

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    // Handle drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary-color)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--secondary-color)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--secondary-color)';
        handleFileSelect(e.dataTransfer.files[0]);
    });
}

// Handle File Selection
function handleFileSelect(file) {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        alert('Ukuran file terlalu besar. Maksimal 50MB.');
        return;
    }

    currentFile = file;
    const dropZone = document.getElementById('drop-zone');
    dropZone.innerHTML = `
        <i class="fas fa-file"></i>
        <p>${file.name}</p>
        <p class="file-size">${formatFileSize(file.size)}</p>
    `;
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!currentFile) {
        alert('Silakan pilih file untuk diupload');
        return;
    }

    if (scheduledPosts.length >= MAX_SCHEDULED_POSTS) {
        alert('Batas maksimal postingan terjadwal telah tercapai (5 postingan)');
        return;
    }

    const formData = {
        file: currentFile,
        caption: document.getElementById('caption').value,
        schedule: document.getElementById('schedule').value,
        collabUsername: document.getElementById('collab-username').value
    };

    try {
        // Simpan postingan terjadwal
        scheduledPosts.push(formData);
        saveScheduledPosts();
        
        // Update tampilan
        updateScheduledPostsList();
        
        // Reset form
        resetForm();
        
        // Tampilkan notifikasi
        showNotification();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Terjadi kesalahan saat menyimpan postingan');
    }
}

// Save Scheduled Posts
function saveScheduledPosts() {
    localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));
}

// Load Scheduled Posts
function loadScheduledPosts() {
    const savedPosts = localStorage.getItem('scheduledPosts');
    if (savedPosts) {
        scheduledPosts = JSON.parse(savedPosts);
        updateScheduledPostsList();
    }
}

// Update Scheduled Posts List
function updateScheduledPostsList() {
    const postsList = document.getElementById('scheduled-posts');
    postsList.innerHTML = '';

    scheduledPosts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-item';
        postElement.innerHTML = `
            <div class="post-info">
                <p>${post.file.name}</p>
                <p class="post-schedule">${formatSchedule(post.schedule)}</p>
            </div>
            <button onclick="deletePost(${index})" class="delete-button">
                <i class="fas fa-trash"></i>
            </button>
        `;
        postsList.appendChild(postElement);
    });
}

// Format Schedule
function formatSchedule(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Delete Post
function deletePost(index) {
    if (confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
        scheduledPosts.splice(index, 1);
        saveScheduledPosts();
        updateScheduledPostsList();
    }
}

// Reset Form
function resetForm() {
    document.getElementById('upload-form').reset();
    currentFile = null;
    document.getElementById('drop-zone').innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Drag & drop file atau klik untuk memilih</p>
    `;
}

// Show Notification
function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'flex';
}

// Close Notification
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
    window.location.reload();
} 