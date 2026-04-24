const fs = require("fs");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const MODEL_URL = "https://github.com/sergioLopez04/FreeControl/releases/download/Whisper/ggml-tiny.bin";
const RELEASE_URL = "https://github.com/sergioLopez04/FreeControl/releases/download/Whisper/release.zip";

const MODEL_PATH = path.join(__dirname, "ggml-tiny.bin");
const RELEASE_ZIP = path.join(__dirname, "release.zip");
const RELEASE_FOLDER = path.join(__dirname, "release");
const EXE_PATH = path.join(RELEASE_FOLDER, "whisper-cli.exe");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      res.pipe(file);
      file.on("finish", () => {
        file.close(resolve);
      });
    }).on("error", reject);
  });
}

function unzip(zipPath, dest) {
  return new Promise((resolve, reject) => {
    exec(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${dest}'"`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function setup() {
  // Modelo
  if (!fs.existsSync(MODEL_PATH)) {
    console.log("Descargando modelo...");
    await download(MODEL_URL, MODEL_PATH);
    console.log("Modelo listo");
  }

  // Release
  if (!fs.existsSync(EXE_PATH)) {
    console.log("Descargando release...");
    await download(RELEASE_URL, RELEASE_ZIP);

    console.log("Descomprimiendo...");
    await unzip(RELEASE_ZIP, __dirname);

    fs.unlinkSync(RELEASE_ZIP);
    console.log("Release lista");
  }
}

setup();