class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init(data) {
        // game state data and sword spawn location
        this.hasSword = data.hasSword || false;
        this.canPickupSword = data.canPickupSword || false;
        this.hasTalkedToFrank = data.hasTalkedToFrank || false;
        this.goblinDefeated = data.goblinDefeated || false;
        this.swordX = 426;
        this.swordY = 362;
    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // create map and tileset
        this.map = this.add.tilemap("topDown-level-1", 16, 16, 45, 25);
        this.tileset1 = this.map.addTilesetImage("tilemap_RPG", "tilemap_RPG");
        this.tileset = this.map.addTilesetImage("tilemap_new", "tilemap_new");

        // create layers from tiled
        this.groundLayer = this.map.createLayer("Ground", [this.tileset, this.tileset1], 0, 0);
        this.pathLayer = this.map.createLayer("Paths", [this.tileset, this.tileset1], 0, 0);
        this.buildingLayer = this.map.createLayer("Buildings", this.tileset, 0, 0);
        this.buildingWallLayer = this.map.createLayer("BuildingWalls", [this.tileset, this.tileset1], 0, 0);
        this.interior1Layer = this.map.createLayer("BuildingInterior1", [this.tileset, this.tileset1], 0, 0);
        this.interior2Layer = this.map.createLayer("BuildingInterior2", [this.tileset, this.tileset1], 0, 0);
        this.decorLayer = this.map.createLayer("Decor", [this.tileset, this.tileset1], 0, 0);
        this.roofLayer0 = this.map.createLayer("Roofs0", [this.tileset, this.tileset1], 0, 0).setDepth(4);
        this.roofLayer1 = this.map.createLayer("Roofs1", [this.tileset, this.tileset1], 0, 0).setDepth(5);
        this.roofLayer2 = this.map.createLayer("Roofs2", [this.tileset, this.tileset1], 0, 0).setDepth(6);
        this.chimneyLayer = this.map.createLayer("Chimney", [this.tileset, this.tileset1], 0, 0).setDepth(7);

        // set collision from tiled
        this.pathLayer.setCollisionByProperty({ collides: true });
        this.buildingLayer.setCollisionByProperty({ collides: true });
        this.buildingWallLayer.setCollisionByProperty({ collides: true });
        this.interior1Layer.setCollisionByProperty({ collides: true });
        this.interior2Layer.setCollisionByProperty({ collides: true });

        // spawn sword if player does not have it already
        if (!this.hasSword) {
            this.sword = this.physics.add.sprite(this.swordX, this.swordY, 'sword');
            this.sword.setDepth(2);
            this.sword.setImmovable(true);
        }

        // set up building zones so game knows when to remove roof layer
        this.roofZones = this.map.getObjectLayer("Objects").objects.filter(obj => obj.name === "RoofTriggers");
        this.buildingZones = this.roofZones.map(zone => {
            const z = this.add.zone(zone.x + zone.width / 2, zone.y - zone.height / 2, zone.width, zone.height);
            this.physics.world.enable(z);
            z.body.setAllowGravity(false);
            z.body.moves = false;
            return z;
        });
        
        // spawn player at the top left in the start of the game but 
        // if the goblin is defeated spawn them at the top of the northern path
        // give them the sword if game state says they have unlocked it
        this.spawnX = this.goblinDefeated ?  775 : 100;
        this.spawnY = this.goblinDefeated ?  25 : 100;
        this.playerObj = new Player(this, this.spawnX, this.spawnY, { hasSword: this.hasSword });
        this.player = this.playerObj.getContainer(); // For camera and collisions (player body)

        // layer collisions with player
        this.physics.add.collider(this.player, this.buildingLayer);
        this.physics.add.collider(this.player, this.pathLayer);
        this.physics.add.collider(this.player, this.buildingWallLayer);
        this.physics.add.collider(this.player, this.interior1Layer);
        this.physics.add.collider(this.player, this.interior2Layer);

        // camera set up
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(3.5);

        // player bounded to map size
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // load dialogue data
        const dialogueJson = this.cache.json.get('dialogueData');

        // NPC Creation (plan to make this more seamless in the future)
        // parameters described in NPC.js

        // flip npc to face left
        this.flipX = true;

        this.Frank = new Npc(this, 443, 344, "idle_bod", "idle_hair_spikey", null, this.player, "idle", "idle_h_spikey", null, dialogueJson.NPCs, "NPC_Frank");
        this.Farmer_0 = new Npc(this, 230, 294, "watering_bod", "watering_hair_long", "watering_tool", this.player, "watering_b", "watering_h_long","watering_t", dialogueJson.NPCs, "NPC_Farmer0");
        this.Farmer_1 = new Npc(this, 416, 555, "dig_bod", "dig_hair_mop","dig_tool", this.player, "dig_b", "dig_h_mop", "dig_t", dialogueJson.NPCs, "NPC_Farmer1");
        this.Farmer_2 = new Npc(this, 545, 512, "idle_bod", "idle_hair_long", null, this.player, "idle", "idle_h_long", null, dialogueJson.NPCs, "NPC_Farmer0");
        this.Farmer_3 = new Npc(this, 240, 500, "idle_bod", "idle_hair_short", null, this.player, "idle", "idle_h_short", null, dialogueJson.NPCs, "NPC_Farmer1");
        this.Farmer_4 = new Npc(this, 272, 157, "watering_bod", "watering_hair_long", "watering_tool", this.player, "watering_b", "watering_h_long","watering_t", dialogueJson.NPCs, "NPC_Farmer2");
        this.Farmer_5 = new Npc(this, 687, 427, "watering_bod", "watering_hair_short", "watering_tool", this.player, "watering_b", "watering_h_short","watering_t", dialogueJson.NPCs, "NPC_Farmer2", this.flipX);
        this.Lumberer_0 = new Npc(this, 96, 230, "axe_bod", "axe_hair_mop", "axe_tool", this.player, "axe_b", "axe_h_mop", "axe_t", dialogueJson.NPCs, "NPC_Lumber0", this.flipX);
        this.Lumberer_1 = new Npc(this, 800, 530, "axe_bod", "axe_hair_mop", "axe_tool", this.player, "axe_b", "axe_h_mop", "axe_t", dialogueJson.NPCs, "NPC_Lumber0", this.flipX);
        this.Lumberer_2 = new Npc(this, 976, 608, "axe_bod", "axe_hair_long", "axe_tool", this.player, "axe_b", "axe_h_long", "axe_t", dialogueJson.NPCs, "NPC_Lumber0", this.flipX);
        this.Hammerer_0 = new Npc(this, 592, 264, "hammer_bod", "hammer_hair_short", "hammer_tool", this.player, "hammer_b", "hammer_h_short", "hammer_t", dialogueJson.NPCs, "NPC_Hammerer0");
        
        // input
        cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // space key prompt for collecting sword
        this.spaceKey = this.add.sprite(0, 0, 'space', 0).setVisible(false).setDepth(5);

        // pick up sword after talking to frank, spacekey prompt plays on pickup
        if (this.sword) {
            this.physics.add.overlap(this.player, this.sword, () => {
                if (!this.canPickupSword) return;
                const cam = this.cameras.main;
                const x = cam.scrollX + cam.width / 2;
                const y = cam.scrollY + cam.height / 2;
                this.spaceKey.play('space');
                this.spaceKey.setPosition(x, y);
                this.spaceKey.setVisible(true);
                this.pickupSword();
                this.spaceKey.once("animationcomplete", () => {
                    this.spaceKey.setVisible(false);
                });
            });
        }
// ************** UI CREATION *****************************
        this.UI_space = this.add.sprite(-100, -100, 'SPACEKEY', 0)
            .setOrigin(0, 0)
            .setScale(0.5)
            .setDepth(100);
        this.UI_attack = this.add.bitmapText(-100, -100, 'font', 'Attack', 16)
            .setOrigin(0, 0)
            .setScale(0.5)
            .setTint(0xffffff)
            .setDepth(100);
        
        this.UI_z = this.add.sprite(10, 10, 'ZKEY', 0)
            .setOrigin(0, 0)
            .setScale(0.5)
            .setDepth(100);    
        this.UI_interact = this.add.bitmapText(10, 10, 'font', 'Interact', 16)
            .setOrigin(0, 0)
            .setScale(0.5)
            .setTint(0xffffff)
            .setDepth(100);
// ***********************************************************************

        // animated tile set up
        this.animatedTiles.init(this.map);
    }

    update() {

        // keeup UI updated
        this.updateUI();

        // update dialogue active and all NPCs (also plan to make this more seamless in the future)
        this.dialogueActive = this.Frank.update() | this.Farmer_0.update() | this.Farmer_1.update()
        | this.Farmer_2.update() | this.Farmer_3.update() | this.Farmer_4.update() |
        this.Farmer_5.update() | this.Lumberer_0.update() | this.Lumberer_1.update()|
        this.Lumberer_2.update() | this.Hammerer_0.update();

        // update player
        this.playerObj.update();

        // check if player enters building
        this.checkEnterBuilding();

        // if the player has the sword and takes the path north, load forest scene with updated game state
        if (this.player.body.x > 750 && this.player.body.x < 800 && this.player.body.y === 0 && this.playerObj.getHasSword()) {
            this.scene.start("forestScene", {
                hasSword: this.playerObj.getHasSword(),
                canPickupSword: this.canPickupSword,
                hasTalkedToFrank: this.hasTalkedToFrank,
                goblinDefeated: this.goblinDefeated
            });
        }
    }

    updateUI() {
        // helper function to keep UI in place with camera
        const cam = this.cameras.main;
        const x = cam.scrollX + cam.width / 2.75;
        const y = cam.scrollY + cam.height / 1.6;
        if (!this.playerObj.getHasSword()) {
            this.UI_interact.setPosition(x + this.UI_z.width, y);
            this.UI_z.setPosition(x, y);
            return;
        }
        this.UI_attack.setPosition(x + this.UI_space.width / 1.66, y);
        this.UI_space.setPosition(x, y);
        this.UI_interact.setPosition(x + this.UI_z.width, y - 20);
        this.UI_z.setPosition(x, y - 20);
    }

    pickupSword() {
        // update game state and destroy sword sprite on pick up
        this.playerObj.setHasSword(true);
        this.sword.destroy();
    }

    checkEnterBuilding() {
        // helper function to determine if player has entered buiding
        const playerX = this.player.body.center.x;
        const playerY = this.player.body.center.y;
        
        // default player outdoors
        let inside = false;

        // player inside if on zone
        for (let zone of this.buildingZones) {
            const zoneBounds = zone.getBounds();
            if (Phaser.Geom.Rectangle.Contains(zoneBounds, playerX, playerY)) {
                inside = true;
                break;
            }
        }

        // if inside hide roof layers, otherwise show them
        if (inside) {
            this.roofLayer1.setVisible(false);
            this.roofLayer2.setVisible(false);
            this.chimneyLayer.setVisible(false);
        } else {
            this.roofLayer1.setVisible(true);
            this.roofLayer2.setVisible(true);
            this.chimneyLayer.setVisible(true);
        }
    }
}