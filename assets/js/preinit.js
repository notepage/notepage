ipcRenderer.send("getFiles", ""); // TODO: define needed arguments for file grabber to use
ipcRenderer.send("checkLibs", ""); // Reply from main proccess with files

// Checks down on reply the main proccess sends
ipcRenderer.on("fileLookUpReply", (event, args) => {
    // Loops all Locations for files to read and Display
    /* args = [{ name: "", path: "" }]*/
    //loaddata(name, path)
    console.log(args);

    args.forEach(item => {
        let data = JSON.parse(fs.readFileSync(item.path, null, 4));
        let textnode = document.createTextNode(item.name);
        let node = document.createElement("LI");

        node.setAttribute("onclick",`loadData('${item.name}','${item.path}')`);
        node.classList.add ("note");
        node.appendChild(textnode);
        node.dataset.id = i;

        document.getElementById("note-list").appendChild(node);
    });
}); // TODO: implement needed values to main proccess