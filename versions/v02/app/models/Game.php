<?php

/*
 * Author: Amy Huang
 * Creation Date: July 10, 2024
 * Last Updated: June 11, 2024
 * Description: This PHP file contains the object model for the game.
 */

/**
 * This class represents a model object for the game and its relevant state data.
 */
class Game
{

    // VARIABLE DECLARATION:--------------------------------------------------------------------------------------------
    /**
     * @var int the size of the game board
     */
    private $boardSize;

    /**
     * @var Pacman the Pacman object
     */
    private $pacman;

    /**
     * @var Ghost the Ghost object
     */
    private $ghost;

    /**
     * @var Fruit the Fruit object
     */
    private $fruit;

    /**
     * @var array the game board
     */
    private $board;

    /**
     * @var bool whether a fruit has been eaten
     */
    private $fruitEaten;

    /**
     * @var int the current score
     */
    private $score;

    /**
     * @var int the high score
     */
    private $highScore;

    /**
     * @var int[] the top ten leaderboard of scores
     */
    private $leaderboard;

    /**
     * @var int the current game level
     */
    private $level;

    /**
     * @var bool whether the game level should advance
     */
    private $gameAdvance;

    /**
     * @var bool whether the game is over
     */
    private $gameOver;

    // CONSTRUCTOR------------------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR METHOD
     */
    public function __construct()
    {

        // INITIALIZATION:
        $this->boardSize = 15;

        $this->pacman = new Pacman();
        $this->ghost = new Ghost();
        $this->fruit = new Fruit($this->boardSize, $this->pacman->getPosition(), $this->ghost->getPosition());

        $this->createNewBoard();

        $this->fruitEaten = false;
        $this->score = 0;
        $this->highScore = 0;
        $this->leaderboard = [0];
        $this->level = 1;
        $this->gameAdvance = false;
        $this->gameOver = false;

    }

    // FUNCTIONS--------------------------------------------------------------------------------------------------------
    /**
     * This function resets the game by re-initializing game state variables.
     * @return void
     */
    public function resetGame()
    {

        // INITIALIZATION: resetting stats
        $this->pacman->setPosition(1);
        $this->ghost->setPosition(10);
        $this->pacman->setDirection("right");
        $this->ghost->setDirection("left");

        $this->updateLeaderboard();
        $this->score = 0;
        $this->level = 1;

        $this->createNewBoard();

        $this->gameOver = false;
        $this->gameAdvance = false;

    }

    /**
     * This helper function updates the high score and leaderboard.
     * @return void
     */
    private function updateLeaderboard()
    {

        // PROCESS: checking for new high score
        if ($this->score > $this->highScore) {
            $this->highScore = $this->score; //updating high score
        }

        // PROCESS: adding new score to leaderboard
        $this->leaderboard[] = [$this->score];

        sort($this->leaderboard); //sorting leaderboard

        // PROCESS: keeping only the top ten scores
        if (count($this->leaderboard) > 10) {
            $this->leaderboard = array_slice($this->leaderboard, 0, 10);
        }

    }

    /**
     * This function creates a new game board.
     * @return void
     */
    public function createNewBoard()
    {

        $this->fruit->setNewPosition($this->boardSize, $this->pacman->getPosition(), $this->ghost->getPosition()); //setting a new position for the fruit

        $this->board = [".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "."]; //board of pellets

        $this->board[$this->pacman->getPosition()] = "C";
        $this->board[$this->ghost->getPosition()] = "^.";
        $this->board[$this->fruit->getPosition()] = "@";

    }

    /**
     * This function moves the ghost character toward Pacman.
     * @return void
     */
    public function moveGhost()
    {

        // VARIABLE DECLARATION: getting current position
        $positionGhost = $this->ghost->getPosition();
        $positionPM = $this->pacman->getPosition();

        $this->board[$positionGhost] = str_replace("^", "", $this->board[$positionGhost]); //clearing current cell

        // PROCESS: determining the direction to move the ghost
        if ($positionGhost < $positionPM) { //Pacman is to the right

            $this->ghost->setDirection("right"); //updating direction

            if ($positionGhost !== $this->boardSize - 1) { //not at right boundary
                $positionGhost++; //incrementing
                $this->ghost->setPosition($positionGhost); //updating position
                $this->board[$positionGhost] = "^" . $this->board[$positionGhost]; //moving ghost to the right
            }

        } else if ($positionGhost > $positionPM) { //Pacman is to the left

            $this->ghost->setDirection("left"); //updating direction

            if ($positionGhost !== 0) { //not at left boundary
                $positionGhost--; //decrementing
                $this->ghost->setPosition($positionGhost); //updating position
                $this->board[$positionGhost] = "^" . $this->board[$positionGhost]; //moving ghost to the left
            }

        }

        // PROCESS: checking for game over
        $this->gameOver = $positionGhost === $positionPM;

    }

    /**
     * This function shifts the Pacman char one position to the left.
     * @return void
     */
    public function moveLeftPacman()
    {

        $this->pacman->setDirection("left"); //updating direction

        // VARIABLE DECLARATION: getting current position
        $positionPM = $this->pacman->getPosition();

        $this->board[$positionPM] = ""; //clearing current cell

        // PROCESS: checking for Pacman's position
        if ($positionPM !== 0) { //not already at left boundary

            $this->processMove($this->board[$positionPM - 1]); //processing score
            $this->board[$positionPM - 1] = "C"; //moving Pacman to the left
            $this->pacman->setPosition($positionPM - 1); //updating index of Pacman

        } else { //move to right side

            $this->processMove($this->board[$this->boardSize - 1]); //processing score
            $this->board[$this->boardSize - 1] = "C"; //moving Pacman to the left
            $this->pacman->setPosition($this->boardSize - 1); //updating index of Pacman

        }

    }

    /**
     * This function shifts the Pacman char one position to the right.
     * @return void
     */
    public function moveRightPacman()
    {
        $this->pacman->setDirection("right"); //updating direction

        // VARIABLE DECLARATION: getting current position
        $positionPM = $this->pacman->getPosition();

        $this->board[$positionPM] = ""; //clearing current cell

        // PROCESS: checking for Pacman's position
        if ($positionPM !== $this->boardSize - 1) { //not already at right boundary

            $this->processMove($this->board[$positionPM + 1]); //processing score
            $this->board[$positionPM + 1] = "C"; //moving Pacman to the right
            $this->pacman->setPosition($positionPM + 1); //updating index of Pacman

        } else { //move to left side

            $this->processMove($this->board[0]); //processing score
            $this->board[0] = "C"; //moving Pacman to the right
            $this->pacman->setPosition(0); //updating index of Pacman

        }
    }

    /**
     * This helper function processes the move and updates the score.
     * @param string $cellContents the contents of the cell being moved to
     * @return void
     */
    private function processMove(string $cellContents)
    {

        $this->gameAdvance = false; //resetting flag

        // PROCESS: checking for the cell contents
        switch ($cellContents) {

            case "." : //pellet
                $this->score++; //updating score
                $this->fruitEaten = false; //updating flag
                $this->gameAdvance = ($this->score === ($this->boardSize * $this->level)); //updating flag
                break;

            case "@" : //fruit
                $this->score += 2; //updating score
                $this->fruitEaten = true; //updating flag
                $this->gameAdvance = ($this->score === ($this->boardSize * $this->level)); //updating flag
                break;

            case "^" : //ghost
                $this->fruitEaten = false; //updating flag
                $this->gameOver = true; //updating flag
                break;

            default : //empty cell
                $this->fruitEaten = false; //updating flag
                break;

        }

        // PROCESS: checking for game advance
        if ($this->gameAdvance) {
            $this->score = $this->boardSize * $this->level; //resetting score
            $this->advanceLevel();
        }

    }

    /**
     * This function advances the game to the next level.
     * @return void
     */
    private function advanceLevel()
    {
        // INITIALIZATION:
        $this->level++; //updating level
    }

    // GETTER FUNCTIONS-------------------------------------------------------------------------------------------------
    /**
     * This is a getter function for the direction in which Pacman is moving.
     * @return string Pacman's direction
     */
    public function getDirectionPM(): string
    {
        // OUTPUT:
        return $this->pacman->getDirection();
    }

    /**
     * This is a getter function for the direction in which Pacman is moving.
     * @return string the ghost's direction
     */
    public function getDirectionGhost(): string
    {
        // OUTPUT:
        return $this->ghost->getDirection();
    }

    /**
     * This is a getter function for the current game board.
     * @return array the current game board
     */
    public function getBoard(): array
    {
        // OUTPUT:
        return $this->board;
    }

    /**
     * This returns whether a fruit was just eaten.
     * @return bool whether a fruit was eaten
     */
    public function isFruitEaten(): bool
    {
        // OUTPUT:
        return $this->fruitEaten;
    }

    /**
     * This is a getter function for the current score.
     * @return int the current score
     */
    public function getScore(): int
    {
        // OUTPUT:
        return $this->score;
    }

    /**
     * This is a getter function for the current high score.
     * @return int the current high score
     */
    public function getHighScore(): int
    {
        // OUTPUT:
        return $this->highScore;
    }

    /**
     * This is a getter function for the current top ten leaderboard.
     * @return int[] the current leaderboard
     */
    public function getLeaderboard(): array
    {
        // OUTPUT:
        return $this->leaderboard;
    }

    /**
     * This is a getter function for the current game level.
     * @return int the current game level
     */
    public function getLevel(): int
    {
        // OUTPUT:
        return $this->level;
    }

    /**
     * This function returns whether the game level should advance.
     * @return bool whether the game should advance to the next level
     */
    public function isGameAdvanced(): bool
    {
        // OUTPUT:
        return $this->gameAdvance;
    }

    /**
     * This function returns whether the game is over.
     * @return bool whether the game is over
     */
    public function isGameOver(): bool
    {
        // OUTPUT:
        return $this->gameOver;
    }

}
