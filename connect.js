var puzName;
var groups
var groupNames;
var tot_wins
var tot_attempts
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
    tot_wins=data.Wins
    tot_attempts=data.Attempts

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
var guessString="My Results For "+puzName+"\n"
const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  function initialize(){
    activeWords= [].concat(...groups);

    clicked = []
    numGroups=0
    numWrong=0
    liveCounter= document.getElementById("lives")

    table = document.getElementById('board');
    //catTable = document.getElementById('cats')
    const game = document.getElementById('game');
    if (isPortrait){
        let submitButton = document.getElementById('submit');
        submitButton.onclick = null;
        submitButton.addEventListener('click', submit);
        table.addEventListener('click', handleBoardClick);
        const width = window.innerWidth;
        //game.style.width=width+'px'
        //game.style.height=width+'px'
    }
    else{
       // board.style.width='600px'
        //board.style.height='600px'
        table.addEventListener('click', handleBoardClick);
    }
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
            const computedStyle = window.getComputedStyle(but);
            const backgroundColor = computedStyle.backgroundColor;
            var color = rgbToHex(backgroundColor).toString()
            color=color.toUpperCase()
            if(color=='#FDDA0D' | color=='#50C878' | color=='#6495ED' | color=='#BF40BF'){
                return
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

function rgbToHex(rgb) {
    // Convert "rgb(80, 200, 120)" to ["80", "200", "120"]
    const values = rgb.match(/\d+/g);
    // Convert each value to hexadecimal and join them
    return `#${values.map(val => parseInt(val, 10).toString(16).padStart(2, '0')).join('')}`;
  }

  count=0
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
    var curGuess=""
    guesses.push(entries)
    displays = ["🟨","🟩","🟦","🟪"]
    for (var i=0; i<4; i++){
        for (var j=0; j< numEach[i]; j++){
            curGuess+=displays[i]
        }
    }
    guessString+=curGuess+"\n"
    let container = document.getElementById('guessList');
    let label =document.createElement('label')
    label.innerHTML=curGuess
    label.style.fontSize = '22px';
    label.style.textAlign = 'center';
    if (count==0){
        let label2=document.createElement('label')
        label2.style.fontSize = '22px';
        label2.innerHTML="Results for " +puzName
        container.appendChild(label2)
        container.appendChild(document.createElement('br'))
        count++
    }

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

function makeBoard(numEach, label) {
    activeWords=shuffleArray(activeWords)
    table = document.getElementById('board')
    colors=['#FDDA0D','#50C878','#6495ED','#BF40BF']
    cat = numEach.indexOf(4)
    const row = table.rows[numGroups-1]; // Get the first row of the table

    // Clear the first row
    while (row.firstChild) {
        row.removeChild(row.firstChild);
    }
    mergeDiv=document.createElement('div')
    mergeCell = document.createElement('td');

    mergeCell.colSpan = 4; // Merge all four columns
    mergeCell.style.textAlign = "center"; // Center the text

    mergeDiv.style.backgroundColor=colors[cat]
    let header = document.createElement("h1");
    let wordLabel = document.createElement('label')
    header.innerHTML=groupNames[cat]
    wordLabel.innerHTML=groups[cat][0]+", "+groups[cat][1]+", "+groups[cat][2]+", "+groups[cat][3]
    wordLabel.style.fontSize='18px'
    mergeDiv.appendChild(header)
    mergeDiv.appendChild(wordLabel)// Or use a specific container like document.getElementById('container')
    mergeCell.appendChild(mergeDiv)
    row.appendChild(mergeCell);
    mergeCell.style.height = '100%';
    mergeDiv.style.borderRadius='10px'
    mergeDiv.style.height = '100%';
    width=table.rows[3].cells[0].offsetWidth;
    if (numGroups==4 && !isPortrait){
        table.rows[0].cells[0].style.width=width*4+'px'
        table.rows[1].cells[0].style.width=width*4+'px'
        table.rows[2].cells[0].style.width=width*4+'px'
        table.rows[3].cells[0].style.width=width*4+'px'
    }
    // Append the new cell to the first row
    wordCount=0
    for (var i=0; i< activeWords.length/4; i++){
        rowindex=i+numGroups
        nextRow=table.rows[rowindex]
        for (var j=0; j<4; j++){
            cell = nextRow.cells[j]
            var button = cell.querySelector("button");
            button.textContent = activeWords[wordCount];
            wordCount++
            button.style.backgroundColor= '#DCDCDC'
        }

    }
}

function reOpenPopup() {
    document.getElementById("popup").style.display = "block";
}


function openPopup() {
    let submitButton = document.getElementById('submit');
    submitButton.innerHTML="View Results"
    submitButton.onclick = null;
    submitButton.addEventListener('click', reOpenPopup);

    document.getElementById("popup").style.display = "block";
    let container = document.getElementById('stats');
    tot_attempts+=numWrong
    tot_wins++
    // Create the button
    let button = document.createElement('button');
    button.innerHTML = 'Share Results';

    // Add a click event listener
    button.addEventListener('click', function() {
    // String to copy
    let stringToCopy = 'This is the string to copy!';
    
    // Use the Clipboard API
    navigator.clipboard.writeText(guessString)
    .then(() => {
        printError('Results Copied To Clipboard');
    })
        .catch(err => {
            printError("Failed to copy text: ");
        });
    });

// Add the button to the container
    container.appendChild(button);
    container.appendChild(document.createElement('br'))


    var avg = 1.0*tot_attempts/tot_wins
    write('/Puzzles/'+puzName+'/Attempts',tot_attempts)
    write('/Puzzles/'+puzName+'/Wins',tot_wins)
    let label1 = document.createElement('label')
    let label2 = document.createElement('label')
    let label3 = document.createElement('label')
    label1.innerHTML="Total Puzzle Wins: "+tot_wins
    label2.innerHTML="Average Puzzle Wrong Guesses: "+avg
    label3.innerHTML="Your Wrong Guesses: "+numWrong
    container.appendChild(label3)
    container.appendChild(document.createElement('br'))
    container.appendChild(label2)
    container.appendChild(document.createElement('br'))
    container.appendChild(label1)
  }
  
  function closePopup() {
    document.getElementById("popup").style.display = "none";
  }