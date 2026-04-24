// const video = document.getElementById("video");
// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
// const estado = document.getElementById("estado");
// const selector = document.getElementById("selectorCamara");
// const btnIniciar = document.getElementById("btnIniciar");

// // NUEVAS REFERENCIAS DOM
// const selectorGestos = document.getElementById("selectorGestos");
// const selectorAcciones = document.getElementById("selectorAcciones");
// const btnAsignar = document.getElementById("btnAsignar");

// let bibliotecaGestos = [];
// let ultimosLandmarks = null;
// let gestoActual = null;
// const UMBRAL_SIMILITUD = 0.08;

// function actualizarEstado(texto) {
//   if (estado) estado.innerText = texto;
// }

// // 1. Cargar cámaras, gestos existentes y rellenar los selectores
// async function cargarConfiguracionInicial() {
//   try {
//     await navigator.mediaDevices.getUserMedia({ video: true });
//     const dispositivos = await navigator.mediaDevices.enumerateDevices();
//     const camaras = dispositivos.filter((d) => d.kind === "videoinput");
//     const usuarioData = JSON.parse(localStorage.getItem("usuario"));
//     const usuarioId = usuarioData ? usuarioData.id_usuario : null;

//     selector.innerHTML = "";
//     camaras.forEach((camara, i) => {
//       const opt = document.createElement("option");
//       opt.value = camara.deviceId;
//       opt.text = camara.label || `Cámara ${i + 1}`;
//       selector.appendChild(opt);
//     });

//     // Cargar gestos para la detección
//     bibliotecaGestos = await window.electronAPI.invoke("obtener-biblioteca-gestos",usuarioId);

//     // ¡NUEVO!: Cargar los datos para los desplegables de asignación
//     await cargarListasAsignacion();

//     actualizarEstado("Sistema listo para iniciar.");
//   } catch (err) {
//     actualizarEstado("Error: Conecta una cámara.");
//   }
// }

// // --- NUEVA FUNCIÓN: Rellenar los selectores de Gestos y Acciones ---
// async function cargarListasAsignacion() {
//   try {
//     const usuarioData = JSON.parse(localStorage.getItem("usuario"));

//     // 2. Sacamos el id_usuario de ese objeto
//     const usuarioId = usuarioData ? usuarioData.id_usuario : null;

//     if (!usuarioId) {
//       console.error("No hay usuario logueado o falta id_usuario");
//       return;
//     }

//     const gestos = await window.electronAPI.invoke("obtenerGestos", usuarioId);
//     const acciones = await window.electronAPI.invoke("obtenerAcciones");

//     selectorGestos.innerHTML =
//       '<option value="">-- Selecciona un Gesto --</option>';
//     selectorAcciones.innerHTML =
//       '<option value="">-- Selecciona una Acción --</option>';

//     gestos.forEach((g) => {
//       const opt = document.createElement("option");
//       opt.value = g.id_gesto;
//       opt.text = g.nombre_gesto;
//       selectorGestos.appendChild(opt);
//     });

//     acciones.forEach((a) => {
//       const opt = document.createElement("option");
//       opt.value = a.id_accion;
//       opt.text = a.nombre_accion;
//       selectorAcciones.appendChild(opt);
//     });
//   } catch (error) {
//     console.error("Error cargando las listas de asignación:", error);
//   }
// }

// // --- NUEVA FUNCIÓN: Guardar la asignación en la BBDD ---
// async function asignarGesto() {
//   const gestoId = selectorGestos.value;
//   const accionId = selectorAcciones.value;
//   const perfilId = localStorage.getItem("perfilActivo"); // Asumiendo que guardas el ID del perfil logueado aquí

//   if (!gestoId || !accionId) {
//     return alert("Debes seleccionar tanto un gesto como una acción.");
//   }

//   if (!perfilId) {
//     return alert(
//       "Error: No se ha detectado un perfil activo. Inicia sesión primero.",
//     );
//   }

//   try {
//     await window.electronAPI.invoke(
//       "guardarConfig",
//       parseInt(perfilId),
//       parseInt(gestoId),
//       parseInt(accionId),
//     );
//     alert("¡Asignación guardada con éxito!");
//   } catch (error) {
//     console.error("Error al guardar la configuración:", error);
//     alert("Hubo un error al guardar la asignación.");
//   }
// }

// // 2. Iniciar Cámara y MediaPipe (Se mantiene igual)
// async function iniciarSeleccionada() {
//   const constraints = { video: { deviceId: { exact: selector.value } } };
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//     video.srcObject = stream;
//     video.onloadedmetadata = () => {
//       video.play();
//       iniciarMediaPipe();
//     };
//     actualizarEstado("Cámara iniciada. Analizando...");
//   } catch (err) {
//     actualizarEstado("No se pudo acceder a la cámara.");
//   }
// }

// // 3. Comparador Geométrico (Se mantiene igual)
// function reconocerGesto(puntosActuales) {
//   let mejorGesto = null;
//   let menorDistancia = Infinity;

//   bibliotecaGestos.forEach((gestoGuardado) => {
//     if (!gestoGuardado.descripcion) return;

//     try {
//       const puntosBase = JSON.parse(gestoGuardado.descripcion);
//       let distanciaTotal = 0;

//       for (let i = 0; i < 21; i++) {
//         const dx = puntosActuales[i].x - puntosBase[i].x;
//         const dy = puntosActuales[i].y - puntosBase[i].y;
//         const dz = puntosActuales[i].z - puntosBase[i].z;
//         distanciaTotal += Math.sqrt(dx * dx + dy * dy + dz * dz);
//       }

//       const promedio = distanciaTotal / 21;
//       if (promedio < menorDistancia && promedio < UMBRAL_SIMILITUD) {
//         menorDistancia = promedio;
//         mejorGesto = gestoGuardado.nombre_gesto;
//       }
//     } catch (e) {
//       console.error("Error en datos de gesto.");
//     }
//   });
//   return mejorGesto;
// }

// // iniciarMediaPipe (Se mantiene igual)
// function iniciarMediaPipe() {
//   const hands = new Hands({
//     locateFile: (file) =>
//       `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//   });

//   hands.setOptions({
//     maxNumHands: 1,
//     modelComplexity: 1,
//     minDetectionConfidence: 0.75,
//     minTrackingConfidence: 0.75,
//   });

//   hands.onResults((results) => {
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.save();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (results.image) {
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
//     }

//     if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//       const landmarks = results.multiHandLandmarks[0];
//       ultimosLandmarks = landmarks;

//       window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
//         color: "#00FF00",
//         lineWidth: 4,
//       });
//       window.drawLandmarks(ctx, landmarks, { color: "#FF0000", radius: 3 });

//       // Comparar con la base de datos
//       const nombreGesto = reconocerGesto(landmarks);
//       if (nombreGesto) {
//         if (nombreGesto !== gestoActual) {
//           gestoActual = nombreGesto;
//           actualizarEstado(`Gesto detectado: ${nombreGesto}`);
//           const perfilId = localStorage.getItem("perfilActivo");
//           window.electronAPI.send("ejecutar-gesto", {
//             gesto: nombreGesto,
//             perfilId,
//           });
//         }
//       } else {
//         gestoActual = null;
//         actualizarEstado("Mano detectada (Gesto desconocido)");
//       }
//     }
//     ctx.restore();
//   });

//   async function procesar() {
//     if (video.readyState >= 2) await hands.send({ image: video });
//     requestAnimationFrame(procesar);
//   }
//   procesar();
// }

// // 4. Guardar gesto nuevo (Modificado para actualizar la lista)
// async function capturar() {
//   const nombre = document.getElementById("nombreGestoNuevo").value;
//   if (!nombre) return alert("Escribe un nombre para el gesto.");
//   if (!ultimosLandmarks) return alert("La cámara no detecta tu mano.");

//   const usuarioData = JSON.parse(localStorage.getItem("usuario"));
//   const usuarioId = usuarioData ? usuarioData.id_usuario : null;
//   if (!usuarioId) {
//     console.error("No hay usuario logueado o falta id_usuario");
//     return;
//   }

//   const ok = await window.electronAPI.invoke("crear-gesto-entrenado", {
//     nombre: nombre,
//     puntos: ultimosLandmarks,
//     id_usuario: usuarioId,
//   });

//   if (ok) {
//     alert("¡Gesto guardado! Ahora la IA lo reconocerá.");
//     // Actualizamos la biblioteca en memoria
//     bibliotecaGestos = await window.electronAPI.invoke(
//       "obtener-biblioteca-gestos",
//     );

//     // ¡NUEVO! Actualizamos los selectores para que el nuevo gesto aparezca enseguida en el menú desplegable
//     await cargarListasAsignacion();

//     document.getElementById("nombreGestoNuevo").value = ""; // Limpiar el input
//   }
// }

// // EVENT LISTENERS
// btnIniciar.addEventListener("click", iniciarSeleccionada);
// document.getElementById("btnCapturar").addEventListener("click", capturar);

// // ¡NUEVO EVENT LISTENER!
// btnAsignar.addEventListener("click", asignarGesto);

// // Inicializar
// cargarConfiguracionInicial();

// 2 CODIGOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO---------------------------------------------------------------

// const video = document.getElementById("video");
// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
// const estado = document.getElementById("estado");

// // Sensores
// const selectorCamara = document.getElementById("selectorCamara");
// const selectorMicrofono = document.getElementById("selectorMicrofono"); // NUEVO
// const barraVolumen = document.getElementById("barraVolumen"); // NUEVO
// const btnIniciar = document.getElementById("btnIniciar");

// // Gestos
// const selectorGestos = document.getElementById("selectorGestos");
// const selectorAcciones = document.getElementById("selectorAcciones");
// const btnAsignar = document.getElementById("btnAsignar");

// // Sonidos
// const selectorSonidos = document.getElementById("selectorSonidos");
// const selectorAccionesSonido = document.getElementById("selectorAccionesSonido");
// const btnAsignarSonido = document.getElementById("btnAsignarSonido");

// let bibliotecaGestos = [];
// let ultimosLandmarks = null;
// let gestoActual = null;
// const UMBRAL_SIMILITUD = 0.08;

// let analizandoAudio = false;
// let umbralAudio = 80;
// let ultimoDisparoAudio = 0;

// let grabandoSonido = false;
// let frecuenciasGrabadas = [];
// let volumenesGrabados = [];
// let audioContextGlobal = null; // Para saber la frecuencia real

// function actualizarEstado(texto) {
//   if (estado) estado.innerText = texto;
// }

// // 1. CARGA DE CONFIGURACIÓN Y DISPOSITIVOS
// async function inicializar() {
//   try {
//     // Pedimos permisos generales antes de listar para ver los nombres reales
//     await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//     const dispositivos = await navigator.mediaDevices.enumerateDevices();

//     // Filtramos cámaras y micrófonos
//     const camaras = dispositivos.filter(d => d.kind === "videoinput");
//     const microfonos = dispositivos.filter(d => d.kind === "audioinput");

//     selectorCamara.innerHTML = camaras.map((c, i) => `<option value="${c.deviceId}">${c.label || 'Cámara ' + (i+1)}</option>`).join('');
//     if (selectorMicrofono) {
//       selectorMicrofono.innerHTML = microfonos.map((m, i) => `<option value="${m.deviceId}">${m.label || 'Micrófono ' + (i+1)}</option>`).join('');
//     }

//     const usuario = JSON.parse(localStorage.getItem("usuario"));
//     const perfilId = localStorage.getItem("perfilActivo");

//     if (usuario) {
//       bibliotecaGestos = await window.electronAPI.invoke("obtener-biblioteca-gestos", usuario.id_usuario);
//       const calib = await window.electronAPI.invoke("obtenerCalibracion", perfilId);
//       if (calib && calib.umbral_sonido) umbralAudio = calib.umbral_sonido;
//       await cargarListas();
//     }
//     actualizarEstado("Sistema listo. Selecciona cámara/micro y dale a Iniciar.");
//   } catch (err) {
//     console.error("Error al iniciar dispositivos:", err);
//     actualizarEstado("Error: Conecta una cámara y un micrófono.");
//   }
// }

// async function cargarListas() {
//   const usuario = JSON.parse(localStorage.getItem("usuario"));
//   if (!usuario) return;

//   const gestos = await window.electronAPI.invoke("obtenerGestos", usuario.id_usuario);
//   const acciones = await window.electronAPI.invoke("obtenerAcciones");
//   const sonidos = await window.electronAPI.invoke("obtenerSonidos");

//   selectorGestos.innerHTML = '<option value="">-- Gesto --</option>' + gestos.map(g => `<option value="${g.id_gesto}">${g.nombre_gesto}</option>`).join('');
//   selectorSonidos.innerHTML = '<option value="">-- Sonido --</option>' + sonidos.map(s => `<option value="${s.id_sonido}">${s.nombre_sonido}</option>`).join('');

//   const accOptions = '<option value="">-- Acción --</option>' + acciones.map(a => `<option value="${a.id_accion}">${a.nombre_accion}</option>`).join('');
//   selectorAcciones.innerHTML = accOptions;
//   if(selectorAccionesSonido) selectorAccionesSonido.innerHTML = accOptions;
// }

// // 2. INICIO DE CÁMARA Y MICRÓFONO
// async function iniciarSensores() {
//   const constraints = {
//     video: { deviceId: selectorCamara.value ? { exact: selectorCamara.value } : true },
//     audio: selectorMicrofono && selectorMicrofono.value ? { deviceId: { exact: selectorMicrofono.value } } : true
//   };

//   try {
//     const stream = await navigator.mediaDevices.getUserMedia(constraints);

//     // Separar pistas de video y audio
//     const streamVideo = new MediaStream([stream.getVideoTracks()[0]]);
//     const streamAudio = new MediaStream([stream.getAudioTracks()[0]]);

//     // Configurar Video
//     video.srcObject = streamVideo;
//     video.onloadedmetadata = () => {
//       video.play();
//       iniciarMediaPipe();
//     };

//     // Configurar Audio
//     iniciarEscuchaAudio(streamAudio);

//     actualizarEstado("Cámara y Micrófono iniciados.");
//   } catch (err) {
//     console.error("Error al acceder a sensores:", err);
//     actualizarEstado("No se pudo acceder a la cámara o micrófono.");
//   }
// }

// // 3. ANÁLISIS DE AUDIO
// function iniciarEscuchaAudio(stream) {
//   const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//   const analyser = audioCtx.createAnalyser();
//   analyser.fftSize = 256;
//   const source = audioCtx.createMediaStreamSource(stream);
//   source.connect(analyser);

//   const dataArray = new Uint8Array(analyser.frequencyBinCount);
//   analizandoAudio = true;

//   function procesarAudio() {
//     if (!analizandoAudio) return;
//     analyser.getByteFrequencyData(dataArray);

//     // Calcular volumen medio
//     let suma = 0;
//     for (let i = 0; i < dataArray.length; i++) {
//       suma += dataArray[i];
//     }
//     let volumen = suma / dataArray.length;

//     // Actualizar barra de HTML para que el usuario vea su voz
//     if (barraVolumen) barraVolumen.value = volumen;

//     // Comprobar si supera el umbral y ha pasado al menos 1 segundo desde el último disparo
//     const ahora = Date.now();
//     if (volumen > umbralAudio && (ahora - ultimoDisparoAudio > 1000)) {
//       console.log("Audio detectado, disparando acción!");
//       window.electronAPI.send("ejecutar-sonido", { perfilId: localStorage.getItem("perfilActivo") });
//       ultimoDisparoAudio = ahora;
//     }

//     requestAnimationFrame(procesarAudio);
//   }
//   procesarAudio();
// }

// // 4. ANÁLISIS DE VÍDEO (MEDIAPIPE)
// function reconocerGesto(puntosActuales) {
//   let mejorGesto = null;
//   let menorDistancia = Infinity;

//   bibliotecaGestos.forEach((gestoGuardado) => {
//     if (!gestoGuardado.descripcion) return;
//     try {
//       const puntosBase = JSON.parse(gestoGuardado.descripcion);
//       let distanciaTotal = 0;

//       for (let i = 0; i < 21; i++) {
//         const dx = puntosActuales[i].x - puntosBase[i].x;
//         const dy = puntosActuales[i].y - puntosBase[i].y;
//         // Usamos solo x e y por mayor estabilidad en webcams estándar
//         distanciaTotal += Math.sqrt(dx * dx + dy * dy);
//       }

//       const promedio = distanciaTotal / 21;
//       if (promedio < menorDistancia && promedio < UMBRAL_SIMILITUD) {
//         menorDistancia = promedio;
//         mejorGesto = gestoGuardado.nombre_gesto;
//       }
//     } catch (e) {
//       console.error("Error comparando gesto.");
//     }
//   });
//   return mejorGesto;
// }

// function iniciarMediaPipe() {
//   const hands = new Hands({
//     locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//   });

//   hands.setOptions({
//     maxNumHands: 1,
//     modelComplexity: 1,
//     minDetectionConfidence: 0.75,
//     minTrackingConfidence: 0.75,
//   });

//   hands.onResults((results) => {
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.save();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (results.image) {
//       ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
//     }

//     if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
//       const landmarks = results.multiHandLandmarks[0];
//       ultimosLandmarks = landmarks;

//       // Dibujar la mano como en tu código original
//       window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 4 });
//       window.drawLandmarks(ctx, landmarks, { color: "#FF0000", radius: 3 });

//       // Comparar con la base de datos
//       const nombreGesto = reconocerGesto(landmarks);
//       if (nombreGesto) {
//         if (nombreGesto !== gestoActual) {
//           gestoActual = nombreGesto;
//           actualizarEstado(`Gesto detectado: ${nombreGesto}`);
//           window.electronAPI.send("ejecutar-gesto", { gesto: nombreGesto, perfilId: localStorage.getItem("perfilActivo") });
//         }
//       } else {
//         gestoActual = null;
//         actualizarEstado("Mano detectada (Gesto no reconocido)");
//       }
//     } else {
//       gestoActual = null;
//     }
//     ctx.restore();
//   });

//   async function procesar() {
//     if (video.readyState >= 2) await hands.send({ image: video });
//     requestAnimationFrame(procesar);
//   }
//   procesar();
// }

// // 5. ASIGNACIONES Y GUARDADO
// async function capturarGesto() {
//   const nombre = document.getElementById("nombreGestoNuevo").value;
//   if (!nombre) return alert("Escribe un nombre para el gesto.");
//   if (!ultimosLandmarks) return alert("La cámara no detecta tu mano.");

//   const usuario = JSON.parse(localStorage.getItem("usuario"));
//   const ok = await window.electronAPI.invoke("crear-gesto-entrenado", {
//     nombre: nombre,
//     puntos: ultimosLandmarks,
//     id_usuario: usuario.id_usuario,
//   });

//   if (ok) {
//     alert("¡Gesto guardado con éxito!");
//     bibliotecaGestos = await window.electronAPI.invoke("obtener-biblioteca-gestos", usuario.id_usuario);
//     await cargarListas();
//     document.getElementById("nombreGestoNuevo").value = "";
//   }
// }

// let reconocimiento;
// let escuchandoVoz = false;

// // Configurar el motor de voz
// if ('webkitSpeechRecognition' in window) {
//     reconocimiento = new webkitSpeechRecognition();
//     reconocimiento.continuous = true; // Que no pare al detectar una palabra
//     reconocimiento.interimResults = false; // Solo resultados finales
//     reconocimiento.lang = 'es-ES'; // Idioma español

//     reconocimiento.onresult = (event) => {
//         const resultado = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
//         actualizarEstado(`Voz detectada: "${resultado}"`);

//         // Enviamos la frase a Electron para ver si tiene una acción asignada
//         window.electronAPI.send("ejecutar-comando-voz", {
//             frase: resultado,
//             perfilId: localStorage.getItem("perfilActivo")
//         });
//     };

//     reconocimiento.onerror = (event) => console.error("Error en reconocimiento:", event.error);
//     reconocimiento.onend = () => { if(escuchandoVoz) reconocimiento.start(); }; // Auto-reinicio
// }

// // Botón para encender/apagar el micro
// const btnEscucharVoz = document.getElementById("btnEscucharVoz");
// btnEscucharVoz.addEventListener("click", () => {
//     if (!escuchandoVoz) {
//         reconocimiento.start();
//         escuchandoVoz = true;
//         document.getElementById("txtEscuchar").innerText = "Escuchando...";
//         btnEscucharVoz.style.background = "#e74c3c";
//     } else {
//         reconocimiento.stop();
//         escuchandoVoz = false;
//         document.getElementById("txtEscuchar").innerText = "Iniciar Escucha";
//         btnEscucharVoz.style.background = "#2ecc71";
//     }
// });

// // Guardar nueva frase en la DB
// // Dentro de config.js, al darle al botón añadir frase:
// document.getElementById("btnGuardarFrase").addEventListener("click", async () => {
//     const texto = document.getElementById("nuevaFraseVoz").value.trim().toLowerCase();

//     if(!texto) return alert("Escribe algo.");

//     // Guardamos nombre igual que la frase para no liarnos, o podrías pedir un nombre aparte
//     const ok = await window.electronAPI.invoke("crear-frase-voz", {
//         nombre: texto, // Lo que verás en el select
//         frase: texto   // Lo que se guardará en 'descripcion'
//     });

//     if(ok) {
//         alert("Frase lista para vincular");
//         document.getElementById("nuevaFraseVoz").value = "";
//         await cargarListas(); // Para que aparezca en el select de 'vincular'
//     }
// });

// async function capturarSonido() {
//   const nombre = document.getElementById("nombreSonidoNuevo").value;
//   if (!nombre) return alert("Escribe un nombre para el sonido (ej: Aplauso fuerte).");

//   const ok = await window.electronAPI.invoke("crear-sonido", nombre);

//   if (ok) {
//     alert("¡Sonido guardado con éxito!");
//     document.getElementById("nombreSonidoNuevo").value = "";
//     await cargarListas(); // Esto recargará los desplegables mágicamente
//   } else {
//     alert("Hubo un error al guardar el sonido.");
//   }
// }

// // 3. ANÁLISIS DE AUDIO MEJORADO
// function iniciarEscuchaAudio(stream) {
//   const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//   audioContextGlobal = audioCtx;
//   const analyser = audioCtx.createAnalyser();
//   analyser.fftSize = 256;
//   const source = audioCtx.createMediaStreamSource(stream);
//   source.connect(analyser);

//   const dataArray = new Uint8Array(analyser.frequencyBinCount);
//   analizandoAudio = true;

//   function procesarAudio() {
//     if (!analizandoAudio) return;
//     analyser.getByteFrequencyData(dataArray);

//     let suma = 0;
//     let maxVol = 0;
//     let indiceFrecuenciaDominante = 0;

//     for (let i = 0; i < dataArray.length; i++) {
//       suma += dataArray[i];
//       if (dataArray[i] > maxVol) {
//         maxVol = dataArray[i];
//         indiceFrecuenciaDominante = i;
//       }
//     }
//     let volumenPromedio = suma / dataArray.length;

//     // Calcular la frecuencia real en Hercios (Hz)
//     let frecuenciaHz = indiceFrecuenciaDominante * (audioCtx.sampleRate / 2) / analyser.frequencyBinCount;

//     if (barraVolumen) barraVolumen.value = volumenPromedio;

//     // SI ESTAMOS GRABANDO EL SONIDO PARA GUARDARLO
//     if (grabandoSonido && volumenPromedio > 10) { // Solo guarda si hay algo de ruido
//       frecuenciasGrabadas.push(frecuenciaHz);
//       volumenesGrabados.push(maxVol);
//     }

//     // SI ESTAMOS EN MODO ESCUCHA NORMAL (y no grabando)
//     const ahora = Date.now();
//     if (!grabandoSonido && volumenPromedio > umbralAudio && (ahora - ultimoDisparoAudio > 1000)) {
//        // Aquí en el futuro meteremos la lógica para comparar la frecuenciaHz con la base de datos
//        console.log("Ruido detectado - Frecuencia:", frecuenciaHz.toFixed(0), "Hz");
//        // window.electronAPI.send("ejecutar-sonido", ...);
//        ultimoDisparoAudio = ahora;
//     }

//     requestAnimationFrame(procesarAudio);
//   }
//   procesarAudio();
// }

// // NUEVA LÓGICA DE BOTONES DE AUDIO
// const btnGrabarSonido = document.getElementById("btnGrabarSonido");
// const btnGuardarSonido = document.getElementById("btnGuardarSonido");
// const infoGrabacion = document.getElementById("infoGrabacion");

// if (btnGrabarSonido) {
//   btnGrabarSonido.addEventListener("click", () => {
//     const nombre = document.getElementById("nombreSonidoNuevo").value;
//     if (!nombre) return alert("Ponle un nombre primero (ej: Silbido)");

//     frecuenciasGrabadas = [];
//     volumenesGrabados = [];
//     grabandoSonido = true;

//     btnGrabarSonido.style.display = "none";
//     btnGuardarSonido.style.display = "flex";
//     infoGrabacion.style.display = "block";
//   });
// }

// if (btnGuardarSonido) {
//   btnGuardarSonido.addEventListener("click", async () => {
//     grabandoSonido = false;
//     btnGrabarSonido.style.display = "flex";
//     btnGuardarSonido.style.display = "none";
//     infoGrabacion.style.display = "none";

//     if (frecuenciasGrabadas.length === 0) {
//       return alert("No se detectó ningún sonido claro. Inténtalo de nuevo.");
//     }

//     // Calcular mínimos, máximos y umbrales de lo que acabamos de grabar
//     const frecMin = Math.min(...frecuenciasGrabadas);
//     const frecMax = Math.max(...frecuenciasGrabadas);

//     // El umbral será la media de los volúmenes grabados (le bajamos un poco el nivel para que sea más fácil activarlo luego)
//     const umbralMedia = volumenesGrabados.reduce((a, b) => a + b, 0) / volumenesGrabados.length;
//     const umbralFinal = Math.floor(umbralMedia * 0.8);

//     const nombre = document.getElementById("nombreSonidoNuevo").value;

//     // Enviar a Electron con todos los datos reales
//     const ok = await window.electronAPI.invoke("crear-sonido-completo", {
//       nombre: nombre,
//       frecMin: frecMin,
//       frecMax: frecMax,
//       umbral: umbralFinal
//     });

//     if (ok) {
//       alert(`¡Sonido guardado! Rango: ${frecMin.toFixed(0)}Hz - ${frecMax.toFixed(0)}Hz`);
//       document.getElementById("nombreSonidoNuevo").value = "";
//       await cargarListas();
//     } else {
//       alert("Error al guardar.");
//     }
//   });
// }

// // EVENT LISTENER PARA EL NUEVO BOTÓN
// const btnCapturarSonido = document.getElementById("btnCapturarSonido");
// if (btnCapturarSonido) btnCapturarSonido.addEventListener("click", capturarSonido);

// async function guardarGestoAccion() {
//   const perfilId = localStorage.getItem("perfilActivo");
//   if (!selectorGestos.value || !selectorAcciones.value) return alert("Selecciona gesto y acción.");
//   const ok = await window.electronAPI.invoke("guardarConfig", perfilId, selectorGestos.value, selectorAcciones.value);
//   if (ok) alert("Vínculo de gesto guardado.");
// }

// async function guardarSonidoAccion() {
//   const perfilId = localStorage.getItem("perfilActivo");
//   if (!selectorSonidos.value || !selectorAccionesSonido.value) return alert("Selecciona sonido y acción.");
//   const ok = await window.electronAPI.invoke("guardarConfigSonido", perfilId, selectorSonidos.value, selectorAccionesSonido.value);
//   if (ok) alert("Vínculo de sonido guardado.");
// }

// // EVENT LISTENERS
// btnIniciar.addEventListener("click", iniciarSensores);
// if (btnAsignar) btnAsignar.addEventListener("click", guardarGestoAccion);
// if (btnAsignarSonido) btnAsignarSonido.addEventListener("click", guardarSonidoAccion);
// const btnCapturar = document.getElementById("btnCapturar");
// if (btnCapturar) btnCapturar.addEventListener("click", capturarGesto);

// // Iniciar
// inicializar();

// Elementos de la interfaz
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const estado = document.getElementById("estado");

const selectorCamara = document.getElementById("selectorCamara");
const btnIniciar = document.getElementById("btnIniciar");

const selectorGestos = document.getElementById("selectorGestos");
const selectorAcciones = document.getElementById("selectorAcciones");
const btnAsignar = document.getElementById("btnAsignar");
const btnCapturar = document.getElementById("btnCapturar");

const selectorSonidos = document.getElementById("selectorSonidos"); // Aquí se muestran las frases
const selectorAccionesSonido = document.getElementById(
  "selectorAccionesSonido",
);
const btnAsignarSonido = document.getElementById("btnAsignarSonido");
const btnGuardarFrase = document.getElementById("btnGuardarFrase");
const btnEscucharVoz = document.getElementById("btnEscucharVoz");
const selectPTTKey = document.getElementById("selectPTTKey");

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

// 1. INICIALIZACIÓN
async function inicializar() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const dispositivos = await navigator.mediaDevices.enumerateDevices();

    const camaras = dispositivos.filter((d) => d.kind === "videoinput");
    selectorCamara.innerHTML = camaras
      .map(
        (c, i) =>
          `<option value="${c.deviceId}">${c.label || "Cámara " + (i + 1)}</option>`,
      )
      .join("");

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
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

async function cargarListas() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return;

  // ACTUALIZACIÓN CRÍTICA: Actualizamos la biblioteca de comparación
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

  // ... (aquí sigue tu código de rellenar los innerHTML igual que antes)
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

// 2. GESTOS (VIDEO)
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
      window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });
      window.drawLandmarks(ctx, landmarks, { color: "#FF0000", radius: 3 });

      const nombreGesto = reconocerGesto(landmarks);
      if (nombreGesto && nombreGesto !== gestoActual) {
        gestoActual = nombreGesto;
        actualizarEstado(`Gesto: ${nombreGesto}`);
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

  async function procesar() {
    if (video.readyState >= 2) await hands.send({ image: video });
    requestAnimationFrame(procesar);
  }
  procesar();
}

function reconocerGesto(puntosActuales) {
  let mejorGesto = null;
  let menorDistancia = Infinity;

  bibliotecaGestos.forEach((g) => {
    if (!g.descripcion) return;
    try {
      const puntosBase = JSON.parse(g.descripcion);
      let distTotal = 0;

      // Usamos el punto 0 (muñeca) como referencia para que la posición no importe
      const dx0 = puntosActuales[0].x;
      const dy0 = puntosActuales[0].y;
      const bx0 = puntosBase[0].x;
      const by0 = puntosBase[0].y;

      for (let i = 0; i < 21; i++) {
        // Calculamos la posición relativa de cada dedo respecto a la muñeca
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

// --- CAMBIO EN CONFIG.JS ---
let mediaRecorder;
let audioChunks = [];

function configurarMotorVoz() {
  // Ya no necesitamos configurar nada de SpeechRecognition de Google
  actualizarEstado("Motor Whisper Local listo.");
}

// --- NUEVA LÓGICA DE GRABACIÓN PURA ---
window.electronAPI.on("ptt-activar", async () => {
  if (estaHablando) return;
  estaHablando = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const source = audioCtx.createMediaStreamSource(stream);

    // Usamos un procesador para obtener los datos crudos (raw)
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);

    let samples = [];

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      samples.push(new Float32Array(inputData));
    };

    source.connect(processor);
    processor.connect(audioCtx.destination);

    actualizarEstado("🎤 Escuchando...");
    btnEscucharVoz.style.background = "#e74c3c";

    // Grabamos 3 segundos
    setTimeout(() => {
      source.disconnect();
      processor.disconnect();
      stream.getTracks().forEach((t) => t.stop());

      // Convertimos los trozos de audio en un solo buffer
      const mergedSamples = flattenArray(samples);
      const wavBuffer = encodeWAV(mergedSamples, 16000);

      // Enviamos el WAV perfecto al Main
      window.electronAPI.send("procesar-audio-whisper", wavBuffer);

      estaHablando = false;
      btnEscucharVoz.style.background = "#2ecc71";
      actualizarEstado("🤖 Procesando con Whisper...");
    }, 3000);
  } catch (err) {
    console.error("Error micro:", err);
    estaHablando = false;
  }
});

// --- FUNCIONES DE APOYO (Cópialas tal cual) ---
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
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
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

// Guardar preferencia de tecla
selectPTTKey.addEventListener("change", () => {
  window.electronAPI.send("configurar-ptt", selectPTTKey.value);
});

// Al iniciar, mandamos la tecla por defecto
window.electronAPI.send("configurar-ptt", "F2");

window.electronAPI.on("nueva-frase-guardada", (frase) => {
  console.log("Se ha guardado una frase nueva:", frase);
  actualizarEstado(`Nueva frase detectada: "${frase}"`);

  // RECARGA LAS LISTAS para que aparezca en el <select>
  cargarListas();
});

// 4. EVENTOS DE BOTONES
btnIniciar.addEventListener("click", iniciarSensores);

if (btnCapturar) {
  btnCapturar.addEventListener("click", async () => {
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

if (btnAsignar) {
  btnAsignar.addEventListener("click", async () => {
    const ok = await window.electronAPI.invoke(
      "guardarConfig",
      localStorage.getItem("perfilActivo"),
      selectorGestos.value,
      selectorAcciones.value,
    );
    if (ok) alert("Gesto vinculado.");
  });
}

if (btnAsignarSonido) {
  btnAsignarSonido.addEventListener("click", async () => {
    const ok = await window.electronAPI.invoke(
      "guardarConfigSonido",
      localStorage.getItem("perfilActivo"),
      selectorSonidos.value,
      selectorAccionesSonido.value,
    );
    if (ok) alert("Voz vinculada.");
  });
}

// Push to Talk selector
if (selectPTTKey) {
  selectPTTKey.addEventListener("change", () => {
    window.electronAPI.send("configurar-ptt", selectPTTKey.value);
  });
}

inicializar();

// ========== MODAL DE AYUDA ==========
document.addEventListener("DOMContentLoaded", function () {
  // ========== MODAL DE AYUDA (versión simple) ==========
  const modal = document.getElementById("welcomeModal");
  const btnAyuda = document.getElementById("btnAyuda");
  const btnClose = document.getElementById("closeWelcome");

  // Abrir modal al hacer clic en Ayuda
  if (btnAyuda) {
    btnAyuda.addEventListener("click", function () {
      modal.style.display = "flex";
    });
  }

  // Cerrar modal con el botón Entendido
  if (btnClose) {
    btnClose.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Cerrar modal si se hace clic fuera del contenido
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
