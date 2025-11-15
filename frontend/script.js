// CONFIG: cambia la URL del backend donde pusiste /api/chat (Serie III)
const BACKEND_CHAT_URL = "http://localhost:4000/api/chat";
const AUTH_API_URL = "https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate";
const MENSAJES_API_URL = "https://backcvbgtmdesa.azurewebsites.net/api/Mensajes";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const loginMsg = document.getElementById("loginMsg");

const chatSection = document.getElementById("chat-section");
const loginSection = document.getElementById("login-section");

const mensajeInput = document.getElementById("mensaje");
const btnSend = document.getElementById("btnSend");
const sendMsg = document.getElementById("sendMsg");

const btnLoad = document.getElementById("btnLoad");
const listaMensajes = document.getElementById("listaMensajes");

// --- Login
btnLogin.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    loginMsg.textContent = "Ingrese usuario y contraseña.";
    return;
  }

  try {
    const body = { Username: username, Password: password };
    const res = await fetch(AUTH_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.text();
      loginMsg.textContent = "Error autenticando: " + res.status + " " + err;
      return;
    }

    const data = await res.json();
    const token = data.token || data.Token || data.access_token || data.AccessToken || data.tokenBearer;
    if (!token && data.message) {
      loginMsg.textContent = "Respuesta sin token: " + JSON.stringify(data);
      return;
    }
    // Guarda token
    localStorage.setItem("bearerToken", token);
    localStorage.setItem("loginUser", username);

    loginMsg.textContent = "Autenticado correctamente.";
    loginSection.style.display = "none";
    chatSection.style.display = "block";
  } catch (err) {
    console.error(err);
    loginMsg.textContent = "Error en login: " + err.message;
  }
});

// --- Enviar mensaje
btnSend.addEventListener("click", async () => {
  const token = localStorage.getItem("bearerToken");
  const loginUser = localStorage.getItem("loginUser");
  const contenido = mensajeInput.value.trim();

  if (!token) {
    sendMsg.textContent = "No autenticado. Haga login primero.";
    return;
  }
  if (!contenido) {
    sendMsg.textContent = "Escriba un mensaje antes de enviar.";
    return;
  }

  const body = {
    Cod_Sala: 0,
    Login_Emisor: loginUser,
    Contenido: contenido
  };

  try {
    const res = await fetch(MENSAJES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const text = await res.text();
      sendMsg.textContent = "Error al enviar: " + res.status + " " + text;
      return;
    }

    sendMsg.textContent = "Mensaje enviado correctamente.";
    mensajeInput.value = "";
    loadMensajes();
  } catch (err) {
    console.error(err);
    sendMsg.textContent = "Error al enviar mensaje: " + err.message;
  }
});

// --- Cargar mensajes
btnLoad.addEventListener("click", loadMensajes);

async function loadMensajes() {
  listaMensajes.innerHTML = "Cargando...";
  try {
    const res = await fetch(BACKEND_CHAT_URL);
    if (!res.ok) {
      listaMensajes.innerHTML = "Error al cargar mensajes: " + res.status;
      return;
    }
    const data = await res.json();
    if (!data || !data.data) {
      listaMensajes.innerHTML = "Respuesta inesperada: " + JSON.stringify(data);
      return;
    }
    // Mostrar cronológicamente
    listaMensajes.innerHTML = "";
    data.data.forEach(m => {
      const li = document.createElement("li");
      li.textContent = `[${m.Fecha_Envio}] ${m.Login_Emisor}: ${m.Contenido}`;
      listaMensajes.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    listaMensajes.innerHTML = "Error: " + err.message;
  }
}
