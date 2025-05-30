class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        this.MAX_SPEED = 75;
        this.SCALE =  3.5;
        this.inBuilding = false;
        this.waitingForDialogue = false;
        this.dialogueActive = false;

    }
    preload () {
        // animated tile setup
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        this.map = this.add.tilemap("topDown-level-1", 16, 16, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset1 = this.map.addTilesetImage("tilemap_RPG", "tilemap_RPG");
        this.tileset = this.map.addTilesetImage("tilemap_new", "tilemap_new");

// ============================== Create all layers  ========================= //
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.pathLayer = this.map.createLayer("Paths", this.tileset, 0, 0);
        this.buildingLayer = this.map.createLayer("Buildings", this.tileset, 0, 0);
        this.buildingWallLayer = this.map.createLayer("BuildingWalls", this.tileset, 0, 0);
        this.interior1Layer = this.map.createLayer("BuildingInterior1", this.tileset, 0, 0);
        this.interior2Layer = this.map.createLayer("BuildingInterior2", this.tileset, 0, 0);
        this.decorLayer = this.map.createLayer("Decor", this.tileset, 0, 0);
        this.roofLayer0 = this.map.createLayer("Roofs0", this.tileset, 0, 0).setDepth(4);
        this.roofLayer1 = this.map.createLayer("Roofs1", this.tileset, 0, 0).setDepth(5);
        this.roofLayer2 = this.map.createLayer("Roofs2", this.tileset, 0, 0).setDepth(6);
        this.chimneyLayer = this.map.createLayer("Chimney", this.tileset, 0, 0).setDepth(7);
// ===================================================================================================== //

        
        // Make layers collidable
        this.pathLayer.setCollisionByProperty({
            collides: true
        });
        this.buildingLayer.setCollisionByProperty({
            collides: true
        });
        this.buildingWallLayer.setCollisionByProperty({
            collides: true
        });
        this.interior1Layer.setCollisionByProperty({
            collides: true
        });
        this.interior2Layer.setCollisionByProperty({
            collides: true
        });
        
        this.roofZones = this.map.getObjectLayer("Objects").objects.filter(obj => obj.name === "RoofTriggers");

        // Create an array of arcade zone bodies to detect if player is in building
        this.buildingZones = this.roofZones.map(zone => {
            const z = this.add.zone(
                zone.x + zone.width / 2,
                zone.y - zone.height / 2, // Tiled's y is top-left, Phaser expects center
                zone.width,
                zone.height
            );
            this.physics.world.enable(z);
            z.body.setAllowGravity(false);
            z.body.moves = false;
            return z;
        });

        // Create and store parts of player sprite
        this.playerBod = this.add.sprite(0, 0, "idle_bod", 0);
        this.playerHair = this.add.sprite(0, 0, "idle_hair", 0);

        // Start idle animations
        this.playerBod.play("idle");
        this.playerHair.play("idle_h");

        // Group Parts in a player container
        my.sprite.player = this.add.container(100, 100, [this.playerBod, this.playerHair]).setDepth(2);

        // Set physics body properties
        this.physics.world.enable(my.sprite.player);
        let body = my.sprite.player.body;
        body.setCollideWorldBounds(true);
        body.setSize(16, 16);
        body.setOffset(-16 / 2, -16 / 2);

// ================ Collision handler for player and layers ============================ //
        this.physics.add.collider(my.sprite.player, this.buildingLayer);
        this.physics.add.collider(my.sprite.player, this.buildingWallLayer);
        this.physics.add.collider(my.sprite.player, this.pathLayer);
        this.physics.add.collider(my.sprite.player, this.interior1Layer);
        this.physics.add.collider(my.sprite.player, this.interior2Layer);
// ===================================================================================== //

        // Camera to follow player
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(this.SCALE);
        
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // NPC creation
        this.Frank = new Npc(this, 443, 344, "idle_bod", "idle_hair", my.sprite.player, "idle", "idle_h", [
            "Hey there, traveler!",
            "Don't go into the forest alone.",
            "You might not come back!"
        ]);

        cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        // animated tile set-up
        this.animatedTiles.init(this.map);
    }

    update() {

        // update building state
        this.checkEnterBuilding();

        // update npcs
        this.dialogueActive = this.Frank.update();

        // player movement
        my.sprite.player.body.setVelocity(0);
        if (!this.dialogueActive) {
            this.updatePlayerMovement();
        }
    }

    updatePlayerMovement() {
        let player = my.sprite.player.body;
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

    checkEnterBuilding() {
        const playerX = my.sprite.player.body.center.x;
        const playerY = my.sprite.player.body.center.y;
        let inside = false;

        for (let zone of this.buildingZones) {
            const zoneBounds = zone.getBounds();
            if (Phaser.Geom.Rectangle.Contains(zoneBounds, playerX, playerY)) {
                inside = true;
                break;
            }
        }

        if (inside && !this.inBuilding) {
            this.inBuilding = true;
            this.roofLayer1.setVisible(false);
            this.roofLayer2.setVisible(false);
            this.chimneyLayer.setVisible(false);
        } else if (!inside && this.inBuilding) {
            this.inBuilding = false;
            this.roofLayer1.setVisible(true);
            this.roofLayer2.setVisible(true);
            this.chimneyLayer.setVisible(true);
        }
    }
}