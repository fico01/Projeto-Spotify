const express = require('express');
const request = require('request');
const path = require('path');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
const PORT = 8888;

// Substitua por seu domínio ngrok e o mesmo URI no dashboard do Spotify
const redirect_uri = 'https://3915-189-115-43-6.ngrok-free.app/callback';

// Serve os arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de login: redireciona para o Spotify
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email';
  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope,
    redirect_uri
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Rota de callback: Spotify redireciona para cá com o código
app.get('/callback', (req, res) => {
  const code = req.query.code || null;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + Buffer.from(
        process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
      ).toString('base64')
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      // Redireciona para o front já com o token
      res.redirect(`/?access_token=${access_token}`);
    } else {
      res.status(400).json({ error: 'Erro ao obter token', details: body });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
