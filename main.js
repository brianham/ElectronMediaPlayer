const {electron, app, ipcMain, BrowserWindow} = require('electron');
const config = require('config');
const path = require('path');
const url = require('url');
const io = require("socket.io-client");
const socket = new io(`http://localhost:${4001}`);
const log = require('./app/js/logger').default;

let mainWindow = null;

app.on('ready', initialize);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') { app.quit(); }
})

app.on('activate', function () {
  if (mainWindow === null) { initialize(); }
})

socket.on('connect', () => {   
  log.info(`Electron client connection made`);   
});

socket.on('message', (payload) => {
  
  switch (payload.method) {
    case 'play':
    {
      mainWindow.webContents.send('message', payload.arg);
      break;
    }
    case 'queueNext':
    {
      break;
    }
    default: {

    }
  }
});

ipcMain.on('async', (event, arg) => {  
  socket.emit('message', arg);
});

function initialize() {
  createWindow();
}

function createWindow() {
    try {

        // Get current view config 
        let currentView = config.get('views').filter((item) => {
          return (item.name === config.get('currentView'));
        })[0];

        log.info(`Creating electron view: ${currentView.name}, width: ${currentView.windowWidth}, height: ${currentView.windowHeight}`);

        // Initialize Browser window (render thread)
        mainWindow = new BrowserWindow({ width: currentView.windowWidth, height: currentView.windowHeight, frame: false, fullscreenable: false, backgroundColor: '#000' });
        mainWindow.setSize(currentView.windowWidth, currentView.windowHeight);
        mainWindow.setPosition(currentView.positionX, currentView.positionY);
        mainWindow.setMovable(false);
        mainWindow.setResizable(false);
        mainWindow.setAlwaysOnTop(currentView.isAlwaysOnTop);
        mainWindow.loadURL(`file://${__dirname}/app/html/${currentView.name}.html`);

        if (currentView.hideCursor == true) {
            mainWindow.webContents.insertCSS('*{cursor: none !important;}');
            mainWindow.webContents.executeJavaScript('document.documentElement.style.cursor = "none"; var allElements = document.getElementsByTagName("*"); for(var i=0;i<allElements.length;i++){ allElements[i].style.cursor = "none";  }');
        }

        mainWindow.on('closed', () => { mainWindow = null; });

        // Allow debugging - turn off in production
        mainWindow.openDevTools();

    } catch (error) {
        log.error(error);
    }
}


//const PlaybackManager = require('./app/js/playbackManager.js');

// const playbackManager = new PlaybackManager();

// playbackManager.on('message', (arg) => {
//   console.log(`playback manager event: ${arg}`);
// });