// Elementos de la interfaz
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const estado = document.getElementById("estado");

const selectorCamara = document.getElementById("selectorCamara");
const botonIniciar = document.getElementById("botonIniciar");

const selectorGestos = document.getElementById("selectorGestos");
const selectorAcciones = document.getElementById("selectorAcciones");
const botonAsignar = document.getElementById("botonAsignar");
const botonCapturar = document.getElementById("botonCapturar");

const selectorSonidos = document.getElementById("selectorSonidos");
const selectorAccionesSonido = document.getElementById(
  "selectorAccionesSonido",
);
const botonAsignarSonido = document.getElementById("botonAsignarSonido");
const botonEscucharVoz = document.getElementById("botonEscucharVoz");
const selectTeclaPushToTalk = document.getElementById("selectTeclaPushToTalk");

// Variables de estado
let bibliotecaGestos = [];
let ultimosLandmarks = null;
let gestoActual = null;
const UMBRAL_SIMILITUD = 0.12;

let reconocimiento;
let escuchandoVoz = false;
let estaHablando = false;

function actualizarEstado(texto) {
  if (estado) estado.innerText = texto;
}

// ========== INICIALIZACIÓN ==========
async function inicializar() {
  try {
    // Pedimos permisos de camara y micro para poder listar dispositivos
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const dispositivos = await navigator.mediaDevices.enumerateDevices();

    // Rellenamos el selector de camaras con las que haya
    const camaras = dispositivos.filter((d) => d.kind === "videoinput");
    selectorCamara.innerHTML = camaras
      .map(
        (c, i) =>
          `<option value="${c.deviceId}">${c.label || "Cámara " + (i + 1)}</option>`,
      )
      .join("");

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
      // Cargamos los gestos guardados de este usuario para poder comparar
      bibliotecaGestos = await window.electronAPI.invoke(
        "obtener-biblioteca-gestos",
        usuario.id_usuario,
      );
      await cargarListas();
    }
    configurarMotorVoz();
    actualizarEstado("Sistema listo.");
  } catch (err) {
    console.error("Error inicializar:", err);
    actualizarEstado("Error: Conecta cámara/micro.");
  }
}

// Carga los selects con gestos, acciones y frases disponibles
async function cargarListas() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return;

  // Recargamos biblioteca de gestos
  bibliotecaGestos = await window.electronAPI.invoke(
    "obtener-biblioteca-gestos",
    usuario.id_usuario,
  );

  const gestos = await window.electronAPI.invoke(
    "obtenerGestos",
    usuario.id_usuario,
  );
  const acciones = await window.electronAPI.invoke("obtenerAcciones");
  const frases = await window.electronAPI.invoke("obtenerSonidos");

  const accOptions =
    '<option value="">-- Acción --</option>' +
    acciones
      .map((a) => `<option value="${a.id_accion}">${a.nombre_accion}</option>`)
      .join("");
  selectorGestos.innerHTML =
    '<option value="">-- Gesto --</option>' +
    gestos
      .map((g) => `<option value="${g.id_gesto}">${g.nombre_gesto}</option>`)
      .join("");
  selectorSonidos.innerHTML =
    '<option value="">-- Frase --</option>' +
    frases
      .map(
        (s) =>
          `<option value="${s.id_sonido}">${s.descripcion || s.nombre_sonido}</option>`,
      )
      .join("");
  selectorAcciones.innerHTML = accOptions;
  selectorAccionesSonido.innerHTML = accOptions;
}

// ========== GESTOS CON MEDIAPIPE ==========
async function iniciarSensores() {
  const constraints = {
    video: {
      deviceId: selectorCamara.value ? { exact: selectorCamara.value } : true,
    },
  };
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
      iniciarMediaPipe();
    };
    actualizarEstado("Cámara iniciada.");
    // Notificamos al main el perfil activo para los atajos
    const perfilId = localStorage.getItem("perfilActivo");
    window.electronAPI.send("set-perfil-activo", perfilId);
  } catch (err) {
    actualizarEstado("Error al acceder a la cámara.");
  }
}

function iniciarMediaPipe() {
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.75,
    minTrackingConfidence: 0.75,
  });

  hands.onResults((results) => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (results.image)
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      ultimosLandmarks = landmarks;
      // Dibujamos los puntos y conexiones de la mano
      window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      window.drawLandmarks(ctx, landmarks, { color: "#FF0000", radius: 3 });

      const nombreGesto = reconocerGesto(landmarks);
      if (nombreGesto && nombreGesto !== gestoActual) {
        gestoActual = nombreGesto;
        actualizarEstado(`Gesto: ${nombreGesto}`);
        // Ejecutamos la acción asociada a ese gesto en el perfil actual
        window.electronAPI.send("ejecutar-gesto", {
          gesto: nombreGesto,
          perfilId: localStorage.getItem("perfilActivo"),
        });
      }
    } else {
      gestoActual = null;
    }
    ctx.restore();
  });

  // Bucle de procesamiento continuo
  async function procesar() {
    if (video.readyState >= 2) await hands.send({ image: video });
    requestAnimationFrame(procesar);
  }
  procesar();
}

// Compara los puntos actuales con los gestos guardados y devuelve el que coincida
function reconocerGesto(puntosActuales) {
  let mejorGesto = null;
  let menorDistancia = Infinity;

  bibliotecaGestos.forEach((g) => {
    if (!g.descripcion) return;
    try {
      const puntosBase = JSON.parse(g.descripcion);
      let distTotal = 0;

      // Usamos la muñeca (punto 0) como referencia para que la posición absoluta no importe
      const dx0 = puntosActuales[0].x;
      const dy0 = puntosActuales[0].y;
      const bx0 = puntosBase[0].x;
      const by0 = puntosBase[0].y;

      for (let i = 0; i < 21; i++) {
        const currRelX = puntosActuales[i].x - dx0;
        const currRelY = puntosActuales[i].y - dy0;
        const baseRelX = puntosBase[i].x - bx0;
        const baseRelY = puntosBase[i].y - by0;

        distTotal += Math.sqrt(
          Math.pow(currRelX - baseRelX, 2) + Math.pow(currRelY - baseRelY, 2),
        );
      }

      const promedio = distTotal / 21;

      if (promedio < menorDistancia && promedio < UMBRAL_SIMILITUD) {
        menorDistancia = promedio;
        mejorGesto = g.nombre_gesto;
      }
    } catch (e) {
      console.error("Error comparando gesto:", e);
    }
  });
  return mejorGesto;
}

// ========== VOZ CON WHISPER LOCAL  ==========
let mediaRecorder;
let audioChunks = [];

function configurarMotorVoz() {
  actualizarEstado("Motor Whisper Local listo.");
}

// Evento lanzado desde main cuando se pulsa la tecla PTT
window.electronAPI.on("ptt-activar", async () => {
  if (estaHablando) return;
  estaHablando = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Creamos un contexto de audio a 16kHz, que es lo que espera Whisper
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);

    let samples = [];

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      samples.push(new Float32Array(inputData));
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);

    actualizarEstado("Escuchando...");
    botonEscucharVoz.style.background = "#e74c3c";

    // Grabamos 3 segundos (ajustable si se quiere más tiempo)
    setTimeout(() => {
      source.disconnect();
      processor.disconnect();
      stream.getTracks().forEach((t) => t.stop());

      const mergedSamples = flattenArray(samples);
      const wavBuffer = encodeWAV(mergedSamples, 16000);

      // Enviamos el audio al proceso principal para que Whisper lo transcriba
      window.electronAPI.send("procesar-audio-whisper", wavBuffer);

      estaHablando = false;
      botonEscucharVoz.style.background = "#2ecc71";
      actualizarEstado("Procesando con Whisper...");
    }, 3000);
  } catch (err) {
    console.error("Error micro:", err);
    estaHablando = false;
  }
});

// Convierte un array de buffers en un único Float32Array
function flattenArray(channelBuffer) {
  let result = new Float32Array(
    channelBuffer.reduce((acc, b) => acc + b.length, 0),
  );
  let offset = 0;
  for (let buffer of channelBuffer) {
    result.set(buffer, offset);
    offset += buffer.length;
  }
  return result;
}

// Codifica los samples a formato WAV
function encodeWAV(samples, sampleRate) {
  let buffer = new ArrayBuffer(44 + samples.length * 2);
  let view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Uint8Array(buffer);
}

// Guardar tecla PTT elegida por el usuario
selectTeclaPushToTalk.addEventListener("change", () => {
  window.electronAPI.send("configurar-ptt", selectTeclaPushToTalk.value);
});

// Tecla por defecto
window.electronAPI.send("configurar-ptt", "F2");

// Cuando el main guarda una frase nueva, refrescamos la lista
window.electronAPI.on("nueva-frase-guardada", (frase) => {
  console.log("Se ha guardado una frase nueva:", frase);
  actualizarEstado(`Nueva frase detectada: "${frase}"`);
  cargarListas();
});

// ========== EVENTOS DE BOTONES ==========
botonIniciar.addEventListener("click", iniciarSensores);

if (botonCapturar) {
  botonCapturar.addEventListener("click", async () => {
    const nombreInput = document.getElementById("nombreGestoNuevo");
    if (!nombreInput || !ultimosLandmarks)
      return alert("Falta nombre o mano no detectada.");
    const nombre = nombreInput.value;
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const ok = await window.electronAPI.invoke("crear-gesto-entrenado", {
      nombre,
      puntos: ultimosLandmarks,
      id_usuario: usuario.id_usuario,
    });
    if (ok) {
      alert("Gesto guardado");
      cargarListas();
    }
  });
}

if (botonAsignar) {
  botonAsignar.addEventListener("click", async () => {
    const ok = await window.electronAPI.invoke(
      "guardarConfig",
      localStorage.getItem("perfilActivo"),
      selectorGestos.value,
      selectorAcciones.value,
    );
    if (ok) alert("Gesto vinculado.");
  });
}

if (botonAsignarSonido) {
  botonAsignarSonido.addEventListener("click", async () => {
    const ok = await window.electronAPI.invoke(
      "guardarConfigSonido",
      localStorage.getItem("perfilActivo"),
      selectorSonidos.value,
      selectorAccionesSonido.value,
    );
    if (ok) alert("Voz vinculada.");
  });
}

if (selectTeclaPushToTalk) {
  selectTeclaPushToTalk.addEventListener("change", () => {
    window.electronAPI.send("configurar-ptt", selectTeclaPushToTalk.value);
  });
}

inicializar();

// ========== MODAL DE AYUDA ==========
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modalBienvenida");
  const botonAyuda = document.getElementById("botonAyuda");
  const botonClose = document.getElementById("cerrarBienvenida");

  if (botonAyuda) {
    botonAyuda.addEventListener("click", function () {
      modal.style.display = "flex";
    });
  }

  if (botonClose) {
    botonClose.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
