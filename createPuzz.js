const firebaseConfig = {
    apiKey: "AIzaSyD6kyzeZ_YfUHhJ9r0gVZhG0Z2zr0zUuiE",
    authDomain: "customconnect-1481f.firebaseapp.com",
    databaseURL: "https://customconnect-1481f-default-rtdb.firebaseio.com",
    projectId: "customconnect-1481f",
    storageBucket: "customconnect-1481f.appspot.com",
    messagingSenderId: "1059211988812",
    appId: "1:1059211988812:web:85d64009d60cb9d0f249e9",
    measurementId: "G-R49EPKVP4J"
  };
  

  firebase.initializeApp(firebaseConfig);
var database = firebase.database();


function write(path,value){
    database.ref(path).set(value, function(error) {
        if (error) {
          console.error("Error updating count:", error);
        } else {
          console.log("Data updated successfully!");
        }
      });
}


function pathExists(path){
var exists=null
var dbRef = firebase.database().ref();
var nodeRef = dbRef.child(path); 

nodeRef.once("value")
.then(function(snapshot) {
if (snapshot.exists()) {
  console.log("Path exists")
} else {
  console.log("Path doesn't exist")
}
})
.catch(function(error) {
console.error("Error checking node existence:", error);
});
}

function read(path) {
return database.ref(path).once('value')
  .then(function(snapshot) {
    //console.log(snapshot.val());
    return snapshot.val();
  })
  .catch(function(error) {
    console.error("Error reading Data:", error);
  });
}

function removeNode(path){
database.ref(path).remove()
.then(() => {
console.log("Node deleted successfully!");
})
.catch((error) => {
console.error("Error deleting node:", error);
});
}


function submit(){
  let table = document.getElementById("table")
  let inputs = table.getElementsByTagName('input');
  var groups = [[],[],[],[]]
  var groupNames = []
  for (var i=0; i<4; i++){
    for (var j=0; j<5; j++){
      console.log((4*i+j)%5)
      if (j==0){
        groupNames.push(inputs[i*5+j].value)
        continue;
      }
      groups[i].push(inputs[i*5+j].value)
    }
  }
  groups.push(groupNames)
  console.log(groups)
if (document.getElementById("name").value==""){
    return
  }
  write("/Puzzles/"+document.getElementById("name").value,groups)
  write("/Puzzles/"+document.getElementById("name").value+'/Wins',0)
  write("/Puzzles/"+document.getElementById("name").value+'/Attempts',0)
  printError("Sucessfully Made Puzzle")
//setTimeout(returnHome,2000)
}

function returnHome(){
  window.location.href = 'index.html'
}

function printError(message){
  var errorMessage = document.getElementById('error-message');
errorMessage.innerText = message;
errorMessage.style.display = 'block';

setTimeout(function() {
  errorMessage.style.display = 'none';
}, 3000); // Display for 3 seconds (3000 milliseconds)
}
