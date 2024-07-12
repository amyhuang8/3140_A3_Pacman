let moveTimer = null; // Timer for continuous Pacman movement
let ghostTimer = null; // Timer for continuous ghost movement
let ghostSpeed = 400; // Interval in ms
let leaderboard = []; // Sample leaderboard data

// Display instructions on page load
displayInstructions();

/**
 * This function starts the game by initiating the ghost movement interval and listening for player key events.
 */
function startGame() {
    try {
        // Start playing background music
        document.getElementById("bgm").play();

        // Start the ghost movement interval
        ghostTimer = setInterval(moveGhost, ghostSpeed);

        // Add listener for keydown events (moving Pacman)
        document.addEventListener("keydown", handleKeyDown);

        // Start Pacman moving to the right initially
        moveRightContinuous();

        // Disable the start button
        const button = document.getElementById("begin-button");
        button.disabled = true;
        button.style.cursor = "not-allowed";
    } catch (error) {
        console.error("Error in startGame:", error);
    }
}

/**
 * Function to show the leaderboard.
 */
function showLeaderboard() {
    try {
        // Send AJAX request to retrieve leaderboard data
        $.ajax({
            type: 'POST',
            url: '../index.php',
            data: { action: 'getLeaderboard' },
            dataType: 'json',
            success: function(response) {
                // Display the leaderboard modal with the retrieved data
                displayLeaderboard(response.leaderboard);
                console.log(response.leaderboard)
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } catch (error) {
        console.error("Error in showLeaderboard:", error);
    }
}

/**
 * Function to display the leaderboard in the modal.
 */
function displayLeaderboard(leaderboardData) {
    try {
        const modal = document.getElementById("leaderboardModal");
        const leaderboardContent = document.getElementById("leaderboardList");

        // Clear previous leaderboard content
        leaderboardContent.innerHTML = "";

        // Create a new unordered list
        const ul = document.createElement("ul");

        // Populate the leaderboard entries
        leaderboardData.forEach(score => {
            const li = document.createElement("li");
            li.textContent = score;
            ul.appendChild(li);
        });

        // Append the list to the modal content
        leaderboardContent.appendChild(ul);

        // Display the modal
        modal.style.display = "block";
    } catch (error) {
        console.error("Error in displayLeaderboard:", error);
    }
}

/**
 * Function to hide the leaderboard modal.
 */
function hideLeaderboard() {
    try {
        const modal = document.getElementById("leaderboardModal");
        modal.style.display = "none";
    } catch (error) {
        console.error("Error in hideLeaderboard:", error);
    }
}

/**
 * Event listeners for showing and hiding the leaderboard modal.
 */
document.getElementById("leaderboard-button").addEventListener("click", showLeaderboard);
document.getElementById("closeLeaderboard").addEventListener("click", hideLeaderboard);

/**
 * This function ends the game by stopping the ghost movement interval, stopping continuous movement, and removing key event listeners.
 */
function endGame() {
    try {
        const bgm = document.getElementById("bgm");

        // Stop background music
        bgm.pause();
        bgm.currentTime = 0;

        // Enable the start button
        const button = document.getElementById("begin-button");
        button.disabled = false;
        button.style.cursor = "pointer";

        // Clear intervals for movement
        clearInterval(ghostTimer);
        clearInterval(moveTimer);

        // Remove keydown event listener
        document.removeEventListener("keydown", handleKeyDown);

        // Display game over modal
        displayGameOver();

        $.ajax({
            type: 'POST',
            url: '../index.php',
            data: { action: 'endGame' },
            dataType: 'json',
            success: function(response) {
                const { board, score, leaderboard, highScore } = response;

                // Update high score on UI
                document.getElementById("high-score").innerHTML = "High Score: " + response.highScore;

                // Render the updated game board
                renderGame(board);

                // Update local leaderboard variable (optional)
                leaderboard = response.leaderboard;
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } catch (error) {
        console.error("Error in endGame:", error);
    }
}

/**
 * Function to display the game over modal.
 */
function displayGameOver() {
    try {
        const modal = document.getElementById("gameOverModal");
        const gameOverSound = document.getElementById("sfx-game-over");
        const restartButton = document.getElementById("restart");

        // Display the game over modal
        modal.style.display = "block";
        gameOverSound.play(); // Play game over sound

        // Restart game on restart button click
        restartButton.onclick = function() {
            modal.style.display = "none"; // Hide modal
            resetGame(); // Restart game
        };

        // Hide modal if clicking outside of it
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    } catch (error) {
        console.error("Error in displayGameOver:", error);
    }
}

/**
 * Function to display the instructions modal.
 */
function displayInstructions() {
    try {
        const modal = document.getElementById("instructionsModal");
        modal.style.display = "block";

        // Hide modal if clicking outside of it
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    } catch (error) {
        console.error("Error in displayInstructions:", error);
    }
}

/**
 * Function to reset the game by re-initializing game variables and starting a new game.
 */
function resetGame() {
    try {
        // Send AJAX POST request to reset the game
        $.ajax({
            type: 'POST',
            url: '../index.php',
            data: { action: 'resetGame' },
            dataType: 'json',
            success: function(response) {
                const { board, directionPM, directionGhost, highScore, level } = response;

                // Update high score and level on UI
                document.getElementById("high-score").innerHTML = "High Score: " + highScore;
                document.getElementById("level").innerHTML = "Level: " + level;

                // Render the updated game board
                renderGame(board, directionPM, directionGhost);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });

        // Reset ghost speed and start a new game
        ghostSpeed = 400;
        startGame();
    } catch (error) {
        console.error("Error in resetGame:", error);
    }
}

/**
 * Function to render the game board to the HTML.
 *
 * @param board Array with the current board positions
 * @param directionPM The direction in which Pacman is moving
 * @param directionGhost The direction in which the ghost is moving
 */
function renderGame(board, directionPM = "right", directionGhost = "left") {
    try {
        const gameContainer = document.getElementById("game-container");
        gameContainer.innerHTML = ""; // Clear previous board

        board.forEach(cell => {
            const cellDiv = document.createElement("div");
            cellDiv.className = "cell";

            if (cell === "C") {
                const pacmanImg = document.createElement("img");

                switch (directionPM) {
                    case "right":
                        pacmanImg.src = "resources/sprites/pacman_right.png";
                        pacmanImg.alt = "Pacman facing right";
                        break;
                    case "left":
                        pacmanImg.src = "resources/sprites/pacman_left.png";
                        pacmanImg.alt = "Pacman facing left";
                        break;
                    default:
                        break;
                }

                pacmanImg.className = "sprites";
                cellDiv.appendChild(pacmanImg);

            } else if (cell.includes("^")) {
                const ghostImg = document.createElement("img");

                switch (directionGhost) {
                    case "right":
                        ghostImg.src = "resources/sprites/ghost_right.png";
                        ghostImg.alt = "Ghost facing right";
                        break;
                    case "left":
                        ghostImg.src = "resources/sprites/ghost_left.png";
                        ghostImg.alt = "Ghost facing left";
                        break;
                    default:
                        break;
                }

                ghostImg.className = "sprites";
                cellDiv.appendChild(ghostImg);

            } else if (cell === "@") {
                const fruitImg = document.createElement("img");
                fruitImg.src = "resources/sprites/fruit.png";
                fruitImg.alt = "Fruit";
                fruitImg.className = "sprites";
                cellDiv.appendChild(fruitImg);

            } else if (cell === ".") {
                const pelletImg = document.createElement("img");
                pelletImg.src = "resources/sprites/pellet.png";
                pelletImg.alt = "Pellet";
                pelletImg.className = "sprites";
                cellDiv.appendChild(pelletImg);
            }

            gameContainer.appendChild(cellDiv);
        });
    } catch (error) {
        console.error("Error in renderGame:", error);
    }
}

/**
 * Function to move Pacman one position to the left.
 */
function moveLeft() {
    try {
        $.ajax({
            type: 'POST',
            url: '../index.php',
            data: { action: 'moveLeftPacman' },
            dataType: 'json',
            success: function(response) {
                const { board, directionPM, directionGhost, fruitEaten, score, level, isGameAdvanced, isGameOver } = response;

                // Render the updated game board and update score
                renderGame(board, directionPM, directionGhost);
                document.getElementById("score").innerHTML = "Score: " + score;

                // Play fruit sound effect if fruit is eaten
                if (fruitEaten) {
                    document.getElementById("sfx-fruit").play();
                }

                // Advance level if applicable
                if (isGameAdvanced) {
                    advanceLevel(level);
                }

                // End game if it's over
                if (isGameOver) {
                    endGame();
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } catch (error) {
        console.error("Error in moveLeft:", error);
    }
}

/**
 * Function to move Pacman one position to the right.
 */
function moveRight() {
    try {
        $.ajax({
            type: 'POST',
            url: '../index.php',
            data: { action: 'moveRightPacman' },
            dataType: 'json',
            success: function(response) {
                const { board, directionPM, directionGhost, fruitEaten, score, level, isGameAdvanced, isGameOver } = response;

                // Render the updated game board and update score
                renderGame(board, directionPM, directionGhost);
                document.getElementById("score").innerHTML = "Score: " + score;

                // Play fruit sound effect if fruit is eaten
                if (fruitEaten) {
                    document.getElementById("sfx-fruit").play();
                }

                // Advance level if applicable
                if (isGameAdvanced) {
                    advanceLevel(level);
                }

                // End game if it's over
                if (isGameOver) {
                    endGame();
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } catch (error) {
        console.error("Error in moveRight:", error);
    }
}

/**
 * Function to continuously move Pacman to the left.
 */
function moveLeftContinuous() {
    try {
        clearInterval(moveTimer); // Clear previous timer

        moveTimer = setInterval(function() {
            moveLeft();
        }, 150); // Set speed for continuous movement
    } catch (error) {
        console.error("Error in moveLeftContinuous:", error);
    }
}

/**
 * Function to continuously move Pacman to the right.
 */
function moveRightContinuous() {
    try {
        clearInterval(moveTimer); // Clear previous timer

        moveTimer = setInterval(function() {
            moveRight();
        }, 150); // Set speed for continuous movement
    } catch (error) {
        console.error("Error in moveRightContinuous:", error);
    }
}

/**
 * Function to advance the game to the next level and increase the ghost speed.
 */
function advanceLevel(level) {
    try {
        document.getElementById("level").innerHTML = "Level: " + level; // Update level text
        document.getElementById("sfx-level-up").play(); // Play level up sound

        clearInterval(ghostTimer); // Clear ghost movement interval
        ghostSpeed -= 50; // Increase ghost speed
        ghostTimer = setInterval(moveGhost, ghostSpeed); // Set new timer

        $.ajax({
            type: 'POST',
            url: '../index.php',
            data: { action: 'advanceLevel' },
            dataType: 'json',
            success: function(response) {
                const { board, directionPM, directionGhost } = response;
                renderGame(board, directionPM, directionGhost); // Re-render board
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } catch (error) {
        console.error("Error in advanceLevel:", error);
    }
}

/**
 * Function to move the ghost character toward Pacman.
 */
function moveGhost() {
    try {
        $.ajax({
            type: 'POST',
            url: '../index.php',
            data: { action: 'moveGhost' },
            dataType: 'json',
            success: function(response) {
                const { board, directionPM, directionGhost, isGameOver } = response;
                renderGame(board, directionPM, directionGhost); // Render updated game board

                // End game if it's over
                if (isGameOver) {
                    endGame();
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } catch (error) {
        console.error("Error in moveGhost:", error);
    }
}

/**
 * Function to handle keydown events for Pacman movement.
 * @param event The keydown event
 */
function handleKeyDown(event) {
    try {
        if (event.key === "a" || event.key === "ArrowLeft") { // Move left
            moveLeftContinuous();
        } else if (event.key === "d" || event.key === "ArrowRight") { // Move right
            moveRightContinuous();
        }
    } catch (error) {
        console.error("Error in handleKeyDown:", error);
    }
}
