// Konstanta untuk batasan
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB dalam bytes
const MAX_SCHEDULED_POSTS = 5;

// State untuk menyimpan data
let scheduledPosts = [];
let currentFile = null;

// Enhanced file validation system
const FILE_VALIDATION = {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: {
        image: ['image/jpeg', 'image/png', 'image/gif'],
        video: ['video/mp4', 'video/quicktime', 'video/x-msvideo']
    },
    maxDimensions: {
        width: 4096,
        height: 4096
    },
    minDimensions: {
        width: 320,
        height: 320
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    setupFileUpload();
    loadScheduledPosts();
    setupAutoCollaboration();
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

// Setup auto collaboration
function setupAutoCollaboration() {
    const collabUsernameInput = document.getElementById('collab-username');
    const account2Data = JSON.parse(localStorage.getItem('instagramLogin_2') || '{}');
    
    if (account2Data && account2Data.username) {
        collabUsernameInput.value = account2Data.username;
        collabUsernameInput.setAttribute('readonly', true);
        
        // Add info text
        const infoText = document.createElement('small');
        infoText.className = 'auto-collab-info';
        infoText.textContent = 'Username kolaborasi otomatis diset dari akun kedua';
        infoText.style.color = 'var(--primary-color)';
        infoText.style.display = 'block';
        infoText.style.marginTop = '5px';
        
        collabUsernameInput.parentNode.appendChild(infoText);
    }
}

// Update handleFormSubmit to use auto collaboration
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

    const account2Data = JSON.parse(localStorage.getItem('instagramLogin_2') || '{}');
    const collabUsername = account2Data.username || document.getElementById('collab-username').value;

    const formData = {
        file: currentFile,
        caption: document.getElementById('caption').value,
        schedule: document.getElementById('schedule').value,
        collabUsername: collabUsername
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
        showNotification('Postingan berhasil dijadwalkan dengan kolaborasi otomatis', 'success');
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

// Auto-accept collaboration system
async function autoAcceptCollaboration(postData) {
    try {
        // Check if auto-accept is enabled
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        if (!settings.autoAccept) {
            return { success: false, message: 'Auto-accept is disabled' };
        }

        // Get collaboration criteria
        const criteria = settings.collaborationCriteria || {
            minFollowers: 1000,
            minEngagement: 3,
            preferredCategories: []
        };

        // Check if post meets criteria
        const meetsCriteria = await checkCollaborationCriteria(postData, criteria);
        if (!meetsCriteria) {
            return { success: false, message: 'Post does not meet collaboration criteria' };
        }

        // Auto-accept the collaboration
        const result = await acceptCollaboration(postData.id);
        
        // Send notification
        showNotification('Collaboration auto-accepted', 'success');
        
        return { success: true, message: 'Collaboration auto-accepted' };
    } catch (error) {
        console.error('Auto-accept error:', error);
        return { success: false, message: 'Auto-accept failed: ' + error.message };
    }
}

async function checkCollaborationCriteria(postData, criteria) {
    // Check follower count
    if (postData.followers < criteria.minFollowers) {
        return false;
    }

    // Check engagement rate
    const engagementRate = (postData.likes + postData.comments) / postData.followers * 100;
    if (engagementRate < criteria.minEngagement) {
        return false;
    }

    // Check categories
    if (criteria.preferredCategories.length > 0) {
        const hasMatchingCategory = postData.categories.some(cat => 
            criteria.preferredCategories.includes(cat)
        );
        if (!hasMatchingCategory) {
            return false;
        }
    }

    return true;
}

async function acceptCollaboration(postId) {
    // Simulate API call to accept collaboration
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}

// Add event listener for auto-accept toggle
document.addEventListener('DOMContentLoaded', () => {
    const autoAcceptToggle = document.getElementById('autoAcceptToggle');
    if (autoAcceptToggle) {
        autoAcceptToggle.addEventListener('change', (e) => {
            const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
            settings.autoAccept = e.target.checked;
            localStorage.setItem('userSettings', JSON.stringify(settings));
            showNotification(
                e.target.checked ? 'Auto-accept enabled' : 'Auto-accept disabled',
                'info'
            );
        });
    }
});

async function validateFile(file) {
    const errors = [];
    
    // Check file size
    if (file.size > FILE_VALIDATION.maxSize) {
        errors.push(`File size exceeds ${FILE_VALIDATION.maxSize / 1024 / 1024}MB limit`);
    }
    
    // Check file type
    const isImage = FILE_VALIDATION.allowedTypes.image.includes(file.type);
    const isVideo = FILE_VALIDATION.allowedTypes.video.includes(file.type);
    
    if (!isImage && !isVideo) {
        errors.push('Invalid file type. Only images (JPEG, PNG, GIF) and videos (MP4, MOV, AVI) are allowed');
    }
    
    // Check dimensions for images
    if (isImage) {
        const dimensions = await getImageDimensions(file);
        if (dimensions.width > FILE_VALIDATION.maxDimensions.width || 
            dimensions.height > FILE_VALIDATION.maxDimensions.height) {
            errors.push(`Image dimensions exceed ${FILE_VALIDATION.maxDimensions.width}x${FILE_VALIDATION.maxDimensions.height} pixels`);
        }
        if (dimensions.width < FILE_VALIDATION.minDimensions.width || 
            dimensions.height < FILE_VALIDATION.minDimensions.height) {
            errors.push(`Image dimensions must be at least ${FILE_VALIDATION.minDimensions.width}x${FILE_VALIDATION.minDimensions.height} pixels`);
        }
    }
    
    // Check video duration
    if (isVideo) {
        const duration = await getVideoDuration(file);
        if (duration > 60) { // 60 seconds max
            errors.push('Video duration exceeds 60 seconds limit');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

function getImageDimensions(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height
            });
        };
        img.src = URL.createObjectURL(file);
    });
}

function getVideoDuration(file) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.src = URL.createObjectURL(file);
    });
}

// Update file upload handler
async function handleFileUpload(files) {
    const uploadStatus = document.getElementById('uploadStatus');
    const fileList = document.getElementById('fileList');
    
    for (const file of files) {
        try {
            // Validate file
            const validation = await validateFile(file);
            if (!validation.isValid) {
                showNotification(validation.errors.join('\n'), 'error');
                continue;
            }
            
            // Create preview
            const preview = document.createElement('div');
            preview.className = 'file-preview';
            
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                preview.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.controls = true;
                preview.appendChild(video);
            }
            
            // Add file info
            const info = document.createElement('div');
            info.className = 'file-info';
            info.innerHTML = `
                <span>${file.name}</span>
                <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            `;
            preview.appendChild(info);
            
            fileList.appendChild(preview);
            
            // Save file data
            const fileData = {
                id: generateUniqueId(),
                name: file.name,
                type: file.type,
                size: file.size,
                uploadDate: new Date().toISOString(),
                status: 'pending'
            };
            
            saveFileData(fileData);
            showNotification('File uploaded successfully', 'success');
            
        } catch (error) {
            console.error('File upload error:', error);
            showNotification('File upload failed: ' + error.message, 'error');
        }
    }
} 