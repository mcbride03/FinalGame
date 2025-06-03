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

        this.grid = this.layersToGrid([this.pathLayer]);
        this.finder = new EasyStar.js();
        this.finder.setGrid(this.grid);
        this.finder.setAcceptableTiles([0, 522, 523, 460, 68, 458, 459]);

        // collision
        this.treeLayer.setCollisionByProperty({ collides: true });

        this.enemies = this.physics.add.group();

        this.playerObj = new Player(this, this.map.widthInPixels / 2, this.map.heightInPixels - 25, { hasSword: this.hasSword }, this.enemies);
        this.player = this.playerObj.getContainer();
        this.player.setDepth(3);

        this.physics.add.collider(this.player, this.treeLayer);

        if (!this.goblinDefeated) {
            this.goblinSpawnX = this.map.widthInPixels / 2;
            this.goblinSpawnY = this.map.heightInPixels / 4;
            this.goblin = new Enemy(this, this.goblinSpawnX, this.goblinSpawnY, "idle_gob", this.playerObj, 
                ["idle_g", "walk_g", "attack_g", "damage_g", "death_g"], "Enemy_Goblin", this.finder, this.map, this.grid);
            this.enemies.add(this.goblin.enemy);
            this.goblin.enemy.body.setImmovable(true);
        }
        
        this.physics.add.collider(this.player, this.enemies, (player, enemySprite) => {
            const enemy = enemySprite.getData('ref');
            if (enemy && this.playerObj.canBeHit && !this.playerObj.isDead) {
                this.playerObj.health -= 25;
                this.playerObj.takeDmg = true;
                this.playerObj.canBeHit = false;

                // Knockback!
                this.playerObj.knockback(enemySprite.x, enemySprite.y);
            }   
        });

        this.physics.add.overlap(this.playerObj.attackHitbox, this.enemies, (hitbox, enemySprite) => {
            const enemy = enemySprite.getData('ref');
            if (enemy && enemy.canBeHit) {
                this.time.delayedCall(300, () => {
                    enemy.takeDamage(this.playerObj.swordDamage); 
                });
            }
        });

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(3.5);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.cursors = this.input.keyboard.createCursorKeys();

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
    }

    update() {
        this.updateUI();
        this.playerObj.update();

        if (this.goblin) {
            this.goblin.update();
        }

        if (this.goblinDefeated && this.player.body.y >= 455) {
            this.scene.start("gameScene", {
                hasSword: this.playerObj.getHasSword(),
                canPickupSword: this.canPickupSword,
                hasTalkedToFrank: this.hasTalkedToFrank,
                goblinDefeated: this.goblinDefeated
            });
        }
    }
    updateUI() {
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

    layersToGrid(layers) {
        let grid = [];
        for (let y = 0; y < this.map.height; y++) {
            let row = [];
            for (let x = 0; x < this.map.width; x++) {
                let tileId = 0;
                for (let layer of layers) {
                    const tile = layer.getTileAt(x, y);
                    if (tile) {
                        tileId = tile.index;
                    }
                }
                row.push(tileId);
            }
            grid.push(row);
        }
        return grid;
    }
}