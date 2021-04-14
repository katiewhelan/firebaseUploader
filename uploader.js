var admin = require("firebase-admin");

var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

fs.readdir(directoryPath, function(err, files) {
  if(err){
    return console.log("Could not scan directory " + err);
  }

  files.forEach(function(file) {
    var lastDotIndex = file.lastIndexOf(".");

    var menu = require("./files/" + file);

    menu.forEach(function(obj) {
      firestore
      .collection(file.substring(0,lastDotIndex))
      .doc(obj.objectId)
      .set(obj)
      .then(function(docRef){
        console.log("Document written ID: ", docRef.id);
      })
      .catch(function(error){
        console.error("Errror adding document: ", error);
      });
    });
  });
});
