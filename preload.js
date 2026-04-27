const { contextBridge, ipcRenderer } = require("electron");

// Expone funciones seguras al mundo de la ventana renderer
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});