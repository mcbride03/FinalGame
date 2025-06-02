class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init(data) {
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

        this.roofZones = this.map.getObjectLayer("Objects").objects.filter(obj => obj.name === "RoofTriggers");
        this.buildingZones = this.roofZones.map(zone => {
            const z = this.add.zone(zone.x + zone.width / 2, zone.y - zone.height / 2, zone.width, zone.height);
            this.physics.world.enable(z);
            z.body.setAllowGravity(false);
            z.body.moves = false;
            return z;
        });

        this.spawnX = this.goblinDefeated ?  775 : 100;
        this.spawnY = this.goblinDefeated ?  25 : 100;
        this.playerObj = new Player(this, this.spawnX, this.spawnY, { hasSword: this.hasSword });
        this.player = this.playerObj.getContainer(); // For camera and collisions

        this.physics.add.collider(this.player, this.buildingLayer);
        this.physics.add.collider(this.player, this.pathLayer);
        this.physics.add.collider(this.player, this.buildingWallLayer);
        this.physics.add.collider(this.player, this.interior1Layer);
        this.physics.add.collider(this.player, this.interior2Layer);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(3.5);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        const dialogueJson = this.cache.json.get('dialogueData');
        this.Frank = new Npc(this, 443, 344, "idle_bod", "idle_hair", this.player, "idle", "idle_h", dialogueJson.NPCs, "NPC_Frank");

        cursors = this.input.keyboard.createCursorKeys();
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.spaceKey = this.add.sprite(0, 0, 'space', 0).setVisible(false).setDepth(5);

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

        this.animatedTiles.init(this.map);
    }

    update() {
        this.dialogueActive = this.Frank.update();

        this.playerObj.update();

        this.checkEnterBuilding();

        if (this.player.body.x > 750 && this.player.body.x < 800 && this.player.body.y === 0 && this.playerObj.getHasSword()) {
            this.scene.start("forestScene", {
                hasSword: this.playerObj.getHasSword(),
                canPickupSword: this.canPickupSword,
                hasTalkedToFrank: this.hasTalkedToFrank,
                goblinDefeated: this.goblinDefeated
            });
        }
    }

    pickupSword() {
        this.playerObj.setHasSword(true);
        this.sword.destroy();
    }

    checkEnterBuilding() {
        const playerX = this.player.body.center.x;
        const playerY = this.player.body.center.y;
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