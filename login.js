document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'main.html';
    sessionStorage.removeItem('redirectAfterLogin');
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include', // ESSENCIAL pra session funcionar
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                window.location.href = redirectUrl;
            } else {
                alert('Erro: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login.');
        });
});
