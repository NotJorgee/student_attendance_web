document.addEventListener('DOMContentLoaded', () => {
    const setupForm = document.getElementById('setupForm');
    const errorMessage = document.getElementById('errorMessage');

    // --- Setup Form Submission ---
    if (setupForm) {
        setupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Basic Validation
            if (password !== confirmPassword) {
                errorMessage.textContent = "Passwords do not match.";
                return;
            }
            if (password.length < 6) {
                errorMessage.textContent = "Password must be at least 6 characters.";
                return;
            }
            errorMessage.textContent = "";

            try {
                const response = await fetch('api/setup.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();
                
                if (result.success) {
                    window.location.href = 'index.html'; // Redirect to login upon success
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