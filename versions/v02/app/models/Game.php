<?php

class Game
{
    private $pacman;
    private $ghost;
    private $fruit;

    private $size;
    private $board;

    private $score;
    private $gameAdvance;
    private $level;

    public $gameOver;

    public function __construct(int $size = 15)
    {
        // INITIALIZATION:
        $this->pacman = new Pacman();
        $this->ghost = new Ghost();
        $this->fruit = new Fruit();

        $this->size = $size;
        $this->board = []; //empty array for the game board

        $this->board[$this->pacman->getPosition()] = "C";
        $this->board[$this->ghost->getPosition()] = "^.";
        $this->board[$this->fruit->getPosition()] = "@";

        // PROCESS: looping through remaining positions in board and adding pellets
        for ($i = 0; $i < $size; $i++) {

            // PROCESS: checking whether position is already taken by Pacman, a ghost, or a fruit
            if (!isset($this->board[$i])) { //not taken
                $this->board[$i] = "."; //adding pellet
            }

        }

        $this->score = 0;
        $this->gameAdvance = false;
        $this->level = 1;
        $this->gameOver = false;
    }

    public function moveLeftPacman():array
    {
        $positionPM = $this->pacman->getPosition();

        $this->board[$positionPM] = ""; //clearing current cell

        // PROCESS: checking for Pacman's position
        if ($positionPM !== 0) { //not already at left boundary

            $this->processMove($this->board[$positionPM - 1]); //processing score
            $this->board[$positionPM - 1] = "C"; //moving Pacman to the left
            $this->pacman->setPosition($positionPM - 1); //updating index of Pacman

        } else { //move to right side

            $this->processMove($this->board[$this->size - 1]); //processing score
            $this->board[$this->size - 1] = "C"; //moving Pacman to the left
            $this->pacman->setPosition($this->size - 1); //updating index of Pacman

        }

        // OUTPUT:
        return $this->board;
    }

    public function moveRightPacman():array
    {
        $positionPM = $this->pacman->getPosition();

        $this->board[$positionPM] = ""; //clearing current cell

        // PROCESS: checking for Pacman's position
        if ($positionPM !== $this->size - 1) { //not already at right boundary

            $this->processMove($this->board[$positionPM + 1]); //processing score
            $this->board[$positionPM + 1] = "C"; //moving Pacman to the right
            $this->pacman->setPosition($positionPM + 1); //updating index of Pacman

        } else { //move to left side

            $this->processMove($this->board[0]); //processing score
            $this->board[0] = "C"; //moving Pacman to the right
            $this->pacman->setPosition(0); //updating index of Pacman

        }

        // OUTPUT:
        return $this->board;
    }

    private function processMove(string $cellContents)
    {
        // PROCESS: checking for the cell contents
        switch ($cellContents) {

            case "." : //pellet
                $this->score++; //updating score
                $this->gameAdvance = ($this->score === ($this->size * $this->level)); //updating flag
                break;

            case "@" : //fruit
                $this->score += 2; //updating score
                $this->gameAdvance = ($this->score === ($this->size * $this->level)); //updating flag
                break;

            case "^" : //ghost
                $this->gameOver = true; //updating flag
                break;

            default : //empty cell
                break;

        }

        // PROCESS: checking for game advance
        if ($this->gameAdvance) {
            $this->score++;
            $this->advanceLevel();
        }
    }

    private function advanceLevel()
    {
        // INITIALIZATION:
        $this->level++; //updating level
        $this->ghost->setSpeed($this->ghost->getSpeed- 50); //updating ghost speed
    }

}