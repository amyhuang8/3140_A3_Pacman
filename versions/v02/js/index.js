/*
Author: Amy Huang & Anoushka Jawale
Creation Date: May 28, 2024
Last Updated: June 6, 2024
Description: This JavaScript file contains functions for manipulating the index.html file.
*/

// VARIABLE DECLARATION: main positions and game stats
let positionPM;
let positionGhost;
let positionFruit;
let score;
let highScore = 0;
let level;
let pacmanDirection = "right";
let ghostDirection = "left";

let moveTimer = null; //timer for continuous Pacman movement
let ghostTimer = null; //timer for continuous ghost movement
let ghostSpeed; //interval in ms

// PROCESS: rendering initial empty board
const boardSize = 15;
let game = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
renderGame(game);
displayInstructions();

/**
 * This function starts the game by initiating the ghost movement interval and listening for player key events.
 */
function startGame() {

    // PROCESS: playing bgm
    document.getElementById("bgm").play();

    // PROCESS: starting the ghost movement interval
    ghostTimer = setInterval(moveGhost, ghostSpeed);

    // PROCESS: adding listener for keydown events (moving Pacman)
    document.addEventListener("keydown", handleKeyDown);
    moveRightContinuous(game); //start with auto-moving Pacman to the right

    // VARIABLE DECLARATION:
    const button = document.getElementById("begin-button");

    button.disabled = true; //disabling begin button
    button.style.cursor = "not-allowed"; //disabling cursor

}

/**
 * This function ends the game by stopping the ghost movement interval, stopping continuous movement, and removing key event listeners.
 */
function endGame() {

    // VARIABLE DECLARATION:
    const bgm = document.getElementById("bgm");

    bgm.pause(); //stopping bgm
    bgm.currentTime = 0; //resetting loop

    // PROCESS: checking for new high score
    if (score > highScore) {
        highScore = score; //updating high score
    }

    // VARIABLE DECLARATION:
    const button = document.getElementById("begin-button");

    button.disabled = false; //re-enabling begin button
    button.style.cursor = "pointer"; //resetting cursor

    clearInterval(ghostTimer); //clearing ghost movement interval
    clearInterval(moveTimer); //clearing continuous movement

    // PROCESS: removing keydown event listener
    document.removeEventListener("keydown", handleKeyDown);
    displayGameOver(); //calling modal

}

/**
 * This function displays the game over modal.
 */
function displayGameOver() {

    // VARIABLE DECLARATION:
    const modal = document.getElementById("gameOverModal");
    const gameOverSound = document.getElementById("sfx-game-over");
    const restartButton = document.getElementById("restart");

    modal.style.display = "block"; //displaying the modal
    gameOverSound.play(); //playing game over sfx

    restartButton.onclick = function() {
        modal.style.display = "none"; //hiding prompt
        resetGame(); //restarting game
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    } //hide modal if clicking outside of prompt

}

/**
 * This function displays the instructions modal.
 */
function displayInstructions() {

    // VARIABLE DECLARATION:
    const modal = document.getElementById("instructionsModal");

    modal.style.display = "block"; //displaying the modal

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    } //hide modal if clicking outside of prompt

}

/**
 * This function resets the game by re-initializing game variables and starting a new game.
 */
function resetGame() {

    // INITIALIZATION: resetting stats
    positionPM = 1;
    positionGhost = 10;
    score = 0;
    document.getElementById("high-score").innerHTML = "High Score: " + highScore; //updating high score text
    level = 1;
    document.getElementById("level").innerHTML = "Level: " + level; //updating level text
    pacmanDirection = "right";
    ghostDirection = "left";
    ghostSpeed = 300;
    game = createGame(boardSize);

    renderGame(game); //rendering board
    startGame(); //starting a new game

}

/**
 * This function implements the game board.
 *
 * @param n the size of the board
 * @returns {string[]} the makeshift game board
 */
function createGame(n) {

    // VARIABLE DECLARATION: creating an empty array for the game board
    const board = [];

    // PROCESS: generating starting position of fruit and ensuring fair distance from Pacman and ghost
    do {
        positionFruit = getRandomInt(0, n - 1);
    } while ((Math.abs(positionPM - positionFruit) < 5) || (positionFruit === positionGhost));

    board[positionPM] = "C";
    board[positionGhost] = "^.";
    board[positionFruit] = "@";

    // PROCESS: looping through remaining positions in board and adding pellets
    for (let i = 0; i < n; i++) {

        // PROCESS: checking whether position is already taken by Pacman, a ghost, or a fruit
        if (board[i] === undefined) { //not taken
            board[i] = "."; //adding pellet
        }

    }

    // OUTPUT:
    return board;

}

/**
 * This function renders the game board to the HTML.
 *
 * @param game an array with the current board positions
 */
function renderGame(game) {

    // VARIABLE DECLARATION:
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; //clearing previous board

    // PROCESS: updating each cell contents
    game.forEach(cell => {

        // VARIABLE DECLARATION:
        const cellDiv = document.createElement("div");
        cellDiv.className = "cell"; //updating style

        // PROCESS: checking which sprite to render
        if (cell === "C") {

            // PROCESS: creating image
            const pacmanImg = document.createElement("img");

            // PROCESS: checking for direction to choose correct sprite
            switch (pacmanDirection) {

                case "right" :
                    pacmanImg.src = "resources/sprites/pacman_right.png";
                    pacmanImg.alt = "Pacman facing right";
                    break;

                case "left" :
                    pacmanImg.src = "resources/sprites/pacman_left.png";
                    pacmanImg.alt = "Pacman facing left";
                    break;

                default :
                    break;

            }

            pacmanImg.className = "sprites";
            cellDiv.appendChild(pacmanImg);

        } else if (cell.includes("^")) { //ghost

            // PROCESS: creating image
            const ghostImg = document.createElement("img");

            // PROCESS: checking for direction to choose correct sprite
            switch (ghostDirection) {

                case "right" :
                    ghostImg.src = "resources/sprites/ghost_right.png";
                    ghostImg.alt = "Ghost facing right";
                    break;

                case "left" :
                    ghostImg.src = "resources/sprites/ghost_left.png";
                    ghostImg.alt = "Ghost facing left";
                    break;

                default :
                    break;

            }

            ghostImg.className = "sprites";
            cellDiv.appendChild(ghostImg);

        } else if (cell === "@") { //fruit

            // PROCESS: creating image
            const fruitImg = document.createElement("img");
            fruitImg.src = "resources/sprites/fruit.png";
            fruitImg.alt = "Fruit";

            fruitImg.className = "sprites";
            cellDiv.appendChild(fruitImg);

        } else if (cell === ".") {

            // PROCESS: creating image
            const pelletImg = document.createElement("img");
            pelletImg.src = "resources/sprites/pellet.png";
            pelletImg.alt = "Pellet";

            pelletImg.className = "sprites";
            cellDiv.appendChild(pelletImg);

        }

        gameContainer.appendChild(cellDiv);

    });

}

/**
 * This function shifts the Pacman char one position to the left.
 *
 * @param game an array with the current board positions
 */
function moveLeft(game) {

    game[positionPM] = ""; //clearing current cell

    // PROCESS: checking for Pacman's position
    if (positionPM !== 0) { //not already at left boundary

        processMove(game[positionPM - 1]); //processing score
        game[positionPM - 1] = "C"; //moving Pacman to the left
        positionPM -= 1; //updating index of Pacman

    } else { //move to right side

        processMove(game[game.length - 1]); //processing score
        game[game.length - 1] = "C"; //moving Pacman to the left
        positionPM = game.length - 1; //updating index of Pacman

    }

    renderGame(game); //render the updated game board

}

/**
 * This function shifts the Pacman char one position to the right.
 *
 * @param game an array of strings with the current board positions
 */
function moveRight(game) {

    game[positionPM] = ""; //clearing current cell

    // PROCESS: checking for Pacman's position
    if (positionPM !== game.length - 1) { //not already at right boundary

        processMove(game[positionPM + 1]); //processing score
        game[positionPM + 1] = "C"; //moving Pacman to the right
        positionPM += 1; //updating index of Pacman

    } else { //move to left side

        processMove(game[0]); //processing score
        game[0] = "C"; //moving Pacman to the right
        positionPM = 0; //updating index of Pacman

    }

    renderGame(game); //render the updated game board

}

/**
 * This function moves the Pacman char to the left.
 *
 * @param game an array with the current board positions
 */
function moveLeftContinuous(game) {

    clearInterval(moveTimer); //clearing previous timer

    moveTimer = setInterval(function() {
        moveLeft(game);
    }, 150); //setting speed for continuous movement

}

/**
 * This function move the Pacman char to the right.
 *
 * @param game an array with the current board positions
 */
function moveRightContinuous(game) {

    clearInterval(moveTimer); //clearing previous timer

    moveTimer = setInterval(function() {
        moveRight(game);
    }, 150); //setting speed for continuous movement

}

/**
 * This function processes the move and updates the score.
 *
 * @param cellContents the contents of the cell being moved to
 */
function processMove(cellContents) {

    // VARIABLE DECLARATION:
    let gameAdvance;

    // PROCESS: checking for the cell contents
    switch (cellContents) {

        case "." : //pellet
            score += 1; //updating score
            document.getElementById("score").innerHTML = "Score: " + score; //updating score text

            gameAdvance = (score === (boardSize * level)); //updating flag
            break;

        case "@" : //fruit
            score += 2; //updating score
            document.getElementById("score").innerHTML = "Score: " + score; //updating score text
            document.getElementById("sfx-fruit").play(); //playing fruit sfx

            gameAdvance = (score === (boardSize * level)); //updating flag
            break;

        case "^" : //ghost
            endGame();
            break;

        default : //empty cell
            break;

    }

    // PROCESS: checking for game advance
    if (gameAdvance) {
        score += 1;
        advanceLevel();
    }

}

/**
 * This function advances the game to the next level and increases the speed of the ghost.
 */
function advanceLevel() {

    level += 1; //updating level
    document.getElementById("level").innerHTML = "Level: " + level; //updating level text

    document.getElementById("sfx-level-up").play(); //playing level up sfx

    clearInterval(ghostTimer); //clearing ghost movement interval
    ghostSpeed -= 50; //updating ghost speed
    ghostTimer = setInterval(moveGhost, ghostSpeed); //setting timer

    game = createGame(boardSize); //updating board
    renderGame(game); //re-rendering board

}

/**
 * This function moves the ghost character toward Pacman.
 */
function moveGhost() {

    // VARIABLE DECLARATION:
    let gameLoss;

    game[positionGhost] = game[positionGhost].replace("^", ""); //clearing current cell

    // PROCESS: determining the direction to move the ghost
    if (positionGhost < positionPM) { //Pacman is to the right

        ghostDirection = "right"; //updating direction

        if (positionGhost !== game.length - 1) { //not at right boundary
            positionGhost += 1; //updating position
            game[positionGhost] = "^" + game[positionGhost]; //moving ghost to the right
        }

    } else if (positionGhost > positionPM) { //Pacman is to the left

        ghostDirection = "left"; //updating direction

        if (positionGhost !== 0) { //not at left boundary
            positionGhost -= 1; //updating position
            game[positionGhost] = "^" + game[positionGhost]; //moving ghost to the left
        }

    }

    renderGame(game); //render the updated game board

    // PROCESS: checking for game loss
    gameLoss = positionGhost === positionPM;

    if (gameLoss) {
        endGame();
    }

}

/**
 * This function handles keydown events for Pacman movement.
 *
 * @param event the keydown event
 */
function handleKeyDown(event) {

    // PROCESS: checking for direction
    if (event.key === "a" || event.key === "ArrowLeft") { //move left

        pacmanDirection = "left"; //updating direction
        moveLeftContinuous(game);

    } else if (event.key === "d" || event.key === "ArrowRight") { //move right

        pacmanDirection = "right"; //updating direction
        moveRightContinuous(game);

    }

}

/**
 * This is a helper function that generates random ints between the given number params.
 *
 * @param min the inclusive min boundary
 * @param max the inclusive max boundary
 * @returns {number} the randomly generated integer
 */
function getRandomInt(min, max) {
    // OUTPUT:
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
