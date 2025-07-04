const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

let backendProcess;

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, "../my-project/dist/index.html"));
}

function checkBackendReady(callback) {
  const maxRetries = 10;
  let attempts = 0;

  const interval = setInterval(() => {
    http.get("http://localhost:5000", (res) => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        clearInterval(interval);
        callback();
      }
    }).on("error", () => {
      attempts++;
      if (attempts >= maxRetries) {
        clearInterval(interval);
        console.error("Backend not responding on port 5000.");
      }
    });
  }, 1000);
}

app.whenReady().then(() => {
  const nodePath = isDev
    ? process.execPath
    : path.join(process.resourcesPath, "node.exe");

  const backendPath = isDev
    ? path.join(__dirname, "../backend/index.js")
    : path.join(process.resourcesPath, "backend/index.js");

  backendProcess = spawn(nodePath, [backendPath], {
    env: process.env,
    stdio: "inherit",
  });

  backendProcess.on("error", (err) => {
    console.error("Failed to start backend process:", err);
  });

  backendProcess.on("exit", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  checkBackendReady(createWindow);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
