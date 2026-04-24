const ipcRenderer = window.electronAPI;

async function register() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await ipcRenderer.invoke("register", username, email, password);

    alert("Usuario creado");
    window.location.href = "login.html";

  } catch (err) {
    console.log("ERROR:", err);
    document.getElementById('msg').innerText = "Error al registrar";
  }
}