document.getElementById('logout-btn').addEventListener('click', async () => {
    const token = localStorage.getItem('authToken'); // Get the stored token

    if (token) {
        try {
            const response = await fetch('http://localhost:8000/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send token as authorization header
                },
            });

            const data = await response.json();

            if (response.ok) {
                // On success, remove the token and handle UI changes
                localStorage.removeItem('authToken');
                alert(data.message); // Show logout success message
                window.location.href = '../pages/login.html'; // Redirect to login page, or show login UI
            } else {
                // Handle error (token invalid, etc.)
                alert('Logout failed: ' + data.message);
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Logout failed. Please try again.');
        }
    }
});
