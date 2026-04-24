const ipcRenderer = window.electronAPI;

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  alert("No hay usuario logueado");
  window.location.href = "../html/login.html";
}

const usuarioId = usuario.id_usuario;

async function cargarPerfiles() {
  const perfiles = await ipcRenderer.invoke("obtenerPerfiles", usuarioId);

  const container = document.getElementById("perfiles");
  const btnCrear = document.getElementById("crearPerfilBtn");

  container.innerHTML = "";

  perfiles.forEach((p) => {
    const div = document.createElement("div");
    div.innerText = p.nombre_perfil;
    div.onclick = () => seleccionarPerfil(p.id_perfil, p.nombre_perfil);
    container.appendChild(div);
  });

  if (perfiles.length >= 4) {
    btnCrear.style.display = "none";
  }
}

function abrirModal() {
  document.getElementById("modal").classList.add("show");
}

async function crearPerfil() {
  const nombre = document.getElementById("nombrePerfilInput").value;

  if (!nombre) return;

  await ipcRenderer.invoke("crearPerfil", usuarioId, nombre);

  document.getElementById("nombrePerfilInput").value = "";
  document.getElementById("modal").classList.remove("show");
  cargarPerfiles();
}

function seleccionarPerfil(id, nombre) {
  localStorage.setItem("perfilActivo", id);
  localStorage.setItem("perfilNombre", nombre);

  window.location.href = "../index.html";
}

function cerrarModal() {
  document.getElementById("modal").classList.remove("show");
  document.getElementById("nombrePerfilInput").value = ""; // Limpiamos lo que el usuario haya escrito
}

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("crearPerfilBtn")
    .addEventListener("click", abrirModal);
  document
    .getElementById("guardarPerfilBtn")
    .addEventListener("click", crearPerfil);
  document
    .getElementById("cancelarModalBtn")
    .addEventListener("click", cerrarModal);
});

cargarPerfiles();
