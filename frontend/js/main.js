// Load navbar and footer
document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadFooter();
    checkAuthStatus();
});

function loadNavbar() {
    const navbarHtml = `
        <nav class="navbar">
            <div class="logo">AdvoCouncil</div>
            <div class="nav-links">
                <a href="index.html">Home</a>
                <a href="lawyers.html">Find Lawyers</a>
                <a href="#" id="authLink">Sign In</a>
                <a href="signup.html" class="btn-nav">Get Started</a>
            </div>
        </nav>
    `;
    
    const navbarDiv = document.getElementById('navbar');
    if (navbarDiv) {
        navbarDiv.innerHTML = navbarHtml;
        
        // Update auth link based on login status
        const authLink = document.getElementById('authLink');
        if (authLink) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (isLoggedIn) {
                const userName = localStorage.getItem('userName') || 'Account';
                authLink.textContent = `Hello, ${userName}`;
                authLink.href = '#';
                authLink.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
            } else {
                authLink.textContent = 'Sign In';
                authLink.href = 'signin.html';
            }
        }
    }
}

function loadFooter() {
    const footerHtml = `
        <footer class="footer">
            <p>AdvoCouncil © 2026 AdvoCouncil. Smart Lawyer Management & Client Interaction System.</p>
        </footer>
    `;
    
    const footerDiv = document.getElementById('footer');
    if (footerDiv) {
        footerDiv.innerHTML = footerHtml;
    }
}

function checkAuthStatus() {
    // Check if user is logged in for protected pages
    const protectedPages = ['book-appointment.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            // Redirect to sign in page
            window.location.href = 'signin.html';
        }
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Helper function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}