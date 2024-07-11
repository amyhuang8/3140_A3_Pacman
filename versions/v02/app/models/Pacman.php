<?php

class Pacman
{
    private $position;
    private $direction;
    private $spriteSource;
    private $spriteAlt;

    public function __construct()
    {
        // INITIALIZATION:
        $this->position = 1;
        $this->direction = "right";
        $this->spriteSource = "resources/sprites/pacman_right.png";
        $this->spriteAlt = "Pacman facing right";
    }

    public function setPosition(int $newPosition)
    {
        // INITIALIZATION:
        $this->position = $newPosition;
    }

    public function getPosition():int
    {
        // OUTPUT:
        return $this->position;
    }

    public function setDirection(string $newDirection)
    {
        // INITIALIZATION:
        $this->direction = $newDirection;
    }

    public function getDirection():string
    {
        // OUTPUT:
        return $this->direction;
    }

    public function setSpriteSource(string $newSpriteSource)
    {
        // INITIALIZATION:
        $this->spriteSource = $newSpriteSource;
    }

    public function getSpriteSource():string
    {
        // OUTPUT:
        return $this->spriteSource;
    }

    public function setSpriteAlt(string $newSpriteAlt)
    {
        // INITIALIZATION:
        $this->spriteAlt = $newSpriteAlt;
    }

    public function getSpriteAlt():string
    {
        // OUTPUT:
        return $this->spriteAlt;
    }
}