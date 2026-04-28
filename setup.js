const fs = require("fs");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

// URLs
const MODEL_URL =
  "https://github.com/sergioLopez04/FreeControl/releases/download/Whisper/ggml-tiny.bin";
const RELEASE_URL =
  "https://github.com/sergioLopez04/FreeControl/releases/download/Whisper/release.zip";
const NODE_MODULES_URL =
  "https://github.com/sergioLopez04/FreeControl/releases/download/Whisper/node_modules.zip";

// Rutas
const MODEL_PATH = path.join(__dirname, "ggml-tiny.bin");
const RELEASE_ZIP = path.join(__dirname, "release.zip");
const RELEASE_FOLDER = path.join(__dirname, "release");
const NODE_MODULES_ZIP = path.join(__dirname, "node_modules.zip");
const NODE_MODULES_FOLDER = path.join(__dirname, "node_modules");

// -------------------------
// DESCARGA ROBUSTA
// -------------------------
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    const request = (url) => {
      https
        .get(url, (res) => {
          
          if (res.statusCode === 301 || res.statusCode === 302) {
            return request(res.headers.location);
          }

          if (res.statusCode !== 200) {
            reject(new Error("Download failed: " + res.statusCode));
            return;
          }

          res.pipe(file);

          file.on("finish", () => {
            file.close(resolve);
          });
        })
        .on("error", reject);
    };

    request(url);
  });
}

// -------------------------
// UNZIP
// -------------------------
function unzip(zipPath, dest) {
  return new Promise((resolve, reject) => {
    exec(
      `powershell -command "Expand-Archive -Force -Path '${zipPath}' -DestinationPath '${dest}'"`,
      (err) => {
        if (err) return reject(err);
        resolve();
      },
    );
  });
}

// -------------------------
// SETUP PRINCIPAL
// -------------------------
async function setup() {
  try {
    // =====================
    // 1. MODELO
    // =====================
    if (!fs.existsSync(MODEL_PATH)) {
      console.log("Descargando modelo...");
      await download(MODEL_URL, MODEL_PATH);
      console.log("Modelo listo");
    }

    // =====================
    // 2. RELEASE
    // =====================
    if (!fs.existsSync(RELEASE_FOLDER)) {
      console.log("Descargando release...");
      await download(RELEASE_URL, RELEASE_ZIP);

      console.log("Descomprimiendo release...");
      await unzip(RELEASE_ZIP, __dirname);

      fs.unlinkSync(RELEASE_ZIP);
      console.log("Release lista");
    }

    // =====================
    // 3. NODE_MODULES
    // =====================
    if (!fs.existsSync(NODE_MODULES_FOLDER)) {
      console.log("Descargando node_modules...");
      await download(NODE_MODULES_URL, NODE_MODULES_ZIP);

      console.log("Descomprimiendo node_modules...");
      await unzip(NODE_MODULES_ZIP, __dirname);

      fs.unlinkSync(NODE_MODULES_ZIP);
      console.log("node_modules listo");
    }

    console.log("SETUP COMPLETO");
  } catch (err) {
    console.error("Error en setup:", err);
  }
}

setup();
