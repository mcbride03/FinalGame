class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        this.MAX_SPEED = 75;
        this.SCALE =  3.5;
        this.inBuilding = false;
        this.waitingForDialogue = false;

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

        cursors = this.input.keyboard.createCursorKeys();

// ================================== Dialogue Set-Up ================================== //

        this.dialogueBox = this.add.sprite(0, 0, "kenney_UI_atlas", "buttonLong_beige.png")
            .setOrigin(0.5, 0.5)
            .setDepth(100)           // Draws on top
            .setVisible(false);

        // Create the dialogue text
        this.dialogueText = this.add.bitmapText(100, 100, 'font', '', 16)
        // this.dialogueText.setScrollFactor(0);
        this.dialogueText.setDepth(101);
        this.dialogueText.setVisible(true);
        // this.dialogueText.setText("TESTING...");
        this.dialogueText.setScale(.75);
        this.dialogueText.setOrigin(0, 0); 
        this.typing = this.plugins.get('rextexttypingplugin').add(this.dialogueText, {
            speed: 50 // characters per second
        });

        // Position the box at the bottom of the camera
        this.updateDialogueBoxPosition();
// ===================================================================================== //

        // NPC creation
        this.npcBod = this.add.sprite(0, 0, "idle_bod", 0);
        this.npcHair = this.add.sprite(0, 0, "idle_hair", 0);
        this.Frank = new Npc(this, 443, 344, "idle_bod", "idle_hair", my.sprite.player, "idle", "idle_h");

        // animated tile set-up
        this.animatedTiles.init(this.map);
    }

    update() {
        // console.log(my.sprite.player.x + ", " + my.sprite.player.y);
        this.Frank.update();
        this.updateDialogueBoxPosition();
        this.checkEnterBuilding();
        this.checkConversation();
       
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
    checkConversation() {
        if (this.dialogueActive && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            if (this.typing.isRunning) {
                this.typing.stop(); // Finish the line
                this.waitingForDialogue = true; // Wait for NEXT space
            } else if (this.waitingForDialogue) {
                this.showNextLine(); // Now go to next line
                this.waitingForDialogue = false;
            }
        }
        if (!this.dialogueActive && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.startDialogue([
                "Hey there, traveler!",
                "Don't go into the forest alone.",
                "You might not come back!"
            ]);
        }
    }

    updateDialogueBoxPosition() {
        let cam = this.cameras.main;
        const boxX = cam.scrollX + cam.width / 2// 2.25;
        const boxY = cam.scrollY + cam.height / 1.66; // 70px from the bottom
        const dialogueX = boxX - (this.dialogueBox.width - 10) / 2;
        const dialogueY = boxY - (this.dialogueBox.height - 10) / 2;

        this.dialogueBox.setPosition(boxX, boxY);
        this.dialogueText.setPosition(dialogueX, dialogueY);
    }
    startDialogue(lines) {
        this.waitingForAdvance = false;
        this.dialogueLines = lines;
        this.dialogueIndex = 0;

        this.dialogueBox.setVisible(true);
        this.dialogueText.setVisible(true);
        this.showNextLine();

        // lock player movement
        this.dialogueActive = true;
    }

    showNextLine() {
        if (this.dialogueIndex < this.dialogueLines.length) {
            const line = this.dialogueLines[this.dialogueIndex];
            this.typing.start(line);

            // Wait for typing to finish before advancing
            this.typing.once('complete', () => {
                this.dialogueIndex++;
                this.waitingForDialogue = true;
            });
        } else {
            this.endDialogue();
        } 
    }

    endDialogue() {
        this.dialogueBox.setVisible(false);
        this.dialogueText.setVisible(false);
        this.dialogueActive = false;
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