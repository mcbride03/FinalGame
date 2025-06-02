class Forest extends Phaser.Scene {
    constructor() {
        super("forestScene");
    }

    init(data) {
        this.hasSword = data.hasSword || false;
        this.canPickupSword = data.canPickupSword || false;
        this.hasTalkedToFrank = data.hasTalkedToFrank || false;
        this.goblinDefeated = data.goblinDefeated || false;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // ... tilemap and layer setup ...
        this.map = this.add.tilemap("topDown-level-2", 16, 16, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("tilemap_new", "tilemap_new");

        // create layers
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.pathLayer = this.map.createLayer("Paths", this.tileset, 0, 0);
        this.treeLayer = this.map.createLayer("Trees", this.tileset, 0, 0);

        // collision
        this.treeLayer.setCollisionByProperty({ collides: true });


        this.playerObj = new Player(this, this.map.widthInPixels / 2, this.map.heightInPixels - 25, { hasSword: this.hasSword });
        this.player = this.playerObj.getContainer();

        this.physics.add.collider(this.player, this.treeLayer);

        if (!this.goblinDefeated) {
            this.goblin = this.physics.add.sprite(this.map.widthInPixels / 2, this.map.heightInPixels / 4, "idle_gob");
            this.goblin.body.setSize(16, 16);
            this.goblin.play("idle_g");
        }
        
        if (this.goblin) {
            this.physics.add.overlap(this.player, this.goblin, () => {
                this.goblin.destroy();
                this.goblinDefeated = true;
            });
        }

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(3.5);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.playerObj.update();

        if (this.goblinDefeated && this.player.body.y >= 455) {
            this.scene.start("gameScene", {
                hasSword: this.playerObj.getHasSword(),
                canPickupSword: this.canPickupSword,
                hasTalkedToFrank: this.hasTalkedToFrank,
                goblinDefeated: this.goblinDefeated
            });
        }
    }
}


/* class Forest extends Phaser.Scene {
    constructor() {
        super("forestScene");
    }
    init(data) {
        this.MAX_SPEED = 75;
        this.SCALE =  3.5;
        this.inBuilding = false;
        this.waitingForDialogue = false;
        this.dialogueActive = false;
        this.isAttacking = false;

        // Import from gameScene
        this.hasSword = data.hasSword || false;
        this.canPickupSword = data.canPickupSword || false;
        this.hasTalkedToFrank = data.hasTalkedToFrank || false;
        this.goblinDefeated = data.goblinDefeated || false;
    }
    preload () {
        // animated tile setup
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        this.map = this.add.tilemap("topDown-level-2", 16, 16, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        //this.tileset1 = this.map.addTilesetImage("tilemap_RPG", "tilemap_RPG");
        this.tileset = this.map.addTilesetImage("tilemap_new", "tilemap_new");

// ============================== Create all layers  =================================================== //
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.pathLayer = this.map.createLayer("Paths", this.tileset, 0, 0);
        this.treeLayer = this.map.createLayer("Trees", this.tileset, 0, 0);
// ===================================================================================================== //

        
        // Make layers collidable
        this.treeLayer.setCollisionByProperty({
            collides: true
        });

        // Create and store parts of player sprite
        this.playerBod = this.add.sprite(0, 0, "idle_bod", 0);
        this.playerHair = this.add.sprite(0, 0, "idle_hair", 0);
        this.playerTool = this.add.sprite(0, 0, "idle_ tool", 0);
        this.playerTool.setVisible(false);

        // Start idle animations
        this.playerBod.play("idle");
        this.playerHair.play("idle_h");

        // Group Parts in a player container
        my.sprite.player = this.add.container(this.map.widthInPixels/2, this.map.heightInPixels - 25, [this.playerBod, this.playerHair, this.playerTool]).setDepth(2);

        // Set physics body properties
        this.physics.world.enable(my.sprite.player);
        let body = my.sprite.player.body;
        body.setCollideWorldBounds(true);
        body.setSize(16, 16);
        body.setOffset(-16 / 2, -16 / 2);

        // collision
        this.physics.add.collider(my.sprite.player, this.treeLayer);

        // Camera to follow player
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(this.SCALE);
        
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // NPC creation
        if(!this.goblinDefeated) {
            this.goblin = this.add.sprite(this.map.widthInPixels/2, this.map.heightInPixels/4, 'idle_gob');
            this.goblin.play("idle_g");
        }

        cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        
        // animated tile set-up
        this.animatedTiles.init(this.map);
    }

    update() {
        console.log(my.sprite.player.body.x + ' ' + my.sprite.player.body.y + ' ' + this.goblinDefeated);

        // player movement
        my.sprite.player.body.setVelocity(0);
        if (!this.dialogueActive && !this.isAttacking) {
            this.updatePlayerMovement();
        }
        // player attack
        if (!this.dialogueActive && this.hasSword && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.updatePlayerAttack();
        }

        // player leaves scene
        if (this.goblinDefeated && (my.sprite.player.body.y >= 455)) {
            this.scene.start("gameScene", {
                hasSword: this.hasSword,
                canPickupSword: this.canPickupSword,
                hasTalkedToFrank: this.hasTalkedToFrank,
                goblinDefeated: this.goblinDefeated
            });
        }

    }

    updatePlayerAttack(){
        if (!this.isAttacking) {
            this.isAttacking = true;
            this.playerTool.setVisible(true);
            this.playerBod.play("attack");
            this.playerHair.play("attack_h");
            this.playerTool.play("attack_t");
            this.playerBod.once("animationcomplete", () => {
                this.isAttacking = false;
                this.playerTool.setVisible(false);
            });
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
            this.playerTool.setFlipX(true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(this.MAX_SPEED);
            this.playerBod.setFlipX(false);
            this.playerHair.setFlipX(false);
            this.playerTool.setFlipX(false);
        }

        if (cursors.up.isDown) {
            player.setVelocityY(-this.MAX_SPEED);
        } else if (cursors.down.isDown) {
            player.setVelocityY(this.MAX_SPEED);
        }
    }
}
*/