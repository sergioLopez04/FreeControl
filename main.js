// const { app, BrowserWindow, ipcMain } = require("electron");
// const { keyboard, Key, mouse, Button } = require("@nut-tree-fork/nut-js");
// const db = require("./database/db");
// const path = require("path");
// const bcrypt = require("bcrypt"); // Aseguramos que esté arriba

// app.commandLine.appendSwitch("use-fake-ui-for-media-stream");

// function createWindow() {
//   const win = new BrowserWindow({
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, "preload.js"),
//       webSecurity: false,
//       allowRunningInsecureContent: true,
//       backgroundThrottling: false,
//     },
//   });
//   win.maximize();
//   win.loadFile("renderer/html/login.html");
// }

// function createConfigWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, "preload.js"),
//       webSecurity: false,
//       allowRunningInsecureContent: true,
//       experimentalFeatures: true,
//     },
//   });

//   const ses = win.webContents.session;

//   ses.setPermissionCheckHandler((webContents, permission) => {
//     if (permission === "media") return true;
//     return false;
//   });

//   ses.setPermissionRequestHandler((webContents, permission, callback) => {
//     if (permission === "media") {
//       callback(true);
//     } else {
//       callback(false);
//     }
//   });

//   ses.webRequest.onHeadersReceived((details, callback) => {
//     callback({
//       responseHeaders: {
//         ...details.responseHeaders,
//         "Content-Security-Policy": ["*"],
//       },
//     });
//   });

//   win.loadFile("renderer/html/config.html");
//   return win;
// }

// app.whenReady().then(createWindow);

// // --- SECCIÓN: USUARIOS Y LOGIN ---

// ipcMain.handle("login", async (event, email, password) => {
//   try {
//     if (!email || !password) return [];

//     const sql = "SELECT * FROM Usuario WHERE email = ?";
//     const results = await new Promise((resolve, reject) => {
//       db.query(sql, [email], (err, res) => {
//         if (err) reject(err);
//         else resolve(res);
//       });
//     });

//     if (results.length === 0) return [];
//     const user = results[0];

//     const match = await bcrypt.compare(password, user.contrasena_hash);
//     if (match) return [user];
//     return [];
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     return [];
//   }
// });

// ipcMain.handle("register", async (event, username, email, password) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const sql = `INSERT INTO Usuario (nombre_usuario, email, contrasena_hash, id_rol) VALUES (?, ?, ?, 1)`;
//       db.query(sql, [username, email, hashedPassword], (err, result) => {
//         if (err) reject(err);
//         else resolve(result);
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// });

// // --- SECCIÓN: PERFILES ---

// ipcMain.handle("obtenerPerfiles", async (event, usuarioId) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM Perfil WHERE id_usuario = ?";
//     db.query(sql, [usuarioId], (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// });

// ipcMain.handle("crearPerfil", async (event, usuarioId, nombre) => {
//   return new Promise((resolve, reject) => {
//     const checkSql =
//       "SELECT COUNT(*) as total FROM Perfil WHERE id_usuario = ?";
//     db.query(checkSql, [usuarioId], (err, results) => {
//       if (results[0].total >= 4) return resolve({ error: "MAX_PERFILES" });

//       const insertSql = `INSERT INTO Perfil (id_usuario, nombre_perfil) VALUES (?, ?)`;
//       db.query(insertSql, [usuarioId, nombre], (err2, result) => {
//         if (err2) reject(err2);
//         else resolve(result);
//       });
//     });
//   });
// });

// // --- SECCIÓN: CONFIGURACIÓN DE GESTOS Y ACCIONES ---

// // main.js

// ipcMain.handle("obtenerGestos", async (event, usuarioId) => { // <--- Recibimos el usuarioId aquí
//   return new Promise((resolve, reject) => {
//     const sql = `SELECT id_gesto, nombre_gesto, descripcion FROM Gesto WHERE id_usuario = ?`;

//     // IMPORTANTE: El segundo argumento DEBE ser el array con los valores para los "?"
//     db.query(sql, [usuarioId], (err, results) => {
//       if (err) {
//         console.error("Error en la consulta SQL:", err);
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// });

// ipcMain.handle("obtenerAcciones", async () => {
//   return new Promise((resolve, reject) => {
//     db.query("SELECT * FROM Accion", (err, results) => {
//       if (err) reject(err);
//       else resolve(results);
//     });
//   });
// });

// ipcMain.handle("guardarConfig", async (event, perfilId, gestoId, accionId) => {
//   return new Promise((resolve, reject) => {
//     const sql = `
//       INSERT INTO Perfil_Gesto_Accion (id_perfil, id_gesto, id_accion)
//       VALUES (?, ?, ?)
//       ON DUPLICATE KEY UPDATE id_accion = ?
//     `;
//     db.query(sql, [perfilId, gestoId, accionId, accionId], (err, result) => {
//       if (err) reject(err);
//       else resolve(result);
//     });
//   });
// });

// // --- SECCIÓN: IA ENTRENABLE (Nuevos Handlers) ---

// ipcMain.handle("crear-gesto-entrenado", async (event, { nombre, puntos, id_usuario }) => {
//   return new Promise((resolve, reject) => {
//     // Guardamos los 21 puntos en 'descripcion' como un string JSON
//     const sql =
//       "INSERT INTO Gesto (nombre_gesto, descripcion, requiere_calibracion, id_usuario) VALUES (?, ?, 1, ?)";
//     db.query(sql, [nombre, JSON.stringify(puntos), id_usuario], (err, result) => {
//       if (err) {
//         console.error("Error al insertar gesto:", err);
//         resolve(false);
//       } else {
//         resolve(true);
//       }
//     });
//   });
// });

// ipcMain.handle("obtener-biblioteca-gestos", async (event, usuarioId) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       "SELECT id_gesto, nombre_gesto, descripcion FROM Gesto WHERE id_usuario = ?",
//       [usuarioId],
//       (err, results) => {
//         if (err) reject(err);
//         else resolve(results);
//       },
//     );
//   });
// });

// // --- SECCIÓN: EJECUCIÓN (Nut.js) ---

// // --- SECCIÓN: EJECUCIÓN (Nut.js actualizado) ---

// // --- SECCIÓN: EJECUCIÓN (Nut.js actualizado) ---

// ipcMain.on("ejecutar-gesto", async (event, { gesto, perfilId }) => {
//   console.log("Datos recibidos en el Main:", { gesto, perfilId });
//   try {
//     // IMPORTANTE: Ahora pedimos el 'comando' de la tabla Accion
//     const sql = `
//       SELECT a.comando
//       FROM Perfil_Gesto_Accion pga
//       JOIN Gesto g ON pga.id_gesto = g.id_gesto
//       JOIN Accion a ON pga.id_accion = a.id_accion
//       WHERE pga.id_perfil = ? AND g.nombre_gesto = ?`;

//     db.query(sql, [perfilId, gesto], async (err, results) => {
//       console.log("Resultado de la búsqueda en DB:", results);
//       if (err || results.length === 0) return;

//       const cmd = results[0].comando;
//       console.log(`Ejecutando comando: ${cmd} para gesto: ${gesto}`);

//       // Mapeo de comandos a acciones de Nut.js
//       switch (cmd) {
//         // RATÓN
//         case "MOUSE_LEFT":
//           await mouse.click(Button.LEFT);
//           break;
//         case "MOUSE_RIGHT":
//           await mouse.click(Button.RIGHT);
//           break;
//         case "MOUSE_DOUBLE":
//           await mouse.doubleClick(Button.LEFT);
//           break;
//         case "SCROLL_UP":
//           await mouse.scrollUp(10);
//           break;
//         case "SCROLL_DOWN":
//           await mouse.scrollDown(10);
//           break;

//         // TECLADO SIMPLE
//         case "KEY_SPACE":
//           await keyboard.type(Key.Space);
//           break;
//         case "KEY_ENTER":
//           await keyboard.type(Key.Enter);
//           break;
//         case "KEY_ESC":
//           await keyboard.type(Key.Escape);
//           break;
//         case "KEY_UP":
//           await keyboard.type(Key.Up);
//           break;
//         case "KEY_DOWN":
//           await keyboard.type(Key.Down);
//           break;
//         case "KEY_LEFT":
//           await keyboard.type(Key.Left);
//           break;
//         case "KEY_RIGHT":
//           await keyboard.type(Key.Right);
//           break;
//         case "KEY_BACKSPACE":
//           await keyboard.type(Key.Backspace);
//           break;
//         case "KEY_TAB":
//           await keyboard.type(Key.Tab);
//           break;

//         // MULTIMEDIA (Nota: algunos teclados/S.O. pueden variar)
//         case "VOL_UP":
//           await keyboard.pressKey(Key.AudioRaiseVolume);
//           await keyboard.releaseKey(Key.AudioRaiseVolume);
//           break;
//         case "VOL_DOWN":
//           await keyboard.pressKey(Key.AudioLowerVolume);
//           await keyboard.releaseKey(Key.AudioLowerVolume);
//           break;
//         case "VOL_MUTE":
//           await keyboard.type(Key.AudioMute);
//           break;
//         case "MEDIA_NEXT":
//           await keyboard.type(Key.AudioNext);
//           break;
//         case "MEDIA_PREV":
//           await keyboard.type(Key.AudioPrev);
//           break;

//         // MACROS / ATAJOS
//         case "CMD_COPY":
//           await keyboard.pressKey(Key.LeftControl);
//           await keyboard.type(Key.C);
//           await keyboard.releaseKey(Key.LeftControl);
//           break;
//         case "CMD_PASTE":
//           await keyboard.pressKey(Key.LeftControl);
//           await keyboard.type(Key.V);
//           await keyboard.releaseKey(Key.LeftControl);
//           break;
//         case "CMD_UNDO":
//           await keyboard.pressKey(Key.LeftControl);
//           await keyboard.type(Key.Z);
//           await keyboard.releaseKey(Key.LeftControl);
//           break;
//         case "CMD_SHOW_DESKTOP":
//           // Tecla Windows + D
//           await keyboard.pressKey(Key.LeftSuper);
//           await keyboard.type(Key.D);
//           await keyboard.releaseKey(Key.LeftSuper);
//           break;
//         case "CMD_CLOSE":
//           // Alt + F4
//           await keyboard.pressKey(Key.LeftAlt);
//           await keyboard.type(Key.F4);
//           await keyboard.releaseKey(Key.LeftAlt);
//           break;

//         default:
//           console.log("El comando no tiene una acción programada en main.js");
//       }
//     });
//   } catch (error) {
//     console.error("Error al ejecutar gesto:", error);
//   }
// });

// ipcMain.on("abrir-configuracion", () => {
//   createConfigWindow();
// });

const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  shell,
} = require("electron");
const { keyboard, Key, mouse, Button } = require("@nut-tree-fork/nut-js");
const db = require("./database/db");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { exec } = require("child_process");

// --- CONFIGURACIÓN ---
let perfilActual = null;
let mainWindow;
let usuarioActualId = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      allowRunningInsecureContent: true,
      backgroundThrottling: false,
    },
  });

  mainWindow.maximize();
  mainWindow.loadFile("renderer/html/login.html");
}

function createConfigWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      allowRunningInsecureContent: true,
      spellcheck: false,
      backgroundThrottling: false,
    },
  });

  win.loadFile("renderer/html/config.html");
}

app.commandLine.appendSwitch("lang", "es-ES");

// --- FUNCIÓN DE LIMPIEZA (Ponla fuera del ipcMain) ---
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .replace(/[.,!¡?¿]/g, "") // Quita signos
    .replace(/(.)\1+/g, "$1") // Quita letras repetidas (google -> gogle)
    .trim();
}

ipcMain.on("procesar-audio-whisper", (event, audioData) => {
  const rutaAudio = path.join(__dirname, "prueba.wav");
  fs.writeFileSync(rutaAudio, Buffer.from(audioData));

  const carpetaRelease = path.join(__dirname, "release");
  const exe = path.join(carpetaRelease, "whisper-cli.exe");
  const modelo = path.join(__dirname, "ggml-tiny.bin");
  const comando = `"${exe}" -m "${modelo}" -f "${rutaAudio}" -l es -nt`;

  exec(comando, { cwd: carpetaRelease }, (error, stdout) => {
    const fraseOriginal = stdout.trim().toLowerCase();
    const fraseVoz = normalizarTexto(fraseOriginal);

    if (!fraseVoz || fraseVoz.length < 2) return;

    const sql = `
    SELECT a.comando, s.descripcion, s.id_sonido
    FROM sonido s
    LEFT JOIN perfil_sonido_accion psa ON s.id_sonido = psa.id_sonido
    LEFT JOIN accion a ON psa.id_accion = a.id_accion
    WHERE (? IS NULL OR psa.id_perfil = ? OR psa.id_perfil IS NULL)
`;

    db.query(sql, [perfilActual, perfilActual], (err, rows) => {
      if (err) return console.error("Error SQL:", err);
      console.log(`Filas encontradas: ${rows.length}`);

      let encontrado = false;

      for (const row of rows) {
        const fraseBD = (row.descripcion || "").toLowerCase().trim();
        const palabrasBD = fraseBD.split(" ");
        const palabraClaveBD = palabrasBD[palabrasBD.length - 1]; // "gogle"

        const palabrasVoz = fraseVoz.split(" "); // Lo que has dicho: ["abre", "el", "goble"]

        // COMPROBACIÓN CHAPUZA:
        // Buscamos si ALGUNA palabra de lo que has dicho empieza igual que la palabra clave de la BD
        const coincide =
          palabrasVoz.some(
            (palabra) => palabra.startsWith(palabraClaveBD.substring(0, 2)), // Si empieza por "go"
          ) || fraseVoz.includes(fraseBD);

        if (coincide) {
          encontrado = true; // Marcamos que existe para que NO lo inserte otra vez
          if (row.comando) {
            ejecutarAccionReal(row.comando);
            break;
          } else {
            break;
          }
        }
      }

      if (!encontrado) {
        // --- EVITAR DUPLICADOS ---
        db.query(
          "SELECT id_sonido FROM sonido WHERE descripcion = ?",
          [fraseVoz],
          (errCheck, rowsCheck) => {
            if (rowsCheck.length > 0) {
              return;
            }

            db.query(
              "INSERT INTO sonido (nombre_sonido, descripcion, id_usuario) VALUES (?, ?, ?)",
              ["Comando Voz", fraseVoz, usuarioActualId],
              (err) => {
                if (!err && mainWindow) {
                  mainWindow.webContents.send("nueva-frase-guardada", fraseVoz);
                }
              },
            );
          },
        );
      }
    });
  });
});

app.whenReady().then(async () => {
  createWindow();
});

// Actualizar perfil activo
ipcMain.on("set-perfil-activo", (event, perfilId) => {
  perfilActual = perfilId;
});

// --- FUNCIÓN MAESTRA DE EJECUCIÓN (NUT.JS) ---
async function ejecutarAccionReal(comando) {
  if (!comando) return;
  console.log("Ejecutando comando:", comando);
  try {
    switch (comando) {
      case "OPEN_GOOGLE":
        shell.openExternal("https://google.com");
        break;
      case "OPEN_YOUTUBE":
        shell.openExternal("https://youtube.com");
        break;
      case "BROWSER_NEW_TAB":
        await keyboard.pressKey(Key.LeftControl);
        await keyboard.type(Key.T);
        await keyboard.releaseKey(Key.LeftControl);
        break;
      case "BROWSER_CLOSE_TAB":
        await keyboard.pressKey(Key.LeftControl);
        await keyboard.type(Key.W);
        await keyboard.releaseKey(Key.LeftControl);
        break;
      case "MOUSE_LEFT":
        await mouse.click(Button.LEFT);
        break;
      case "MOUSE_RIGHT":
        await mouse.click(Button.RIGHT);
        break;
      case "MOUSE_DOUBLE":
        await mouse.doubleClick(Button.LEFT);
        break;
      case "SCROLL_UP":
        await mouse.scrollUp(10);
        break;
      case "SCROLL_DOWN":
        await mouse.scrollDown(10);
        break;
      case "KEY_SPACE":
        await keyboard.type(Key.Space);
        break;
      case "KEY_ENTER":
        await keyboard.type(Key.Enter);
        break;
      case "KEY_ESC":
        await keyboard.type(Key.Escape);
        break;
      case "KEY_UP":
        await keyboard.type(Key.Up);
        break;
      case "KEY_DOWN":
        await keyboard.type(Key.Down);
        break;
      case "KEY_LEFT":
        await keyboard.type(Key.Left);
        break;
      case "KEY_RIGHT":
        await keyboard.type(Key.Right);
        break;
      case "KEY_BACKSPACE":
        await keyboard.type(Key.Backspace);
        break;
      case "KEY_TAB":
        await keyboard.type(Key.Tab);
        break;
      case "VOL_UP":
        exec(
          'powershell -Command "(New-Object -ComObject WScript.Shell).SendKeys([char]175)"',
        );
        break;
      case "VOL_DOWN":
        exec(
          'powershell -Command "(New-Object -ComObject WScript.Shell).SendKeys([char]174)"',
        );
        break;
      case "VOL_MUTE":
        await keyboard.type(Key.AudioMute);
        break;
      case "MEDIA_NEXT":
        await keyboard.type(Key.AudioNext);
        break;
      case "MEDIA_PREV":
        await keyboard.type(Key.AudioPrev);
        break;
      case "CMD_COPY":
        await keyboard.pressKey(Key.LeftControl);
        await keyboard.type(Key.C);
        await keyboard.releaseKey(Key.LeftControl);
        break;
      case "CMD_PASTE":
        await keyboard.pressKey(Key.LeftControl);
        await keyboard.type(Key.V);
        await keyboard.releaseKey(Key.LeftControl);
        break;
      case "CMD_UNDO":
        await keyboard.pressKey(Key.LeftControl);
        await keyboard.type(Key.Z);
        await keyboard.releaseKey(Key.LeftControl);
        break;
      case "CMD_SHOW_DESKTOP":
        await keyboard.pressKey(Key.LeftSuper);
        await keyboard.type(Key.D);
        await keyboard.releaseKey(Key.LeftSuper);
        break;
      case "CMD_CLOSE":
        await keyboard.pressKey(Key.LeftAlt);
        await keyboard.type(Key.F4);
        await keyboard.releaseKey(Key.LeftAlt);
        break;
      default:
        console.log("Comando no mapeado:", comando);
    }
  } catch (e) {
    console.error("Error en NutJS:", e);
  }
}

function registrarAccesoRapido(tecla) {
  try {
    globalShortcut.unregisterAll();
    globalShortcut.register(tecla, () => {
      if (BrowserWindow.getAllWindows().length > 0) {
        // Enviamos la orden de activar micro a la ventana activa
        BrowserWindow.getFocusedWindow()?.webContents.send("ptt-activar");
      }
    });
  } catch (e) {
    console.error(e);
  }
}

// Busca donde tienes el ipcMain.on("configurar-ptt" ...)
ipcMain.on("configurar-ptt", (e, tecla) => {
  globalShortcut.unregisterAll();
  globalShortcut.register(tecla, () => {
    // CAMBIO AQUÍ: En lugar de "getFocusedWindow", usamos "mainWindow"
    // que es la variable donde guardaste tu ventana al principio.
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("ptt-activar");
    }
  });
});
app.on("will-quit", () => globalShortcut.unregisterAll());

ipcMain.handle("login", async (event, email, password) => {
  try {
    if (!email || !password) return [];
    const sql = "SELECT * FROM Usuario WHERE email = ?";
    const results = await new Promise((resolve, reject) => {
      db.query(sql, [email], (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
    if (results.length === 0) return [];
    const user = results[0];
    const match = await bcrypt.compare(password, user.contrasena_hash);
    if (match) {
      usuarioActualId = user.id_usuario;
      return [user];
    }
    return [];
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return [];
  }
});

ipcMain.handle("register", async (event, username, email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO Usuario (nombre_usuario, email, contrasena_hash, id_rol) VALUES (?, ?, ?, 1)`;
      db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
});

ipcMain.handle("obtenerPerfiles", async (event, usuarioId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Perfil WHERE id_usuario = ?";
    db.query(sql, [usuarioId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
});

ipcMain.handle("obtener-biblioteca-gestos", async (event, usuarioId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id_gesto, nombre_gesto, descripcion FROM Gesto WHERE id_usuario = ?",
      [usuarioId],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      },
    );
  });
});

ipcMain.handle("crearPerfil", async (event, usuarioId, nombre) => {
  return new Promise((resolve, reject) => {
    const checkSql =
      "SELECT COUNT(*) as total FROM Perfil WHERE id_usuario = ?";
    db.query(checkSql, [usuarioId], (err, results) => {
      if (results[0].total >= 4) return resolve({ error: "MAX_PERFILES" });
      const insertSql = `INSERT INTO Perfil (id_usuario, nombre_perfil) VALUES (?, ?)`;
      db.query(insertSql, [usuarioId, nombre], (err2, result) => {
        if (err2) reject(err2);
        else resolve(result);
      });
    });
  });
});

ipcMain.handle("obtenerGestos", async (event, usuarioId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id_gesto, nombre_gesto, descripcion FROM Gesto WHERE id_usuario = ?`;
    db.query(sql, [usuarioId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
});

ipcMain.handle("obtenerAcciones", async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM Accion", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
});

ipcMain.handle(
  "crear-gesto-entrenado",
  async (event, { nombre, puntos, id_usuario }) => {
    return new Promise((resolve, reject) => {
      const sql =
        "INSERT INTO Gesto (nombre_gesto, descripcion, requiere_calibracion, id_usuario) VALUES (?, ?, 1, ?)";
      db.query(
        sql,
        [nombre, JSON.stringify(puntos), id_usuario],
        (err, result) => {
          if (err) resolve(false);
          else resolve(true);
        },
      );
    });
  },
);

ipcMain.handle("guardarConfig", async (event, perfilId, gestoId, accionId) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Perfil_Gesto_Accion (id_perfil, id_gesto, id_accion) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id_accion = ?`;
    db.query(sql, [perfilId, gestoId, accionId, accionId], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
});

ipcMain.on("ejecutar-gesto", (event, { gesto, perfilId }) => {
  perfilActual = perfilId; // Aprovechamos para actualizar el perfil activo aquí también
  const sql = `SELECT a.comando FROM Perfil_Gesto_Accion pga 
               JOIN Gesto g ON pga.id_gesto = g.id_gesto 
               JOIN Accion a ON pga.id_accion = a.id_accion 
               WHERE pga.id_perfil = ? AND g.nombre_gesto = ?`;
  db.query(sql, [perfilId, gesto], (err, res) => {
    if (res?.length > 0) ejecutarAccionReal(res[0].comando);
  });
});

ipcMain.handle("obtenerSonidos", () => {
  return new Promise((r) =>
    db.query(
      "SELECT * FROM Sonido WHERE id_usuario = ?",
      [usuarioActualId],
      (e, res) => r(res),
    ),
  );
});

ipcMain.handle("crear-frase-voz", async (event, datos) => {
  return new Promise((r) => {
    const sql = "INSERT INTO sonido (nombre_sonido, descripcion) VALUES (?, ?)";
    db.query(sql, [datos.nombre, datos.frase], (err) => r(!err));
  });
});

ipcMain.handle("guardarConfigSonido", (event, perfilId, sonidoId, accionId) => {
  return new Promise((r) => {
    const sql =
      "INSERT INTO Perfil_Sonido_Accion (id_perfil, id_sonido, id_accion, activo) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE id_accion = ?, activo = 1";
    db.query(sql, [perfilId, sonidoId, accionId, accionId], (e) => r(!e));
  });
});

ipcMain.on("abrir-configuracion", () => {
  createConfigWindow();
});

// --- SCRIPT DE TEST AUTOMÁTICO ---
ipcMain.on("ejecutar-test-completo", async () => {
  const accionesATestear = ["VOL_UP"];

  console.log("🚀 Iniciando Test Automático de 29 acciones...");

  for (const cmd of accionesATestear) {
    console.log(`🧪 Probando: ${cmd}`);

    // Ejecutamos la acción
    await ejecutarAccionReal(cmd);

    // Esperamos 2 segundos entre cada una para que te dé tiempo a ver qué pasa
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(
    "✅ Test completado. Revisa si todas las acciones hicieron lo que debían.",
  );
});


ipcMain.handle("obtener-viculos-dashboard", async (event, perfilId) => {
  return new Promise((resolve) => {
    const sql = `
      SELECT pga.id_perfil, pga.id_gesto, pga.id_accion, 
             g.nombre_gesto, a.nombre_accion, a.comando
      FROM Perfil_Gesto_Accion pga
      JOIN Gesto g ON pga.id_gesto = g.id_gesto
      JOIN Accion a ON pga.id_accion = a.id_accion
      WHERE pga.id_perfil = ?`;
    
    db.query(sql, [perfilId], (err, rows) => {
      if (err) {
        console.error(err);
        resolve([]);
      } else {
        resolve(rows);
      }
    });
  });
});

// 2. Actualizar un vínculo existente
ipcMain.handle("actualizar-vinculo-real", async (event, { perfilId, gestoId, accionId }) => {
  return new Promise((resolve) => {
    // Usamos el id_gesto e id_perfil para encontrar la fila y cambiar la accion
    const sql = `UPDATE Perfil_Gesto_Accion SET id_accion = ? WHERE id_perfil = ? AND id_gesto = ?`;
    db.query(sql, [accionId, perfilId, gestoId], (err, result) => {
      resolve({ success: !err });
    });
  });
});

// 3. Eliminar un vínculo
ipcMain.handle("eliminar-vinculo-real", async (event, { perfilId, gestoId }) => {
  return new Promise((resolve) => {
    const sql = `DELETE FROM Perfil_Gesto_Accion WHERE id_perfil = ? AND id_gesto = ?`;
    db.query(sql, [perfilId, gestoId], (err, result) => {
      resolve({ success: !err });
    });
  });
});

// Para obtener los vínculos de sonido del perfil actual
ipcMain.handle("obtener-vinculos-sonido-dashboard", async (event, perfilId) => {
  return new Promise((resolve) => {
    const sql = `
      SELECT psa.id_perfil, psa.id_sonido, psa.id_accion, 
             s.descripcion, s.nombre_sonido, a.nombre_accion
      FROM Perfil_Sonido_Accion psa
      JOIN Sonido s ON psa.id_sonido = s.id_sonido
      JOIN Accion a ON psa.id_accion = a.id_accion
      WHERE psa.id_perfil = ?`;
    
    db.query(sql, [perfilId], (err, rows) => {
      if (err) resolve([]);
      else resolve(rows);
    });
  });
});

// Actualizar el vínculo de sonido (cambiar la acción de una frase)
ipcMain.handle("actualizar-vinculo-sonido-real", async (event, { perfilId, sonidoId, accionId }) => {
  return new Promise((resolve) => {
    // Usamos UPDATE para modificar la fila existente en lugar de crear una nueva
    const sql = `UPDATE perfil_sonido_accion SET id_accion = ? WHERE id_perfil = ? AND id_sonido = ?`;
    
    db.query(sql, [accionId, perfilId, sonidoId], (err, result) => {
      if (err) {
        console.error("Error en SQL:", err);
        resolve({ success: false });
      } else {
        resolve({ success: true });
      }
    });
  });
});

// Para eliminar un vínculo de sonido
ipcMain.handle("eliminar-vinculo-sonido-real", async (event, { perfilId, sonidoId }) => {
  return new Promise((resolve) => {
    const sql = `DELETE FROM Perfil_Sonido_Accion WHERE id_perfil = ? AND id_sonido = ?`;
    db.query(sql, [perfilId, sonidoId], (err) => {
      resolve({ success: !err });
    });
  });
});


ipcMain.handle('contar-todo-perfil', async (event, id_usuario) => {
  return new Promise((resolve) => {
    // Contamos gestos y sonidos vinculados a este perfil
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM Gesto WHERE id_usuario = ?) as totalGestos,
        (SELECT COUNT(*) FROM Sonido WHERE id_usuario = ?) as totalSonidos
    `;
    db.query(sql, [id_usuario, id_usuario], (err, results) => {
      if (err) resolve({ totalGestos: 0, totalSonidos: 0 });
      else resolve(results[0]);
    });
  });
});