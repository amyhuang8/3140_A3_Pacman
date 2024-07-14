/*
Author: Amy Huang & Anoushka Jawale
Creation Date: July 10, 2024
Last Updated: July 13, 2024
Description: This JavaScript file contains functions for manipulating the index.php file.
*/

// VARIABLE DECLARATION:
/**
 * an intervalID for Pacman's movement
 * @type {number}
 */
let moveTimer; //timer for continuous Pacman movement

/**
 * an intervalID for the ghost's movement
 * @type {number}
 */
let ghostTimer; //timer for continuous ghost movement

/**
 * the speed in ms at which the ghost moves
 * @type {number}
 */
let ghostSpeed = 400; //interval in ms

displayInstructions(); //helper function to display starting instructions

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
    moveRightContinuous(); //start with auto-moving Pacman to the right

    // VARIABLE DECLARATION:
    const beginButton = document.getElementById("begin-button");
    const leaderboardButton = document.getElementById("leaderboard-button");

    beginButton.disabled = true; //disabling begin button
    beginButton.style.cursor = "not-allowed"; //disabling cursor

    leaderboardButton.disabled = true; //disabling leaderboard button
    leaderboardButton.style.cursor = "not-allowed"; //disabling cursor

}

/**
 * This function ends the game by stopping the ghost movement interval, stopping continuous movement, and removing key event listeners.
 */
function endGame() {

    // VARIABLE DECLARATION:
    const bgm = document.getElementById("bgm");

    bgm.pause(); //stopping bgm
    bgm.currentTime = 0; //resetting loop

    // VARIABLE DECLARATION:
    const button = document.getElementById("begin-button");
    const leaderboardButton = document.getElementById("leaderboard-button");

    button.disabled = false; //re-enabling begin button
    button.style.cursor = "pointer"; //resetting cursor

    leaderboardButton.disabled = false; //re-enabling leaderboard button
    leaderboardButton.style.cursor = "pointer"; //resetting cursor

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

    restartButton.onclick = function () {
        modal.style.display = "none"; //hiding prompt
        resetGame(); //restarting game
    }

    window.onclick = function (event) {
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

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    } //hide modal if clicking outside of prompt

}

/**
 * This function displays the leaderboard modal.
 */
function displayLeaderboard() {

    // VARIABLE DECLARATION:
    const modal = document.getElementById("leaderboardModal");
    const closeButton = document.getElementById("closeLeaderboard");

    closeButton.onclick = function () {
        modal.style.display = "none"; //hiding modal
    }

    // PROCESS: sending POST req. w/ AJAX to server
    $.ajax({
        type: 'POST',
        url: '../index.php',
        data: { action: 'displayLeaderboard' },
        dataType: 'json',
        success: function (response) {

            // VARIABLE DECLARATION:
            const leaderboardList = document.getElementById("leaderboardList");
            const leaderboardArray = response["leaderboard"];

            leaderboardList.innerHTML = ""; //clearing previous leaderboard content

            // PROCESS: adding each score to the list
            leaderboardArray.forEach(score => {

                // VARIABLE DECLARATION: creating each list element
                const li = document.createElement("li");

                li.textContent = score; //updating text content
                leaderboardList.appendChild(li); //adding to display

            });

            if (!leaderboardList.hasChildNodes()) {
                leaderboardList.innerHTML = "No scores to list"; //updating text content
            }

        },
        error: function (xhr, status) { //error-handling
            console.error("Network Error! Status Code: " + status + " Error: " + xhr.responseText);
        }
    });

    modal.style.display = "block"; //displaying the modal

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    } //hide modal if clicking outside of prompt

}

/**
 * This function resets the game by re-initializing game variables and starting a new game.
 */
function resetGame() {

    // PROCESS: sending POST req. w/ AJAX to server
    $.ajax({
        type: 'POST',
        url: '../index.php',
        data: { action: 'resetGame' },
        dataType: 'json',
        success: function (response) {

            // VARIABLE DECLARATION:
            const board = response["board"];
            const directionPM = response["directionPM"];
            const directionGhost = response["directionGhost"];
            const highScore = response["highScore"];
            const level = response["level"];

            document.getElementById("high-score").innerHTML = "High Score: " + highScore; //updating high score text
            document.getElementById("level").innerHTML = "Level: " + level; //updating level text

            renderGame(board, directionPM, directionGhost); //render the updated game board

        },
        error: function (xhr, status) { //error-handling
            console.error("Network Error! Status Code: " + status + " Error: " + xhr.responseText);
        }
    });

    ghostSpeed = 400; //resetting speed
    startGame(); //starting a new game

}

/**
 * This function renders the game board to the HTML.
 *
 * @param board an array with the current board positions
 * @param directionPM the direction in which Pacman is moving
 * @param directionGhost the direction in which the ghost is moving
 */
function renderGame(board, directionPM = "right", directionGhost = "left") {

    // VARIABLE DECLARATION:
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; //clearing previous board

    // PROCESS: updating each cell contents
    board.forEach(cell => {

        // VARIABLE DECLARATION:
        const cellDiv = document.createElement("div");
        cellDiv.className = "cell"; //updating style

        // PROCESS: checking which sprite to render
        if (cell === "C") {

            // PROCESS: creating image
            const pacmanImg = document.createElement("img");

            // PROCESS: checking for direction to choose correct sprite
            switch (directionPM) {

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
            switch (directionGhost) {

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
 */
function moveLeft() {

    // PROCESS: sending POST req. w/ AJAX to server
    $.ajax({
        type: 'POST',
        url: '../index.php',
        data: { action: 'moveLeftPacman' },
        dataType: 'json',
        success: function (response) {

            // VARIABLE DECLARATION:
            const board = response["board"];
            const directionPM = response["directionPM"];
            const directionGhost = response["directionGhost"];
            const isFruitEaten = response["isFruitEaten"];
            const score = response["score"];
            const level = response["level"];
            const isGameAdvanced = response["isGameAdvanced"];
            const isGameOver = response["isGameOver"];

            renderGame(board, directionPM, directionGhost); //render the updated game board
            document.getElementById("score").innerHTML = "Score: " + score; //updating score text

            // PROCESS: checking if a fruit is eaten
            if (isFruitEaten) {
                document.getElementById("sfx-fruit").play(); //playing fruit sfx
            }

            // PROCESS: checking for level up
            if (isGameAdvanced) {
                advanceLevel(level);
            }

            // PROCESS: checking for game over
            if (isGameOver) {
                endGame();
            }

        },
        error: function (xhr, status) { //error-handling
            console.error("Network Error! Status Code: " + status + " Error: " + xhr.responseText);
        }
    });

}

/**
 * This function shifts the Pacman char one position to the right.
 */
function moveRight() {

    // PROCESS: sending POST req. w/ AJAX to server
    $.ajax({
        type: 'POST',
        url: '../index.php',
        data: { action: 'moveRightPacman' },
        dataType: 'json',
        success: function (response) {

            // VARIABLE DECLARATION:
            const board = response["board"];
            const directionPM = response["directionPM"];
            const directionGhost = response["directionGhost"];
            const isFruitEaten = response["isFruitEaten"];
            const score = response["score"];
            const level = response["level"];
            const isGameAdvanced = response["isGameAdvanced"];
            const isGameOver = response["isGameOver"];

            renderGame(board, directionPM, directionGhost); //render the updated game board
            document.getElementById("score").innerHTML = "Score: " + score; //updating score text

            // PROCESS: checking if a fruit is eaten
            if (isFruitEaten) {
                document.getElementById("sfx-fruit").play(); //playing fruit sfx
            }

            // PROCESS: checking for level up
            if (isGameAdvanced) {
                advanceLevel(level);
            }

            // PROCESS: checking for game over
            if (isGameOver) {
                endGame();
            }

        },
        error: function (xhr, status) {  //error-handling
            console.error("Network Error! Status Code: " + status + " Error: " + xhr.responseText);
        }
    });

}

/**
 * This function moves the Pacman char to the left.
 */
function moveLeftContinuous() {

    clearInterval(moveTimer); //clearing previous timer

    moveTimer = setInterval(function () {
        moveLeft();
    }, 150); //setting speed for continuous movement

}

/**
 * This function move the Pacman char to the right.
 */
function moveRightContinuous() {

    clearInterval(moveTimer); //clearing previous timer

    moveTimer = setInterval(function () {
        moveRight();
    }, 150); //setting speed for continuous movement

}

/**
 * This function advances the game to the next level and increases the speed of the ghost.
 */
function advanceLevel(level) {

    document.getElementById("level").innerHTML = "Level: " + level; //updating level text

    document.getElementById("sfx-level-up").play(); //playing level up sfx

    clearInterval(ghostTimer); //clearing ghost movement interval
    ghostSpeed -= 50; //updating ghost speed
    ghostTimer = setInterval(moveGhost, ghostSpeed); //setting timer

    // PROCESS: sending POST req. w/ AJAX to server
    $.ajax({
        type: 'POST',
        url: '../index.php',
        data: { action: 'advanceLevel' },
        dataType: 'json',
        success: function (response) {

            // VARIABLE DECLARATION:
            const board = response["board"];
            const directionPM = response["directionPM"];
            const directionGhost = response["directionGhost"];

            renderGame(board, directionPM, directionGhost); //re-rendering board

        },
        error: function (xhr, status) {  //error-handling
            console.error("Network Error! Status Code: " + status + " Error: " + xhr.responseText);
        }
    });

}

/**
 * This function moves the ghost character toward Pacman.
 */
function moveGhost() {

    // PROCESS: sending POST req. w/ AJAX to server
    $.ajax({
        type: 'POST',
        url: '../index.php',
        data: { action: 'moveGhost' },
        dataType: 'json',
        success: function (response) {

            // VARIABLE DECLARATION:
            const board = response["board"];
            const directionPM = response["directionPM"];
            const directionGhost = response["directionGhost"];
            const isGameOver = response["isGameOver"];

            renderGame(board, directionPM, directionGhost); //render the updated game board

            // PROCESS: checking for game over
            if (isGameOver) {
                endGame();
            }

        },
        error: function (xhr, status) {  //error-handling
            console.error("Network Error! Status Code: " + status + " Error: " + xhr.responseText);
        }
    });

}

/**
 * This function handles keydown events for Pacman movement.
 * @param event the keydown event
 */
function handleKeyDown(event) {

    // PROCESS: checking for direction
    if (event.key === "a" || event.key === "ArrowLeft") { //move left
        moveLeftContinuous();
    } else if (event.key === "d" || event.key === "ArrowRight") { //move right
        moveRightContinuous();
    }

}
