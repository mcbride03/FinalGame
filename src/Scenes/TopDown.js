class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        this.ACCELERATION = 200;
        this.DRAG = 10000; // Use to slow down movement over time
        this.MAX_SPEED = 75;
        this.SCALE = 3.5;

    }
    preload () {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        this.map = this.add.tilemap("topDown-level-1", 16, 16, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset1 = this.map.addTilesetImage("tilemap_RPG", "tilemap_RPG");
        this.tileset = this.map.addTilesetImage("tilemap_new", "tilemap_new");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.pathLayer = this.map.createLayer("Paths", this.tileset, 0, 0);
        this.buildingLayer = this.map.createLayer("Buildings", this.tileset, 0, 0);
        this.decorLayer = this.map.createLayer("Decor", this.tileset, 0, 0);

        
        // Make it collidable
        this.pathLayer.setCollisionByProperty({
            collides: true
        });
        this.buildingLayer.setCollisionByProperty({
            collides: true
        });

        // Create and store parts
        this.playerBod = this.add.sprite(0, 0, "idle_bod", 0);
        this.playerHair = this.add.sprite(0, 0, "idle_hair", 0);

        // Start idle animations
        this.playerBod.play("idle");
        this.playerHair.play("idle_h");

        // Group Parts in a player container
        my.sprite.player = this.add.container(100, 100, [this.playerBod, this.playerHair]);
        // my.sprite.player.anims.play('idle');

        this.roofLayer = this.map.createLayer("Roofs", this.tileset, 0, 0);
        this.chimneyLayer = this.map.createLayer("Chimney", this.tileset, 0, 0);


        this.physics.world.enable(my.sprite.player);
        let body = my.sprite.player.body;

        // Set physics body properties
        body.setCollideWorldBounds(true);
        body.setSize(16, 16);
        body.setOffset(-16 / 2, -16 / 2);

        this.physics.add.collider(my.sprite.player, this.buildingLayer);
        this.physics.add.collider(my.sprite.player, this.pathLayer);

        // Simple camera to follow player
        this.cameras.main.setBounds(0, 0, 2440, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(this.SCALE);
        
        this.physics.world.setBounds(0, 0, 2440, this.map.heightInPixels);

        cursors = this.input.keyboard.createCursorKeys();

        this.animatedTiles.init(this.map);


    }

    update() {
        let player = my.sprite.player.body;
        //player.playerBod.play('idle'); // Play the idle animation
       //player.playerHair.play('idle_h'); // Play the idle animation

        player.setVelocity(0);

        if (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown) {
            this.playerBod.play("walk", true);
            this.playerHair.play("walk_h", true);
        } else {
            this.playerBod.play("idle", true);
            this.playerHair.play("idle_h", true);
        }
        if (cursors.left.isDown) {
            player.setVelocityX(-this.MAX_SPEED);
            this.playerBod.setFlipX(true);
            this.playerHair.setFlipX(true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(this.MAX_SPEED);
            this.playerBod.setFlipX(false);
            this.playerHair.setFlipX(false);
        }

        if (cursors.up.isDown) {
            player.setVelocityY(-this.MAX_SPEED);
        } else if (cursors.down.isDown) {
            player.setVelocityY(this.MAX_SPEED);
        }

    }

}