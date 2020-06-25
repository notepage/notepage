const {ipcRenderer,remote, clipboard} = require('electron');
const BrowserWindow = require('electron').remote.BrowserWindow;
const shortkey = require('hotkeys-js');
const fs = require('fs');
const dir = require('../../utils/path');

const package = require('../../package.json');
const projName = package.name;

let OSname = require("os").userInfo().username;

//Button Definition
const closeButton = document.getElementById('closeDown');
const maxButton = document.getElementById('maximize');
const minButton = document.getElementById('minimize');
const btnStore = document.getElementById('btnStore');
const NewFile = document.getElementById('new');

//wisywyg
var editorContent = document.querySelector(".editor");

//Button Event Handler
closeButton.addEventListener('click', function(){
    window.close(); 
    app.quit();
});

minButton.addEventListener('click', function(){ 
    remote.BrowserWindow.getFocusedWindow().minimize(); 
});

maxButton.addEventListener('click', function(){
    if (remote.getCurrentWindow().isFullScreen()) { 
        remote.getCurrentWindow().setFullScreen(false); 
    }else{ 
        remote.getCurrentWindow().setFullScreen(true);  
    } 
});

btnStore.addEventListener('click',function(){save();});
NewFile.addEventListener('click', () => {
    ipcRenderer.send('opened',"");
    location.reload();
    console.log("Site reloaded");
});
//settings.addEventListener('click',function(){alert("Settings");});