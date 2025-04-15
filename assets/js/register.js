document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
  
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // já deixa o cookie da session pronto
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      } else {
        alert(result.error || "Erro ao cadastrar.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro na conexão com o servidor.");
    }
  });
  