const fs = require("fs");

module.exports = {
    'lookup': (files) => {
        // Loops all Locations for files to read and Display
        files.forEach(e => {
            fs.readdir(`${e}/files`, function(err, items) { 
                console.log(items);
                for (var i=0; i<items.length; i++) {
                    
                    let data = JSON.parse(fs.readFileSync(`${e}/files/${items[i]}`, null, 4));
                    let name = items[i];
                    let name_only = items[i].substring(0,name.length - 6);
                    let textnode = document.createTextNode(data['name']);
                    let node = document.createElement("LI");

                    node.setAttribute("onclick",`loadData('${e}/files/${items[i]}','${e}','${name_only}')`);
                    node.classList.add ("note");
                    node.appendChild(textnode);
                    node.dataset.id = i;

                    document.getElementById("note-list").appendChild(node);
                }
            });       
        });   
    },
    'load': (name,path,strName) => {
        let data = JSON.parse(fs.readFileSync(`${name}`, null, 4));
        let title = document.getElementById('title');
        let nameInput = document.getElementById('name');
        let editor = document.querySelector(".editor");

        ipcRenderer.send('opened',data.name);
        editor.innerHTML = data['content'];
        nameInput.value = data['name'];
        
        existing = true;
        
        document.getElementById('rm').setAttribute("onclick",`remove('${name}','')`);
        document.getElementById('btnStore').setAttribute("onclick",`save('true','${strName}','${saveLocation}')`);

        //Sending to discord Richpresence
        ipcRenderer.send('checkForUpdate',`true`);
        saveLocation = settings.files[settings.locationToUse];
    },
    'save': (name, location) => {
        /**
         * TODO: 
         * check for existence
         * create or store file
         */
    },
    'base64_encode': (file) => {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }
}