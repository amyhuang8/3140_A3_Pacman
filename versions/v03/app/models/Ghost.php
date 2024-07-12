<?php

/*
 * Author: Amy Huang
 * Creation Date: July 10, 2024
 * Last Updated: June 11, 2024
 * Description: This PHP file contains the object model for the ghost.
 */

/**
 * This class represents a model object for the ghost and its relevant data.
 */
class Ghost
{

    // VARIABLE DECLARATION:--------------------------------------------------------------------------------------------
    /**
     * @var int the ghost's position on the game board
     */
    private $position;

    /**
     * @var string the direction in which the ghost is moving
     */
    private $direction;

    // CONSTRUCTOR------------------------------------------------------------------------------------------------------
    /**
     * CONSTRUCTOR METHOD
     */
    public function __construct()
    {
        // INITIALIZATION:
        $this->position = 10;
        $this->direction = "left";
    }

    // GETTER FUNCTIONS-------------------------------------------------------------------------------------------------
    /**
     * This is a getter function for the ghost's position on the game board.
     * @return int the current position on the game board
     */
    public function getPosition():int
    {
        // OUTPUT:
        return $this->position;
    }

    /**
     * This is a setter function for the ghost's position.
     * @param int $newPosition the new position on the game board
     * @return void
     */
    public function setPosition(int $newPosition)
    {
        // INITIALIZATION:
        $this->position = $newPosition;
    }

    /**
     * This is a getter function for the current direction.
     * @return string the current direction in which the ghost is moving
     */
    public function getDirection():string
    {
        // OUTPUT:
        return $this->direction;
    }

    /**
     * This is a setter function for the direction.
     * @param string $newDirection the new direction in which the ghost should move
     * @return void
     */
    public function setDirection(string $newDirection)
    {
        // INITIALIZATION:
        $this->direction = $newDirection;
    }

}
