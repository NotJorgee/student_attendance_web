document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // --- Login Form Submission ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            errorMessage.textContent = "";

            try {
                const response = await fetch('api/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                
                if (result.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = result.message;
                }
            } catch (error) {
                errorMessage.textContent = "A server error occurred.";
            }
        });
    }

    // --- Password Visibility Toggle ---
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            // Find the input field this button is attached to
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            // Toggle the input type and the Bootstrap icon
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash'); // Change to slashed eye
            } else {
                input.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye'); // Change back to normal eye
            }
        });
    });
});