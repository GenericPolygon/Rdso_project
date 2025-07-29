const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

let backendProcess;
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: true,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const indexPath = isDev
    ? path.join(__dirname, "../my-project/dist/index.html")
    : path.join(app.getAppPath(), "my-project/dist/index.html");

  if (fs.existsSync(indexPath)) {
    win.loadFile(indexPath);
  } else {
    win.loadURL(`data:text/html,<h1>Error: index.html not found</h1><p>Attempted path: ${indexPath}</p>`);
  }
}

function checkBackendReady(callback) {
  const maxRetries = 15;
  let attempts = 0;

  const interval = setInterval(() => {
    http.get("http://localhost:5000", (res) => {
      if ([200, 404].includes(res.statusCode)) {
        clearInterval(interval);
        callback();
      }
    }).on("error", () => {
      attempts++;
      if (attempts >= maxRetries) {
        clearInterval(interval);
        callback();
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
    : path.join(app.getAppPath(), "backend", "index.js");

  const dbPath = isDev
    ? path.join(__dirname, "../railway_reg.db")
    : path.join(process.resourcesPath, "railway_reg.db");

  if (fs.existsSync(nodePath) && fs.existsSync(backendPath)) {
    backendProcess = spawn(nodePath, [backendPath], {
      env: {
        ...process.env,
        NODE_ENV: "production",
        DB_PATH: dbPath,
      },
      stdio: ["pipe", "pipe", "pipe"],
    });


    checkBackendReady(createWindow);
  } else {
    createWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
