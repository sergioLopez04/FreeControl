const ipcRenderer = window.electronAPI;

async function register() {
  const nombreUsuario = document.getElementById('nombreUsuario').value;
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  try {
    await ipcRenderer.invoke("register", nombreUsuario, correo, contrasena);
    alert("Usuario creado");
    window.location.href = "login.html";
  } catch (err) {
    console.log("ERROR:", err);
    document.getElementById('mensajeInfo').innerText = "Error al registrar";
  }
}