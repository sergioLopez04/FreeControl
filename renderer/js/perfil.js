const ipcRenderer = window.electronAPI;
const usuario = JSON.parse(localStorage.getItem("usuario"));

// Si no hay usuario logueado, redirigimos al login
if (!usuario) {
  alert("No hay usuario logueado");
  window.location.href = "../html/login.html";
}

const usuarioId = usuario.id_usuario;

// Carga la lista de perfiles desde la base de datos
async function cargarPerfiles() {
  const perfiles = await ipcRenderer.invoke("obtenerPerfiles", usuarioId);
  const container = document.getElementById("contenedorPerfiles");
  const btnCrear = document.getElementById("botonCrearPerfil");

  container.innerHTML = "";

  // Creamos un div por cada perfil (estilo tarjeta)
  perfiles.forEach((p) => {
    const div = document.createElement("div");
    div.innerText = p.nombre_perfil;
    div.onclick = () => seleccionarPerfil(p.id_perfil, p.nombre_perfil);
    container.appendChild(div);
  });

  // Máximo 4 perfiles por usuario
  if (perfiles.length >= 4) {
    btnCrear.style.display = "none";
  }
}

function abrirModal() {
  document.getElementById("modalCrearPerfil").classList.add("show");
}

async function crearPerfil() {
  const nombre = document.getElementById("entradaNombrePerfil").value;
  if (!nombre) return;

  await ipcRenderer.invoke("crearPerfil", usuarioId, nombre);

  document.getElementById("entradaNombrePerfil").value = "";
  document.getElementById("modalCrearPerfil").classList.remove("show");
  cargarPerfiles();
}

// Guardamos el perfil activo para usarlo en toda la app
function seleccionarPerfil(id, nombre) {
  localStorage.setItem("perfilActivo", id);
  localStorage.setItem("perfilNombre", nombre);
  window.location.href = "../index.html";
}

function cerrarModal() {
  document.getElementById("modalCrearPerfil").classList.remove("show");
  document.getElementById("entradaNombrePerfil").value = "";
}

// Eventos al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("botonCrearPerfil")
    .addEventListener("click", abrirModal);
  document
    .getElementById("botonGuardarPerfil")
    .addEventListener("click", crearPerfil);
  document
    .getElementById("botonCancelarModal")
    .addEventListener("click", cerrarModal);
});

cargarPerfiles();
