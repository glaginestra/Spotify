// Paso 1: Redirigir a la página de autorización
document.getElementById('authorizeButton').addEventListener('click', function() {
    const clientId = 'fc9d0add211046199ccb8a781dbe6f7f';  // Reemplaza con tu Client ID
    const redirectUri = 'http://127.0.0.1:5500/zz%20Pagina/';  // Asegúrate de que esta URI sea la correcta
    const scope = 'user-library-read%20playlist-read-private%20playlist-read-collaborative%20user-read-playback-state%20user-modify-playback-state';

    // Genera la URL de autorización
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    // Redirige al usuario a la página de autorización
    window.location.href = authUrl;
});

// Paso 2: Recoger el código de autorización después de que el usuario autoriza
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    
    if (authorizationCode) {
        console.log('Authorization Code:', authorizationCode);  // Muestra el código de autorización

        // Paso 3: Intercambiar el código por un token de acceso
        const clientId = 'fc9d0add211046199ccb8a781dbe6f7f';  // Reemplaza con tu Client ID
        const clientSecret = '7e5642e262724be7b25d3443a776efa8';  // Reemplaza con tu Client Secret
        const redirectUri = 'http://127.0.0.1:5500/zz%20Pagina/';  // Asegúrate de que esta URI sea la correcta

        // Codifica el Client ID y Client Secret en base64
        const authHeader = btoa(clientId + ':' + clientSecret);

        // Realiza la solicitud POST para obtener el access token
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: redirectUri
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                console.log('Access Token:', data.access_token);  // Muestra el access token

                // Paso 4: Usar el access token para obtener las playlists
                fetch('https://api.spotify.com/v1/me/playlists', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + data.access_token  // Usa el token aquí
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Playlists del usuario:', data);  // Muestra las playlists
                    if (data.items) {
                        const playlistsContainer = document.getElementById('playlistsContainer'); // Asegúrate de tener un contenedor en tu HTML

                        data.items.forEach(playlist => {
                            const playlistElement = document.createElement('div');
                            playlistElement.innerHTML = `<p>${playlist.name}</p>`;  // Muestra el nombre de la playlist
                            playlistsContainer.appendChild(playlistElement);
                        });
                    }
                })
                .catch(error => console.error('Error al obtener las playlists:', error));
            } else {
                console.error('Error al obtener el access token:', data);
            }
        })
        .catch(error => console.error('Error al obtener el access token:', error));
    } else {
        console.error('No se ha recibido el código de autorización.');
    }
};

const playButtons = document.querySelectorAll('.play');

const spotifyPlayer = document.getElementById('spotifyPlayer');

playButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const uri = button.getAttribute('data-uri');
        const uriParts = uri.split(":");
        
        if (uriParts[1] === 'track') {
            const trackId = uriParts[2];
            spotifyPlayer.src = `https://open.spotify.com/embed/track/${trackId}?autoplay=true`;
        }
        else if (uriParts[1] === 'playlist') {
            const playlistId = uriParts[2];
            spotifyPlayer.src = `https://open.spotify.com/embed/playlist/${playlistId}?autoplay=true`;
        }

        spotifyPlayer.style.display = 'block';
    });
});


