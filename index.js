const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
    {name: "bee", Image: "bee.png"}, 
    {name:"crocodile", Image:"crocodile.jpg"},
    {name:"macaw", Image:"macaw.png"},
    {name:"gorilla", Image:"gorilla.png"},
    {name:"tiger", Image:"tiger.png"},
    {name:"monkey", Image:"monkey.png"},
    {name:"chameleon", Image:"chameleon.jpg"},
    {name:"piranha", Image:"piranha.png"},
    {name:"anaconda", Image:"anaconda.png"},
    {name:"sloth", Image:"sloth.png"},
    {name:"cockatoo", Image:"cockatoo.png"},
    {name:"toucan", Image:"toucan.png"},
];

//Initial Time
let seconds =0,
    minutes = 0;   
//Initial moves and win count
let movesCount = 0,
    winCount = 0;

//For timer
const timeGenerator = () => {
    seconds += 1;
    //minutes logic
    if(seconds>=60){
        minutes += 1;
        seconds = 0;
    }

//format time before displaying
let secondsValue = seconds < 10 ? `0${seconds}`: seconds;
let minutesValue = minutes < 10 ? `0${minutes}`: minutes;
timeValue.innerHTML = `<span>Time:</span>${minutesValue}: ${secondsValue}`;
};

//For calculating moves
const movesGenerator = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};
//Pick random objects from the items array
const generateRandom = (size = 4) => {
    //temporary array 
    let tempArray = [...items];
    //initializes cardValues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //Random object selection 
    for(let i = 0; i < size; i++){
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues,...cardValues];
    //simple shuffle
    cardValues.sort(() => Math.random() -0.5);
    for(let i=0; i<size*size;i++){
        /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actaul image);
        data-card-values is a custom attribute which stores 
        the names of the cards to match later
        */
       gameContainer.innerHTML +=`
       <div class="card-container" data-card-value="${cardValues[i].name}">
       <div class="card-before">?</div>
       <div class="card-after">
       <img src="${cardValues[i].Image}" class="image" alt=""></div>
       </div>
       ` ;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => { 
        card.addEventListener("click", () => {
        //If selected card is not matched yet then only run (i.e already matched card when clicked will be ignored) 
        if(!card.classList.contains("matched")){
            //flip the clicked card
            card.classList.add("flipped");
            //if it is the firstcard (!firstCard since firstCard is initially false)
            if(!firstCard){
                //so current card will become firstCard
                firstCard = card;
                //current cars value becomes firstCardValue
                firstCardValue = card.getAttribute("data-card-value");
            }
            else{
                //increment move since selected second card
                movesGenerator();
                //secondCard and value 
                secondCard = card;
                let secondCardValue = card.getAttribute("data-card-value");
                if(firstCardValue == secondCardValue){
                    //if  both cards match add matched class so these cards would be ignored next time
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    //set firstCard to false since next card would be first now
                    firstCard = false;
                    //winCount increment as user found a correction match
                    winCount += 1;
                    //check if winCount == half of cardValues 
                    if(winCount == Math.floor(cardValues.length / 2)){
                        result.innerHTML = `<h2>You Won </h2>
                        <h4>Moves: ${movesCount}</h4>`;
                        stopGame();
                     }
                }
                else{
                    //if the cards dont match
                    //flip the cards back to normal 
                    let [tempFirst, tempSecond] = [firstCard, secondCard];
                    firstCard = false;
                    secondCard = false;
                    setTimeout(() => {
                        tempFirst.classList.remove("flipped");
                        tempSecond.classList.remove("flipped");
                    }, 900);
                }
            }
        }
        
    });
    });
};

//start game
startButton.addEventListener("click", () => {
    movesCount = 0;
    time=0;
    //controls and button visiblity
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
});

//Stop game
stopButton.addEventListener("click", (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
})
);

//Initialize value and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    movesCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);

};



