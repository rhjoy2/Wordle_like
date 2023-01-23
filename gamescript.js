import { WORDS } 
from "./validwords.js";

const GUESSES_LEFT = 6;
let guessesRemaining = GUESSES_LEFT;
let currentATTEMPT = [];
let followingLetter = 0;
let correctString = WORDS[Math.floor(Math.random() * WORDS.length)]
//Math.floor returns largest integer <= to the number

console.log(correctString)
//initialise the board
function initialisation(){
    let matrix = document.getElementById("wordle-matrix");
    for (let i=0; i<GUESSES_LEFT;i++){
        let row = document.createElement("div")
        row.className = "letter-row"
        for (let j = 0; j<5; j++){
            let box = document.createElement("div")
            box.className = "free-space"
            row.appendChild(box)
        }
        matrix.appendChild(row)
    }
}
document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let usedKey = String(e.key)
    if (usedKey === "Backspace" && followingLetter !== 0) {
        deleteLetter()
        return
    }

    if (usedKey === "Enter") {
        wordCheck()
        return
    }

    let found = usedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(usedKey)
    }
})
document.getElementById("k_cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("k_b")) {
        return
    }
    let key = target.textContent

    if (key === "Delete") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})
function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("k_b")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}
function insertLetter (usedKey) {
    if (followingLetter === 5) {
        return
    }
    usedKey = usedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[followingLetter]
    box.textContent = usedKey
    box.classList.add("filled-space")
    currentATTEMPT.push(usedKey)
    followingLetter += 1
}
function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[followingLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-space")
    currentATTEMPT.pop()
    followingLetter -= 1
}
function wordCheck () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(correctString)

    for (const val of currentATTEMPT) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Input more letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Invalid word!")
        return
    }

    
    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentATTEMPT[i]
        
        let letterPosition = rightGuess.indexOf(currentATTEMPT[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            if (currentATTEMPT[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'green'
            } else {
                // shade box yellow
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //shade box
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if (guessString === correctString) {
        toastr.success("Congratulations! Correct guess!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentATTEMPT = [];
        followingLetter = 0;

        if (guessesRemaining === 0) {
            toastr.info(`Today's word is : "${correctString}"`)
        }
    }
}
$( ".switchmode" ).on("click", function() {
    if( $( "body" ).hasClass( "darkmode" )) {
        $( "body" ).removeClass( "darkmode" );
        $( ".switchmode" ).text( "OFF" );
    } else {
        $( "body" ).addClass( "darkmode" );
        $( ".switchmode" ).text( "ON" );
    }
});

initialisation();