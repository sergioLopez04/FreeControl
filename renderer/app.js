// =========================
// ELEMENTOS DOM
// =========================
const loginDiv = document.getElementById("loginSection");
const dashboardDiv = document.getElementById("dashboardSection");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const sesionBtn = document.getElementById("sesionBtn");

const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");

const loginErrorSpan = document.getElementById("loginError");

const userNameSpan = document.getElementById("userNameSpan");
const greetingUserSpan = document.getElementById("greetingUser");

// Botones acciones principales
const configBtn = document.getElementById("configGestosBtn");
const historialBtn = document.getElementById("historialBtn");

// =========================
// PERFIL ACTIVO
// =========================
const perfilActivo = localStorage.getItem("perfilActivo");
const perfilNombre = localStorage.getItem("perfilNombre");

// Aplicar perfil en UI
window.addEventListener("DOMContentLoaded", () => {
  const perfilActivo = localStorage.getItem("perfilActivo");

  if (perfilActivo && userNameSpan) {
    userNameSpan.innerText = perfilNombre;
  }
});

async function performLogin() {
  const email = usernameInput.value.trim(); // Veo que en el main pides email
  const password = passwordInput.value.trim();

  if (!email || !password) return;

  // Llamamos al login REAL que tienes en main.js
  const resultado = await window.electronAPI.invoke("login", email, password);

  if (resultado && resultado.length > 0) {
    const usuario = resultado[0];

    // GUARDAMOS EL OBJETO EN EL STORAGE
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("perfilNombre", usuario.nombre_usuario);

    // Cambiamos de vista
    loginDiv.style.display = "none";
    dashboardDiv.style.display = "block";

    // Cargamos los gestos ahora que ya hay usuario en el storage
    renderizarListaGestos();
    renderizarListaSonidos();
  } else {
    loginErrorSpan.style.display = "block";
    loginErrorSpan.innerText = "Email o contraseña incorrectos.";
  }
}

// =========================
// LOGOUT
// =========================
function performLogout() {
  localStorage.clear();
  window.location.href = "html/login.html";
}

// CAMBIAR SESION
function cambiarPerfil() {
  localStorage.removeItem("perfilActivo");
  window.location.href = "html/perfil.html";
}

// =========================
// BOTONES UI
// =========================
function openConfiguracion() {
  window.location.href = "html/config.html";
}

function openHistorial() {
  alert("Historial de gestos");
}

// =========================
// EVENT LISTENERS
// =========================
if (loginBtn) {
  loginBtn.addEventListener("click", performLogin);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", performLogout);
}

if (sesionBtn) {
  sesionBtn.addEventListener("click", cambiarPerfil);
}

if (configBtn) {
  configBtn.addEventListener("click", openConfiguracion);
}

if (historialBtn) {
  historialBtn.addEventListener("click", openHistorial);
}

// Enter login
// Solo añade el listener si AMBOS inputs existen en el DOM
if (usernameInput && passwordInput) {
  [usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") performLogin();
    });
  });
}

// Función para cargar la lista real en el panel
async function renderizarListaGestos() {
  const listaUL = document.getElementById("listaGestosReal");
  if (!listaUL) return;

  const perfilId = localStorage.getItem("perfilActivo");
  const usuarioRaw = localStorage.getItem("usuario");
  if (!usuarioRaw) return;

  const usuarioData = JSON.parse(usuarioRaw);
  const idUsuarioReal = usuarioData.id_usuario;

  // 1. Cargamos datos
  const vinculados = await window.electronAPI.invoke(
    "obtener-viculos-dashboard",
    perfilId,
  );
  const todasLasAcciones = await window.electronAPI.invoke("obtenerAcciones");

  listaUL.innerHTML = "";

  if (vinculados.length === 0) {
    listaUL.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-hand-paper"></i>
                <p>No tienes gestos asignados en este perfil.</p>
            </div>`;
    return;
  }

  vinculados.forEach((item) => {
    const li = document.createElement("li");
    li.className = "gesture-row-inline";

    // 2. Generamos el string de opciones marcando la correcta
    // Comparamos el ID de la acción de la fila con el ID de la lista total
    let opcionesAccionesHTML = todasLasAcciones
      .map((acc) => {
        const esLaAsignada = acc.id_accion === item.id_accion ? "selected" : "";
        return `<option value="${acc.id_accion}" ${esLaAsignada}>${acc.nombre_accion}</option>`;
      })
      .join("");

    // 3. Inyectamos el HTML
    li.innerHTML = `
            <span class="fixed-gesture-name"><strong>${item.nombre_gesto}</strong></span>
            <span class="row-arrow">→</span>
            <select class="select-edit-action">
                ${opcionesAccionesHTML}
            </select>
            <div class="row-actions">
                <button class="btn-action-save"><i class="fas fa-check-circle"></i></button>
                <button class="btn-action-delete"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

    // 4. Eventos (se mantienen igual)
    li.querySelector(".btn-action-save").onclick = async () => {
      const select = li.querySelector(".select-edit-action");
      const nombreAccion = select.options[select.selectedIndex].text;
      const nuevaAccionId = select.value;

      if (
        !confirm(
          `¿Quieres cambiar la acción de "${item.nombre_accion}" a "${nombreAccion}"?`,
        )
      ) {
        return; // Si cancela, no hacemos nada
      }

      const res = await window.electronAPI.invoke("actualizar-vinculo-real", {
        perfilId: perfilId,
        gestoId: item.id_gesto,
        accionId: parseInt(nuevaAccionId), // Aseguramos que sea número
      });

      if (res.success) {
        li.style.background = "rgba(46, 204, 113, 0.2)";
        setTimeout(() => (li.style.background = "transparent"), 800);
      }
    };

    li.querySelector(".btn-action-delete").onclick = async () => {
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

async function renderizarListaSonidos() {
  const listaUL = document.getElementById("listaSonidosReal");
  if (!listaUL) return;

  const perfilId = localStorage.getItem("perfilActivo");

  // 1. Obtenemos los vínculos de sonido y todas las acciones posibles
  // Nota: Asegúrate de tener este 'obtener-vinculos-sonido-dashboard' en tu main.js (te lo pongo abajo)
  const vinculados = await window.electronAPI.invoke(
    "obtener-vinculos-sonido-dashboard",
    perfilId,
  );
  const todasLasAcciones = await window.electronAPI.invoke("obtenerAcciones");

  listaUL.innerHTML = "";

  if (vinculados.length === 0) {
    listaUL.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-microphone-slash"></i>
                <p>No tienes comandos de voz configurados.</p>
            </div>`;
    return;
  }

  vinculados.forEach((item) => {
    const li = document.createElement("li");
    li.className = "gesture-row-inline";

    // Generamos opciones de acciones marcando la seleccionada
    let opcionesAccionesHTML = todasLasAcciones
      .map((acc) => {
        const esLaAsignada = acc.id_accion === item.id_accion ? "selected" : "";
        return `<option value="${acc.id_accion}" ${esLaAsignada}>${acc.nombre_accion}</option>`;
      })
      .join("");

    li.innerHTML = `
            <span class="fixed-gesture-name">
                <i class="fas fa-comment-dots" style="color: #3498db; margin-right: 5px;"></i>
                <strong>"${item.descripcion || item.nombre_sonido}"</strong>
            </span>
            <span class="row-arrow">→</span>
            <select class="select-edit-action">
                ${opcionesAccionesHTML}
            </select>
            <div class="row-actions">
                <button class="btn-action-save"><i class="fas fa-check-circle"></i></button>
                <button class="btn-action-delete"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;

    // Evento GUARDAR
    li.querySelector(".btn-action-save").onclick = async () => {
      const select = li.querySelector(".select-edit-action");
      const nombreAccion = select.options[select.selectedIndex].text;
      const nuevaAccionId = select.value;

      if (
        !confirm(
          `¿Quieres cambiar la acción de "${item.nombre_accion}" a "${nombreAccion}"?`,
        )
      ) {
        return;
      }

      // ENVIAR COMO OBJETO { }
      const res = await window.electronAPI.invoke(
        "actualizar-vinculo-sonido-real",
        {
          perfilId: perfilId,
          sonidoId: item.id_sonido,
          accionId: parseInt(nuevaAccionId),
        },
      );

      // Cambiamos el "if (res)" por "if (res.success)" para ser coherentes con el gesto
      if (res && res.success) {
        li.style.background = "rgba(46, 204, 113, 0.2)";
        setTimeout(() => (li.style.background = "transparent"), 800);
      }
    };

    // Evento ELIMINAR
    li.querySelector(".btn-action-delete").onclick = async () => {
      if (!confirm(`¿Eliminar accion: "${item.nombre_accion}"?`)) return;
      const res = await window.electronAPI.invoke(
        "eliminar-vinculo-sonido-real",
        {
          perfilId: perfilId,
          sonidoId: item.id_sonido,
        },
      );
      if (res.success) {
        li.remove();
        actualizarContadores();
        verificarListasVacias();
      }
    };

    listaUL.appendChild(li);
  });
}

async function actualizarContadores() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const id = usuario.id_usuario;
  const { id_usuario } = usuario;
  if (!usuario) return;

  // Le pedimos al main que cuente en la BD
  const counts = await window.electronAPI.invoke(
    "contar-todo-perfil",
    id_usuario,
  );

  const elGestos = document.getElementById("countGestos");
  const elSonidos = document.getElementById("countSonidos");

  if (elGestos) elGestos.innerText = counts.totalGestos;
  if (elSonidos) elSonidos.innerText = counts.totalSonidos;
}

function verificarListasVacias() {
  const listaGestos = document.getElementById("listaGestosReal");
  const listaSonidos = document.getElementById("listaSonidosReal");

  // Si la lista de gestos no tiene hijos (li), ponemos el mensaje
  if (listaGestos && listaGestos.children.length === 0) {
    listaGestos.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-hand-paper"></i>
        <p>No tienes gestos asignados en este perfil.</p>
      </div>`;
  }

  // Lo mismo para sonidos
  if (listaSonidos && listaSonidos.children.length === 0) {
    listaSonidos.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-microphone-slash"></i>
        <p>No tienes comandos de voz configurados.</p>
      </div>`;
  }
}

// Llama a esta función al final de renderizarListaGestos()
// y renderizarListaSonidos() para que siempre esté al día.

// Llamamos a la función cuando cargue el dashboard
window.addEventListener("DOMContentLoaded", async () => {
  if (document.getElementById("dashboardSection")) {
    await renderizarListaGestos();
    await renderizarListaSonidos();
    actualizarContadores();
  }
});
