document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        const messageElement = document.getElementById('message');

        console.log('Login response:', data); // Debug log

        if (res.ok) {
            localStorage.setItem('token', data.token);
            messageElement.textContent = 'Bine ai venit la #ADNA!';
            messageElement.className = 'message success';
            messageElement.style.display = 'block';

            // Decode the token to get user information
            const payload = JSON.parse(atob(data.token.split('.')[1]));

            setTimeout(() => {
                if (payload.isAdmin) {
                    window.location.href = '/admin.html';
                } else {
                    window.location.href = '/client/client.html'; // Asigură-te că această cale este corectă
                }
            }, 2000);
        } else {
            messageElement.textContent = data.message || 'Te rugam sa mai incerci!';
            messageElement.className = 'message error';
            messageElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Te rugam sa mai incerci!';
        messageElement.className = 'message error';
        messageElement.style.display = 'block';
    }
});
