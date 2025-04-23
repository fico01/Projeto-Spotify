const axios = require('axios')
const qs = require('qs')

const clientId = "587199dbb3564988aec6f1516d714aba";
const clientSecret = "f2257cd7f00b4f8c93ce5bf2871dd71a";

async function getAcessToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const data = qs.stringify({ grant_type: 'client_credentials'})

    const headers = {
        'Authorization': 'Basic '+ Buffer.from(clientId+ ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const response = await axios.post(tokenUrl, data, { headers })

        return response.data.access_token;
    } catch (err) {
        console.error('Erro ao obter token:', err.response.data)
    }
}