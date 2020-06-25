// Modules to control application life and create native browser window
const {app, BrowserWindow,ipcMain, dialog} = require('electron');
//const client = require('discord-rich-presence')('583732487189037058');

const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
var ipc = require('ipc');

const fs = require('fs');
const OSname = require("os").userInfo().username;
const os = require("os");
const homedir = require('os').homedir();

const package = require('./package.json');
const projName = package.name;
const platform = process.platform;

const dir = require('./utils/path');

let path = dir.getHomepath(platform, projName, OSname, homedir);
let settings  = dir.getSettings(fs, path);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/**let file = "";

if(file == ""){
    client.updatePresence({
        details: `NP-DEV (DEV-CLIENT)`,
        largeImageKey: 'notepad-512',
        instance: true,
    });
}

ipcMain.on('opened', (event, args) => {
    console.log(args);
    if(args != ""){
        //Definition of Richpresence
        client.updatePresence({
            details: `Editing: ${args}`,
            largeImageKey: 'notepad-512',
            startTimestamp: Date.now(),
            endTimesttam: Date.now+1,
            instance: true,
        });
    }else{
        client.updatePresence({
            details: `idling`,
            largeImageKey: 'notepad-512',
            instance: true,
        });
    }
});*/

// Detects when .npage files ask application to open
ipcMain.on('get-file-data', function(event) {
    var data = null;
    var newData = null;
    if (process.platform == 'win32' && process.argv.length >= 2) {
        var openFilePath = process.argv[1];
        //data.path = process.argv[1];
        data = fs.readFileSync(openFilePath, 'utf-8');
        let parsed = JSON.parse(data);
        newData = {
            path: process.argv[1],
            name: parsed.name,
            content: parsed.content
        }
    }
    event.returnValue = newData;
    
});

function createWindow () {
    let mainWindow, splash = null;

    // Create the browser windows.
    mainWindow = new BrowserWindow({
        frame:false, 
        show:false, 
        width:1280, 
        height:720, 
        backgroundColor:"#46cfa8",
        allowRendererProcessReuse: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    splash = new BrowserWindow({
        frame:false, 
        show:false, 
        width:320, 
        height:400, 
        backgroundColor:"#4f7971", 
        allowRendererProcessReuse: true,
        resizable:false,
        alwaysOnTop:true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    splash.loadFile('assets/views/splash.html');
    mainWindow.loadFile('assets/views/app.html');

    let read;

    //Startet den ladescreen und danach das Mainframe
    splash.once('ready-to-show', () =>{
        //Startet er den LoadingScreen wenn er fertig geladen ist
        splash.show();
            //Schließt den splashscreen wenn der mainscreen online
            mainWindow.once('ready-to-show', () => {
                mainWindow.show();
            });
            //Default Startup
            dir.defaultVerify(path, fs, splash);
    });


    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    splash.on('closed', function () {
        splash = null;
    });    
}

/**
 * AUTOUPDATER
 * Uses github to Update The Software
 * Repo gets read from package.json
 */

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
log.info(__dirname);

function sendStatusToWindow(text) {
    log.info(text);
    ipcMain.on('message', function (event, text) {
        addItem(args); // we don't care process
        event.sender.send("message", text);
    })
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', () => {
    sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', () => {
    sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {

    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', () => {
    fs.writeFileSync(`C:/Users/${OSname}/Documents/${projName}/data/version.json`,JSON.stringify({read:"true"}));
    //mainWindow.webContents.send("Update-Found",'true')
    sendStatusToWindow('Update downloaded');
    
    // Patch Toggler
    autoUpdater.quitAndInstall();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () =>{
    console.log("enablePatch" + typeof(settings.enablePatch) + "value: " + settings.enablePatch);
    if(typeof(settings.enablePatch) === undefined){
        autoUpdater.checkForUpdates();
        console.log('run');
    }else{
        if(settings.enablePatch === true){
            autoUpdater.checkForUpdates();
            console.log('run');
        }
    }
    createWindow();
})

// Qui

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//Removes version.json after having read the Changelog
ipcMain.on("SetReadFalse",() =>{ fs.unlinkSync(`C:/Users/${OSname}/Documents/${projName}/data/version.json`); });