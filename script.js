
// Main JavaScript for Helport Ticketing System UI

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    // Character counter for textareas
    setupCharacterCounter();
    
    // File upload functionality
    setupFileUpload();
    
    // Form validation
    setupFormValidation();
    
    // Animations
    setupAnimations();
    
    // Ticket status simulation
    simulateTicketUpdates();
}

// Character counter for description textarea
function setupCharacterCounter() {
    const textarea = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            // Update color based on length
            if (count < 10) {
                charCount.style.color = '#ff8a80';
            } else if (count < 50) {
                charCount.style.color = '#ffb74d';
            } else {
                charCount.style.color = '#81c784';
            }
        });
        
        // Trigger initial count
        textarea.dispatchEvent(new Event('input'));
    }
}

// File upload functionality
function setupFileUpload() {
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    
    if (fileUpload && fileInput) {
        // Click to upload
        fileUpload.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.style.borderColor = '#00c853';
            fileUpload.style.background = 'rgba(0, 200, 83, 0.1)';
        });
        
        fileUpload.addEventListener('dragleave', () => {
            fileUpload.style.borderColor = '';
            fileUpload.style.background = '';
        });
        
        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.style.borderColor = '';
            fileUpload.style.background = '';
            fileInput.files = e.dataTransfer.files;
            updateFileList();
        });
        
        // File input change
        fileInput.addEventListener('change', updateFileList);
    }
    
    function updateFileList() {
        if (!fileList || !fileInput.files.length) return;
        
        fileList.innerHTML = '';
        const files = Array.from(fileInput.files);
        
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                margin-bottom: 0.5rem;
            `;
            
            const fileInfo = document.createElement('div');
            fileInfo.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.75rem;
            `;
            
            const icon = document.createElement('i');
            icon.className = getFileIcon(file.type);
            icon.style.fontSize = '1.25rem';
            icon.style.color = '#69f0ae';
            
            const fileDetails = document.createElement('div');
            fileDetails.innerHTML = `
                <div style="font-weight: 500;">${file.name}</div>
                <small class="text-muted">${formatFileSize(file.size)}</small>
            `;
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.style.cssText = `
                background: none;
                border: none;
                color: #ff8a80;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.25rem;
                border-radius: 4px;
            `;
            removeBtn.addEventListener('click', () => {
                const dt = new DataTransfer();
                const filesArray = Array.from(fileInput.files);
                filesArray.splice(index, 1);
                filesArray.forEach(f => dt.items.add(f));
                fileInput.files = dt.files;
                updateFileList();
            });
            
            fileInfo.appendChild(icon);
            fileInfo.appendChild(fileDetails);
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }
}

function getFileIcon(type) {
    if (type.includes('image/')) return 'fas fa-image';
    if (type.includes('pdf')) return 'fas fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fas fa-file-word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'fas fa-file-excel';
    return 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form validation
function setupFormValidation() {
    const form = document.getElementById('ticketForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const description = document.getElementById('description');
            
            let isValid = true;
            let errorMessage = '';
            
            if (!name.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your name';
                name.style.borderColor = '#ff8a80';
            } else {
                name.style.borderColor = '';
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
                email.style.borderColor = '#ff8a80';
            } else {
                email.style.borderColor = '';
            }
            
            if (!subject.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter a subject';
                subject.style.borderColor = '#ff8a80';
            } else {
                subject.style.borderColor = '';
            }
            
            if (!description.value.trim() || description.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Please provide a detailed description (minimum 10 characters)';
                description.style.borderColor = '#ff8a80';
            } else {
                description.style.borderColor = '';
            }
            
            if (isValid) {
                // Show success message
                showAlert('🎉 Ticket submitted successfully! Your ticket ID is TICKET-' + Date.now(), 'success');
                setTimeout(() => {
                    window.location.href = 'view-tickets.html';
                }, 2000);
            } else {
                showAlert('❌ ' + errorMessage, 'danger');
            }
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function resetForm() {
    const form = document.getElementById('ticketForm');
    if (form) {
        form.reset();
        const fileList = document.getElementById('fileList');
        if (fileList) fileList.innerHTML = '';
        showAlert('🔄 Form has been reset', 'info');
    }
}

// Alert system
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = message;
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Animations
function setupAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('btn-primary')) {
                this.style.animation = 'pulse 0.3s ease';
                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            }
        });
    });
}

// Simulate ticket updates (for demo purposes)
function simulateTicketUpdates() {
    if (window.location.pathname.includes('view-tickets.html')) {
        setInterval(() => {
            const statusElements = document.querySelectorAll('.badge');
            statusElements.forEach(badge => {
                if (Math.random() > 0.95) {
                    const originalText = badge.textContent;
                    badge.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        badge.style.animation = '';
                    }, 500);
                }
            });
        }, 10000);
    }
}

// Ticket status simulation
function updateTicketStatus(ticketId, newStatus) {
    const badges = {
        'open': 'badge-success',
        'progress': 'badge-warning',
        'resolved': 'badge-info',
        'closed': 'badge-secondary'
    };
    
    const icons = {
        'open': 'fas fa-circle status-open',
        'progress': 'fas fa-circle status-progress',
        'resolved': 'fas fa-circle status-resolved',
        'closed': 'fas fa-circle status-closed'
    };
    
    const texts = {
        'open': 'Open',
        'progress': 'In Progress',
        'resolved': 'Resolved',
        'closed': 'Closed'
    };
    
    // Find and update the ticket status
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(row => {
        if (row.querySelector('td:first-child strong').textContent === ticketId) {
            const statusCell = row.querySelector('td:nth-child(4) span');
            statusCell.className = `badge ${badges[newStatus]}`;
            statusCell.innerHTML = `<i class="${icons[newStatus]}"></i> ${texts[newStatus]}`;
            
            // Show notification
            showAlert(`Ticket ${ticketId} status updated to ${texts[newStatus]}`, 'info');
        }
    });
}

// Admin login simulation
function adminLogin(username, password) {
    const credentials = {
        'admin': 'admin123',
        'tech_support': 'dept123',
        'billing': 'dept123',
        'general': 'dept123',
        'sales': 'dept123'
    };
    
    if (credentials[username] && credentials[username] === password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('role', username === 'admin' ? 'admin' : 'department');
        
        showAlert(`👋 Welcome back, ${username}!`, 'success');
        
        setTimeout(() => {
            if (username === 'admin') {
                window.location.href = 'admin/index.html';
            } else {
                window.location.href = 'admin/index.html?department=' + username;
            }
        }, 1000);
        
        return true;
    } else {
        showAlert('❌ Invalid username or password', 'danger');
        return false;
    }
}

// Check login status
function checkLogin() {
    return localStorage.getItem('loggedIn') === 'true';
}

// Logout function
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    showAlert('👋 Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}