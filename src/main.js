// Michael McBride
// Created: 5/27/2025
// Phaser: 3.70.0

// Assets used from: https://danieldiggle.itch.io/sunnyside

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.WEBGL,
    scale: {autoCenter: Phaser.Scale.CENTER_BOTH},
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1440,
    height: 900,
    scene: [Load, Game, Forest]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);