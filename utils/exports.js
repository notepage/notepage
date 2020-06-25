module.exports = {
    'exportToPDF' : (storage,pdf,settings) => {
        var options = {"format":'Letter'};
    
        if(storage.innerHTML.length <= 0 )return alert("Empty exports aren't allowed!")
    
        if(fs.existsSync(`${settings.files[settings.locationToUse]}/exports`)){
            pdf.create(storage.innerHTML, options).toFile(settings.files[settings.locationToUse] + "/exports/" + document.getElementById('name').value + '.pdf', function(err, res) {
                if (err) return console.log(err);
                console.log(res); // { filename: '/app/businesscard.pdf' }
                alert("Your file has been exported as: '" + document.getElementById('name').value + '.pdf' + "' to your default storage location "+settings.files[settings.locationToUse] + "/exports/");
            });
        }else{
            fs.mkdirSync(`${settings.files[settings.locationToUse]}/exports`);
            pdf.create(storage.innerHTML, options).toFile(settings.files[settings.locationToUse] + "/exports/" + document.getElementById('name').value + '.pdf', function(err, res) {
                if (err) return console.log(err);
                console.log(res); // { filename: '/app/businesscard.pdf' }
            });
        }
    },
    'save': (existing, editorContent, name, saveLocation) => {
        //Storage
        // Checks if files is beeing newly created
        if(existing == "true"){
            console.log("existing")
            if(fs.existsSync(`${saveLocation}`)){   
                fs.writeFileSync(`${saveLocation}`,JSON.stringify({name:name, content:storage}));
            }
        }else if(existing != "true" && saveLocation == ""){
                console.log("new file")
            if(editorContent.innerHTML .length <= 0) return alert("You cannot store empty files");
                if(fs.existsSync(`${settings.files[settings.locationToUse]}/files`)){
                    if(fs.existsSync(`${settings.files[settings.locationToUse]}/files/${name}.npage`)){   
                        fs.writeFileSync(`${settings.files[settings.locationToUse]}/files/${name}.npage`,JSON.stringify({name:name, content:storage}));
                    }else{
                        fs.writeFileSync(`${settings.files[settings.locationToUse]}/files/${name}.npage`,JSON.stringify({name:name, content:storage}));
                        //document.location.reload();
                    }
                }else{
                    fs.mkdirSync(`${settings.files[settings.locationToUse]}/files`);
                }
            }
        }
}