<?php

/*
 * Author: Amy Huang
 * Creation Date: July 10, 2024
 * Last Updated: June 11, 2024
 * Description: This PHP file contains the object model for the fruit.
 */

/**
 * This class represents a model object for the fruit and its relevant data.
 */
class Fruit
{

    // VARIABLE DECLARATION:--------------------------------------------------------------------------------------------
    /**
     * @var int the fruit's position on the game board
     */
    private $position;

    // CONSTRUCTOR------------------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR METHOD
     * @param int $boardSize the game board size
     * @param int $positionPM the current position of Pacman on the game board
     * @param int $positionGhost the current position of the ghost on the game board
     */
    public function __construct(int $boardSize, int $positionPM, int $positionGhost)
    {
        // INITIALIZATION: generating starting position of fruit and ensuring fair distance from Pacman and ghost
        do {
            $this->position = rand(0, $boardSize - 1);
        } while (abs($positionPM - $this->position) < 5 || $this->position === $positionGhost);
    }

    // FUNCTIONS--------------------------------------------------------------------------------------------------------
    /**
     * This function generates and sets a new position for the fruit.
     * @param int $boardSize the game board size
     * @param int $positionPM the current position of Pacman on the game board
     * @param int $positionGhost the current position of the ghost on the game board
     * @return void
     */
    public function setNewPosition(int $boardSize, int $positionPM, int $positionGhost)
    {
        // INITIALIZATION: generating starting position of fruit and ensuring fair distance from Pacman and ghost
        do {
            $this->position = rand(0, $boardSize - 1);
        } while (abs($positionPM - $this->position) < 5 || $this->position === $positionGhost);
    }

    // GETTER FUNCTIONS-------------------------------------------------------------------------------------------------
    /**
     * This is a getter function for the fruit's position on the game board.
     * @return int the current position
     */
    public function getPosition(): int
    {
        // OUTPUT:
        return $this->position;
    }

}
