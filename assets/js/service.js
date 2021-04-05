const { ipcRenderer } = require('electron');

// on view init ask main proccess to lookup files
ipcRenderer.send("getFiles",""); // TODO: define needed arguments for file grabber to use
ipcRenderer.send("checkLibs", "");
// Reply from main proccess with files
ipcRenderer.on("fileLookUpReply", (event, files) => {
    // Assign list items to file explorer
}); // TODO: implement needed values to main proccess