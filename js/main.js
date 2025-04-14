document.addEventListener('DOMContentLoaded', () => {
    // Handle login card clicks
    const loginCards = document.querySelectorAll('.login-card');
    
    loginCards.forEach(card => {
        card.addEventListener('click', () => {
            const loginType = card.id;
            
            switch(loginType) {
                case 'manual-login':
                    window.location.href = 'login-manual.html';
                    break;
                case 'auto-login':
                    window.location.href = 'login-auto.html';
                    break;
                case 'admin-login':
                    window.location.href = 'login-admin.html';
                    break;
            }
        });
    });

    // Check for saved login data
    const checkSavedLogin = () => {
        const savedData = localStorage.getItem('instagramLogin');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.rememberMe) {
                // Auto-fill login form if it exists
                const usernameInput = document.querySelector('#username');
                const passwordInput = document.querySelector('#password');
                if (usernameInput && passwordInput) {
                    usernameInput.value = data.username;
                    passwordInput.value = data.password;
                }
            }
        }
    };

    // Initialize saved login check
    checkSavedLogin();
}); 