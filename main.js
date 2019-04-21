// Modules to control application life and create native browser window
const electron = require('electron');
const {app, Tray, Menu, powerSaveBlocker, BrowserWindow} = require('electron');
const path = require('path');
const join = require('path').join;
let appIcon;
let win;
const disabledIconPath = path.join(__dirname, 'images', 'night-19.png');
const appSuspensionIconPath = path.join(__dirname, 'images', 'sunset-19.png');
const displaySleepIconPath = path.join(__dirname, 'images', 'day-19.png');

app.once('window-all-closed',function() { app.quit(); });

app.on('ready', function(){
  
  let w = new BrowserWindow();
    w.once('closed', function() { w = null; });
    w.loadURL('file://' + join(__dirname, 'index.html'));
    if (process.env.ELECTRON_IN_PAGE_SEARCH_DEBUG) {
        w.webContents.openDevTools({mode: 'detach'});
    }
  
  
  
  
  win = new BrowserWindow({show: false});
  appIcon = new Tray(disabledIconPath);
  let blocker_id = null;
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Prevent app suspension',
      type: 'radio',
      icon: appSuspensionIconPath,
      click: function() {
        if (blocker_id)
          powerSaveBlocker.stop(blocker_id);
        blocker_id = powerSaveBlocker.start('prevent-app-suspension');
      }
    },
    {
      label: 'Prevent display sleep',
      type: 'radio',
      icon: displaySleepIconPath,
      click: function() {
        if (blocker_id)
          powerSaveBlocker.stop(blocker_id);
        blocker_id = powerSaveBlocker.start('prevent-display-sleep');
      }
    },
    {
      label: 'Disable',
      type: 'radio',
      icon: disabledIconPath,
      checked: true,
      click: function() {
        if (blocker_id)
          powerSaveBlocker.stop(blocker_id);
      }
    },
    { label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
    }
  ]);
  appIcon.setToolTip('Keep system awake');
  appIcon.setContextMenu(contextMenu);
});




// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
