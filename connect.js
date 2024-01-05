var puzName;
var groups
var groupNames;
var queryParams = new URLSearchParams(window.location.search);
puzName = queryParams.get('data');
document.title=puzName
read("/Puzzles/"+puzName)
  .then(function(data) {
    groups = []
    groups.push(data[0])
    groups.push(data[1])
    groups.push(data[2])
    groups.push(data[3])
    groupNames=data[4]
    initialize()
  })
  .catch(function(error) {
    console.error("Error:", error);
  });

var clicked;
var numGroups
var activeWords
var numWrong
var liveCounter
var table
var buttons
var catTable
var guesses=[]
  function initialize(){
    console.log(groups)
    console.log(groupNames)
    activeWords= [].concat(...groups);

    clicked = []
    numGroups=0
    numWrong=0
    liveCounter= document.getElementById("lives")

    table = document.getElementById('board');
    catTable = document.getElementById('cats')
    table.addEventListener('click', handleBoardClick);
    activeWords=shuffleArray(activeWords)
    buttons = table.getElementsByTagName('button');
    for (let i = 0; i < buttons.length-numGroups*4; i++) {
        let rowIndex = Math.floor(i / 4); // Calculate the row index for each button
        buttons[i+(4*numGroups)].textContent = activeWords[rowIndex * 4 + i % 4]; // Set textContent based on array index
    }

  }



// Function to handle button clicks
function handleBoardClick(event) {
    if (event.target.tagName === 'BUTTON') {
        // Get the ID or text of the clicked button
        let buttonId = event.target.id;
        var but = document.getElementById(buttonId);

        if (clicked.indexOf(buttonId)==-1){
            if(clicked.length==4){
                return;
            }
            clicked.push(buttonId)

            // Change the background color of the button
            but.style.backgroundColor = '#808080'; 
        }
        else{
            but.style.backgroundColor= '#DCDCDC'
            clicked.splice(clicked.indexOf(buttonId),1)
        }
        // Perform actions based on the button clicked
        // You can add specific actions based on the button clicked
    }
}

function submit(){
    var numEach=[0,0,0,0]
    if (clicked.length!=4){
        printError("Not Enough Words Selected")
        return;
    }
    var entries=[]
    for (var i=0; i<4; i++){
        entries.push(document.getElementById(clicked[i]).textContent)
        for (var j=0; j<4;j++){
            if (groups[i].indexOf(document.getElementById(clicked[j]).textContent)!=-1){
                numEach[i]=numEach[i]+1
            }
        }
    }
    guesses.push(entries)
    let string
    let container = document.getElementById('guessList');
    let label =document.createElement('label')
    var i=guesses.length-1
    string = "Guess "+(i+1)+": "+guesses[i][0]+", "+guesses[i][1]+", "+guesses[i][2]+", "+guesses[i][3]+";"
    label.innerHTML=string
    container.appendChild(label)
    let lineBreak = document.createElement('br');
    container.appendChild(lineBreak)
    var max = Math.max(...numEach)
    if (max<3){
        printError("Incorrect group")
        numWrong++
        liveCounter.innerHTML="Errors: "+numWrong
    }
    if (max==3){
        printError("One Away")
        numWrong++
        liveCounter.innerHTML="Errors: "+numWrong
        }
    if (max==4){
        for (var i=0; i<4; i++){
            activeWords.splice(activeWords.indexOf(document.getElementById(clicked[i]).textContent),1)
        }
        numGroups++
        makeBoard(numEach,label)
        clicked=[]
        if (numGroups==4){
            openPopup()
        }
    }
    

}
function printError(message){
    var errorMessage = document.getElementById('error-message');
  errorMessage.innerText = message;
  errorMessage.style.display = 'block';

  setTimeout(function() {
    errorMessage.style.display = 'none';
  }, 3000); // Display for 3 seconds (3000 milliseconds)
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Generate random index
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}


function makeBoard(numEach,label){
    let buttons = table.getElementsByTagName('button');
    words=[]
    for (var i=0; i<4;i++){
        words.push(document.getElementById(clicked[i]).textContent)
    }
    
    for (var i=0; i<4; i++){
        buttons[4*(numGroups-1)+i].textContent=words[i]
        let cols = catTable.getElementsByTagName('td');
        if (numEach[0]==4){
            buttons[4*(numGroups-1)+i].style.backgroundColor='#FDDA0D';
            cols[numGroups-1].style.backgroundColor='#FDDA0D'
            cols[numGroups-1].innerHTML=groupNames[0]
            label.style.color='#FDDA0D'
        }
        if (numEach[1]==4){
            buttons[4*(numGroups-1)+i].style.backgroundColor='#50C878';
            cols[numGroups-1].style.backgroundColor='#50C878'
            cols[numGroups-1].innerHTML=groupNames[1]
            label.style.color='#50C878'
        }
        if (numEach[2]==4){
            buttons[4*(numGroups-1)+i].style.backgroundColor='#6495ED';
            cols[numGroups-1].style.backgroundColor='#6495ED'
            cols[numGroups-1].innerHTML=groupNames[2]
            label.style.color='#6495ED'
        }
        if (numEach[3]==4){
            buttons[4*(numGroups-1)+i].style.backgroundColor='#BF40BF';
            cols[numGroups-1].style.backgroundColor='#BF40BF'
            cols[numGroups-1].innerHTML=groupNames[3]
            label.style.color='#BF40BF'
        }
    }

    for (let i = 0; i < buttons.length-4*numGroups; i++) {
        let rowIndex = Math.floor(i / 4); // Calculate the row index for each button
        buttons[i+4*numGroups].textContent = activeWords[rowIndex * 4 + i % 4];
        buttons[i+4*numGroups].style.backgroundColor= '#DCDCDC'
    }
}

function openPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("guessDisplay").innerHTML="Wrong Guesses: "+numWrong
  }
  
  function closePopup() {
    document.getElementById("popup").style.display = "none";
  }