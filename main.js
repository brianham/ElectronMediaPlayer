const {electron, app, ipcMain, BrowserWindow} = require('electron');
const config = require('config').get('clientWindow');
const path = require('path');
const url = require('url');
const io = require("socket.io-client");
const socket = new io(`http://localhost:${4001}`);
//const PlaybackManager = require('./app/js/playbackManager.js');

let mainWindow = null;
// const playbackManager = new PlaybackManager();

// playbackManager.on('message', (arg) => {
//   console.log(`playback manager event: ${arg}`);
// });

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
  console.log(`client: connection made`);
});

socket.on('message', (payload) => {
  console.log(`client: message received`);
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
  //playbackManager.play();
}

function createWindow() {
    try {
        mainWindow = new BrowserWindow({ width: config.windowWidth, height: config.windowHeight, frame: false, fullscreenable: false, backgroundColor: '#000' });
        mainWindow.setSize(config.windowWidth, config.windowHeight);
        mainWindow.setPosition(config.positionX, config.positionY);
        mainWindow.setMovable(false);
        mainWindow.setResizable(false);
        mainWindow.setAlwaysOnTop(config.isAlwaysOnTop);
        mainWindow.loadURL('file://' + __dirname + '/app/html/cuppingRoomDoors.html');

        if (config.hideCursor == true) {
            mainWindow.webContents.insertCSS('*{cursor: none !important;}');
            mainWindow.webContents.executeJavaScript('document.documentElement.style.cursor = "none"; var allElements = document.getElementsByTagName("*"); for(var i=0;i<allElements.length;i++){ allElements[i].style.cursor = "none";  }');
        }

        mainWindow.on('closed', () => { mainWindow = null; });

        mainWindow.openDevTools();

    } catch (error) {
        console.log(error);
    }
}
