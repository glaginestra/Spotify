// Paso 1: Redirigir a la página de autorización
document
  .getElementById("authorizeButton")
  .addEventListener("click", function () {
    const clientId = "fc9d0add211046199ccb8a781dbe6f7f"; // Solo clientId
    const redirectUri = "https://spotify-swart-psi.vercel.app/"; // O la de producción en Vercel
    const scope =
      "user-library-read playlist-read-private playlist-read-collaborative user-read-playback-state user-modify-playback-state";

    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  });

// Paso 2: Recoger el código de autorización y pedir token al backend
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get("code");

  if (authorizationCode) {
    console.log("Authorization Code:", authorizationCode);

    // Enviar el código al backend para obtener el access token
    fetch("https://spotify-swart-psi.vercel.app/get_token", {
      // Cambiar a tu backend en producción si es necesario
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: authorizationCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          console.log("Access Token:", data.access_token);

          // Usar el token para obtener playlists
          fetch("https://api.spotify.com/v1/me/playlists", {
            headers: { Authorization: "Bearer " + data.access_token },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Playlists del usuario:", data);

              const playlistsContainer =
                document.getElementById("playlistsContainer");
              playlistsContainer.innerHTML = ""; // Limpiar antes de mostrar

              if (data.items) {
                data.items.forEach((playlist) => {
                  const playlistElement = document.createElement("div");
                  playlistElement.innerHTML = `<p>${playlist.name}</p>`;
                  playlistsContainer.appendChild(playlistElement);
                });
              }
            })
            .catch((error) =>
              console.error("Error al obtener las playlists:", error)
            );
        } else {
          console.error("Error al obtener el access token:", data);
        }
      })
      .catch((error) =>
        console.error("Error en la petición al backend:", error)
      );
  }
};

// Reproducir tracks o playlists en el iframe
const playButtons = document.querySelectorAll(".play");
const spotifyPlayer = document.getElementById("spotifyPlayer");

playButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const uri = button.getAttribute("data-uri");
    const uriParts = uri.split(":");

    if (uriParts[1] === "track") {
      const trackId = uriParts[2];
      spotifyPlayer.src = `https://open.spotify.com/embed/track/${trackId}?autoplay=true`;
    } else if (uriParts[1] === "playlist") {
      const playlistId = uriParts[2];
      spotifyPlayer.src = `https://open.spotify.com/embed/playlist/${playlistId}?autoplay=true`;
    }

    spotifyPlayer.style.display = "block";
  });
});
