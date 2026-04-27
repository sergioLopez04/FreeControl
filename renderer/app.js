// Elementos del DOM
const loginDiv = document.getElementById("loginSection");
const dashboardDiv = document.getElementById("seccionDashboard");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("botonCerrarSesion");
const sesionBtn = document.getElementById("botonCambiarPerfil");

const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");

const loginErrorSpan = document.getElementById("loginError");

const userNameSpan = document.getElementById("textoNombreUsuario");
const greetingUserSpan = document.getElementById("saludoUsuario");

const configBtn = document.getElementById("botonConfigurarGestos");

const perfilActivo = localStorage.getItem("perfilActivo");
const perfilNombre = localStorage.getItem("perfilNombre");

window.addEventListener("DOMContentLoaded", () => {
  const perfilActivo = localStorage.getItem("perfilActivo");
  if (perfilActivo && userNameSpan) {
    userNameSpan.innerText = perfilNombre;
  }
});

// ========== LOGIN ==========
async function performLogin() {
  const email = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return;
  const resultado = await window.electronAPI.invoke("login", email, password);
  if (resultado && resultado.length > 0) {
    const usuario = resultado[0];
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("perfilNombre", usuario.nombre_usuario);
    // Mostramos el dashboard y ocultamos el login
    loginDiv.style.display = "none";
    dashboardDiv.style.display = "block";
    renderizarListaGestos();
    renderizarListaSonidos();
  } else {
    loginErrorSpan.style.display = "block";
    loginErrorSpan.innerText = "Email o contraseña incorrectos.";
  }
}

function performLogout() {
  localStorage.clear();
  window.location.href = "html/login.html";
}

function cambiarPerfil() {
  localStorage.removeItem("perfilActivo");
  window.location.href = "html/perfil.html";
}

function openConfiguracion() {
  window.location.href = "html/config.html";
}


// Asignación de eventos
if (loginBtn) loginBtn.addEventListener("click", performLogin);
if (logoutBtn) logoutBtn.addEventListener("click", performLogout);
if (sesionBtn) sesionBtn.addEventListener("click", cambiarPerfil);
if (configBtn) configBtn.addEventListener("click", openConfiguracion);

// Enter en el formulario de login
if (usernameInput && passwordInput) {
  [usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") performLogin();
    });
  });
}

// ========== RENDERIZADO DINÁMICO DE GESTOS Y SONIDOS EN EL DASHBOARD ==========
async function renderizarListaGestos() {
  const listaUL = document.getElementById("listaGestosAsignados");
  if (!listaUL) return;

  const perfilId = localStorage.getItem("perfilActivo");
  const usuarioRaw = localStorage.getItem("usuario");
  if (!usuarioRaw) return;

  const usuarioData = JSON.parse(usuarioRaw);
  const idUsuarioReal = usuarioData.id_usuario;

  const vinculados = await window.electronAPI.invoke("obtener-viculos-dashboard", perfilId);
  const todasLasAcciones = await window.electronAPI.invoke("obtenerAcciones");

  listaUL.innerHTML = "";

  if (vinculados.length === 0) {
    listaUL.innerHTML = `<div class="estado-vacio"><i class="fas fa-hand-paper"></i><p>No tienes gestos asignados en este perfil.</p></div>`;
    return;
  }

  vinculados.forEach((item) => {
    const li = document.createElement("li");
    li.className = "fila-gesto-enlinea";

    let opcionesAccionesHTML = todasLasAcciones
      .map((acc) => {
        const esLaAsignada = acc.id_accion === item.id_accion ? "selected" : "";
        return `<option value="${acc.id_accion}" ${esLaAsignada}>${acc.nombre_accion}</option>`;
      })
      .join("");

    li.innerHTML = `
      <span class="nombre-gesto-fijo"><strong>${item.nombre_gesto}</strong></span>
      <span class="flecha-fila">→</span>
      <select class="selector-editar-accion">${opcionesAccionesHTML}</select>
      <div class="acciones-fila">
        <button class="boton-accion-guardar"><i class="fas fa-check-circle"></i></button>
        <button class="boton-accion-eliminar"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    // Guardar cambios en la acción vinculada al gesto
    li.querySelector(".boton-accion-guardar").onclick = async () => {
      const select = li.querySelector(".selector-editar-accion");
      const nombreAccion = select.options[select.selectedIndex].text;
      const nuevaAccionId = select.value;
      if (!confirm(`¿Quieres cambiar la acción de "${item.nombre_accion}" a "${nombreAccion}"?`)) return;
      const res = await window.electronAPI.invoke("actualizar-vinculo-real", {
        perfilId: perfilId,
        gestoId: item.id_gesto,
        accionId: parseInt(nuevaAccionId),
      });
      if (res.success) {
        li.style.background = "rgba(46, 204, 113, 0.2)";
        setTimeout(() => (li.style.background = "transparent"), 800);
      }
    };

    // Eliminar el vínculo gesto-acción
    li.querySelector(".boton-accion-eliminar").onclick = async () => {
      if (!confirm(`¿Eliminar acción: ${item.nombre_accion}?`)) return;
      const res = await window.electronAPI.invoke("eliminar-vinculo-real", {
        perfilId: perfilId,
        gestoId: item.id_gesto,
      });
      if (res.success) {
        li.remove();
        actualizarContadores();
        verificarListasVacias();
      }
    };

    listaUL.appendChild(li);
  });
}

// Similar para los comandos de voz
async function renderizarListaSonidos() {
  const listaUL = document.getElementById("listaSonidosAsignados");
  if (!listaUL) return;

  const perfilId = localStorage.getItem("perfilActivo");
  const vinculados = await window.electronAPI.invoke("obtener-vinculos-sonido-dashboard", perfilId);
  const todasLasAcciones = await window.electronAPI.invoke("obtenerAcciones");

  listaUL.innerHTML = "";

  if (vinculados.length === 0) {
    listaUL.innerHTML = `<div class="estado-vacio"><i class="fas fa-microphone-slash"></i><p>No tienes comandos de voz configurados.</p></div>`;
    return;
  }

  vinculados.forEach((item) => {
    const li = document.createElement("li");
    li.className = "fila-gesto-enlinea";

    let opcionesAccionesHTML = todasLasAcciones
      .map((acc) => {
        const esLaAsignada = acc.id_accion === item.id_accion ? "selected" : "";
        return `<option value="${acc.id_accion}" ${esLaAsignada}>${acc.nombre_accion}</option>`;
      })
      .join("");

    li.innerHTML = `
      <span class="nombre-gesto-fijo"><i class="fas fa-comment-dots" style="color: #3498db; margin-right: 5px;"></i><strong>"${item.descripcion || item.nombre_sonido}"</strong></span>
      <span class="flecha-fila">→</span>
      <select class="selector-editar-accion">${opcionesAccionesHTML}</select>
      <div class="acciones-fila">
        <button class="boton-accion-guardar"><i class="fas fa-check-circle"></i></button>
        <button class="boton-accion-eliminar"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    li.querySelector(".boton-accion-guardar").onclick = async () => {
      const select = li.querySelector(".selector-editar-accion");
      const nombreAccion = select.options[select.selectedIndex].text;
      const nuevaAccionId = select.value;
      if (!confirm(`¿Quieres cambiar la acción de "${item.nombre_accion}" a "${nombreAccion}"?`)) return;
      const res = await window.electronAPI.invoke("actualizar-vinculo-sonido-real", {
        perfilId: perfilId,
        sonidoId: item.id_sonido,
        accionId: parseInt(nuevaAccionId),
      });
      if (res && res.success) {
        li.style.background = "rgba(46, 204, 113, 0.2)";
        setTimeout(() => (li.style.background = "transparent"), 800);
      }
    };

    li.querySelector(".boton-accion-eliminar").onclick = async () => {
      if (!confirm(`¿Eliminar accion: "${item.nombre_accion}"?`)) return;
      const res = await window.electronAPI.invoke("eliminar-vinculo-sonido-real", {
        perfilId: perfilId,
        sonidoId: item.id_sonido,
      });
      if (res.success) {
        li.remove();
        actualizarContadores();
        verificarListasVacias();
      }
    };

    listaUL.appendChild(li);
  });
}

// Actualiza los contadores de gestos y sonidos en el dashboard
async function actualizarContadores() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return;
  const counts = await window.electronAPI.invoke("contar-todo-perfil", usuario.id_usuario);
  const elGestos = document.getElementById("contadorGestos");
  const elSonidos = document.getElementById("contadorSonidos");
  if (elGestos) elGestos.innerText = counts.totalGestos;
  if (elSonidos) elSonidos.innerText = counts.totalSonidos;
}

function verificarListasVacias() {
  const listaGestos = document.getElementById("listaGestosAsignados");
  const listaSonidos = document.getElementById("listaSonidosAsignados");
  if (listaGestos && listaGestos.children.length === 0) {
    listaGestos.innerHTML = `<div class="estado-vacio"><i class="fas fa-hand-paper"></i><p>No tienes gestos asignados en este perfil.</p></div>`;
  }
  if (listaSonidos && listaSonidos.children.length === 0) {
    listaSonidos.innerHTML = `<div class="estado-vacio"><i class="fas fa-microphone-slash"></i><p>No tienes comandos de voz configurados.</p></div>`;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("seccionDashboard")) {
    await renderizarListaGestos();
    await renderizarListaSonidos();
    actualizarContadores();
  }
});