// Função para obter o access_token da URL após redirecionamento
function getAccessTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('access_token');
}

const token = getAccessTokenFromUrl();

if (token) {
  console.log('✅ Access Token:', token);

  // Exemplo: buscar dados do usuário logado
  fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(response => response.json())
    .then(data => {
      const wrapper = document.getElementById('login-wrapper');
      if (wrapper) wrapper.style.display = 'none';

      document.body.innerHTML += `
        <h2>Olá, ${data.display_name}!</h2>
        <p>Email: ${data.email}</p>
        <img src="${data.images[0]?.url}" width="100" />
      `;
    })
    .catch(err => {
      console.error('Erro ao buscar dados do usuário:', err);
    });
} else {
  console.warn('❌ Token não encontrado. Clique para fazer login.');
  document.getElementById('login-btn').addEventListener('click', () => {
    // Redireciona para o endpoint do Node que inicia o login com o Spotify
    window.location.href = '/';
  });
}
