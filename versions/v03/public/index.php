<?php

require_once('../config/_config.php');
include '../app/models/Game.php';

session_start(); // Starting session

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}



// PROCESS: Checking if game state already exists in session
if (isset($_SESSION['game'])) { // Exists
    $game = $_SESSION['game'];
} else { // Does not
    // VARIABLE DECLARATION: New game
    $game = new Game();
    $_SESSION['game'] = $game;
}

// PROCESS: Handling POST requests from front-end
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {

    // PROCESS: Handling AJAX
    if ($_POST['action'] === "moveGhost") { // Moving the ghost
        $game->moveGhost();
        $_SESSION['game'] = $game; // Updating session variable

        // VARIABLE DECLARATION:
        $response = [
            'board' => $game->getBoard(),
            'directionPM' => $game->getDirectionPM(),
            'directionGhost' => $game->getDirectionGhost(),
            'score' => $game->getScore(),
            'isGameOver' => $game->isGameOver(),
            
        ];

        // OUTPUT:
        echo json_encode($response);
        exit;
    }

    if ($_POST['action'] === "moveLeftPacman") { // Moving Pacman to the left
        $game->moveLeftPacman();
        $_SESSION['game'] = $game; // Updating session variable

        // VARIABLE DECLARATION:
        $response = [
            'board' => $game->getBoard(),
            'directionPM' => $game->getDirectionPM(),
            'directionGhost' => $game->getDirectionGhost(),
            'fruitEaten' => $game->isFruitEaten(),
            'score' => $game->getScore(),
            'level' => $game->getLevel(),
            'isGameAdvanced' => $game->isGameAdvanced(),
            'gameOver' => $game->isGameOver(),
        ];

        // OUTPUT:
        echo json_encode($response);
        exit;
    }

    if ($_POST['action'] === "moveRightPacman") { // Moving Pacman to the right
        $game->moveRightPacman();
        $_SESSION['game'] = $game; // Updating session variable

        // VARIABLE DECLARATION:
        $response = [
            'board' => $game->getBoard(),
            'directionPM' => $game->getDirectionPM(),
            'directionGhost' => $game->getDirectionGhost(),
            'fruitEaten' => $game->isFruitEaten(),
            'score' => $game->getScore(),
            'level' => $game->getLevel(),
            'isGameAdvanced' => $game->isGameAdvanced(),
            'gameOver' => $game->isGameOver(),
        ];

        // OUTPUT:
        echo json_encode($response);
        exit;
    }

    if ($_POST['action'] === "advanceLevel") { // Advancing the game level
        $game->createNewBoard();
        $_SESSION['game'] = $game; // Updating session variable

        // VARIABLE DECLARATION:
        $response = [
            'board' => $game->getBoard(),
            'directionPM' => $game->getDirectionPM(),
            'directionGhost' => $game->getDirectionGhost(),
        ];

        // OUTPUT:
        echo json_encode($response);
        exit;
    }

    if ($_POST['action'] === 'getLeaderboard') {
        // Assuming $_SESSION['leaderboard'] contains leaderboard data

        // Prepare response
        $response = [
            'leaderboard' => $_SESSION['leaderboard']
        ];

        // Output JSON response
        header('Content-Type: application/json');
        echo json_encode($response);
        exit; // Stop further script execution
    }

    if ($_POST['action'] === "resetGame") { // Resetting the game
        $game->resetGame();
        $_SESSION['game'] = $game; // Updating session variable

        // VARIABLE DECLARATION:
        $response = [
            'board' => $game->getBoard(),
            'directionPM' => $game->getDirectionPM(),
            'directionGhost' => $game->getDirectionGhost(),
            'highScore' => $game->getHighScore(),
            'level' => $game->getLevel(),
        ];

        // OUTPUT:
        echo json_encode($response);
        exit;
    }
    if ($_POST['action'] === "endGame") {
        // Get the current score from the game object
        $score = $game->getScore();
        $highScore = getHighScore();

        $_SESSION['leaderboard'][] = $highScore;

        
        
        // Update the leaderboard with the current score
        $_SESSION['leaderboard'][] = $score;
        
        // Sort the leaderboard in descending order
        rsort($_SESSION['leaderboard']);
        
        // Keep only the top 10 scores
        $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);
        
        // Prepare the response with updated game state and leaderboard
        $response = [
            'board' => $game->getBoard(),
            'score' => $score,
            'leaderboard' => $_SESSION['leaderboard'],
            'highscore' -> $_SESSION['highscore']
        ];
        
        // Output JSON response
        echo json_encode($response);
        exit; // Stop further script execution
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <!--META DATA-->
    <meta charset="UTF-8">
    <meta name="author" content="Amy Huang & Anoushka Jawale">
    <meta name="creation_date" content="July 10, 2024">
    <meta name="last_updated" content="July 11, 2024">
    <meta name="description" content="This is our work for Assignment 3 of CSI 3140.">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!--WEBSITE TITLE-->
    <title>1D Pacman</title>

    <!--FAVICONS-->
    <link rel="apple-touch-icon" sizes="180x180" href="resources/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="resources/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="resources/favicon-16x16.png">
    <link rel="manifest" href="resources/site.webmanifest">

    <!--STYLESHEET-->
    <link rel="stylesheet" href="css/index.css">

    <!--JQUERY SCRIPT-->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>
    <!--HEADER/GAME STATS-->
    <header>
        <h1 id="score">Score: 0</h1>
        <h1 id="high-score">High Score: 0</h1>
        <h1 id="level">Level: 1</h1>
        <button id="begin-button" onclick="resetGame();">Start</button>
        <button id="leaderboard-button" onclick="showLeaderboard();">Show Leaderboard</button>
    </header>

    <!--GAME BOARD-->
    <div class="game-borders" style="height: 25vh;">
        <div class="game-borders" style="height: 20vh;">
            <div id="game-container" class="game-board">
                <h1>PACMAN</h1>
            </div>
        </div>
    </div>

    <!--INSTRUCTIONS MODAL -->
    <div id="instructionsModal" class="modal">
        <div class="modal-content">
            <h1 class="modal-text">Instructions:</h1>
            <h1 class="modal-text">Use A/D or left/right arrow keys to change direction!</h1>
            <h2 class="modal-text">Click outside to START.</h2>
            <br>
        </div>
    </div>

    <!--GAME OVER MODAL -->
    <div id="gameOverModal" class="modal">
        <div class="modal-content">
            <h1 class="modal-text">Game over!</h1>
            <h1 class="modal-text">Do you want to play again?</h1>
            <button id="restart">Restart</button>
        </div>
    </div>

    <!--LEADERBOARD MODAL -->
    <div id="leaderboardModal" class="modal">
        <div class="modal-content">
            <h1 class="modal-text">LEADERBOARD</h1>
            <ul id="leaderboardList"></ul>
            <button id="closeLeaderboard">CLOSE</button>
        </div>
    </div>

    <!--AUDIOS-->
    <audio id="bgm" src="resources/audio/beat_pacman.mp3" loop></audio>
    <audio id="sfx-fruit" src="resources/audio/sfx_fruit.mp3"></audio>
    <audio id="sfx-level-up" src="resources/audio/sfx_level-up.mp3"></audio>
    <audio id="sfx-game-over" src="resources/audio/sfx_game-over.mp3"></audio>

    <!--FOOTER-->
    <footer>
        <p>1D PACMAN 2024</p>
    </footer>

    <!--SCRIPT-->
    <script type="text/javascript" src="js/index.js"></script>


</body>

</html>
