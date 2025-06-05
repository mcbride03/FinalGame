// Forest scene, player fights goblin here
class Forest extends Phaser.Scene {
    constructor() {
        super("forestScene");
    }

    init(data) {
        // game state data
        this.hasSword = data.hasSword || false;
        this.canPickupSword = data.canPickupSword || false;
        this.hasTalkedToFrank = data.hasTalkedToFrank || false;
        this.goblinDefeated = data.goblinDefeated || false;
    }

    preload() {
        // load animated tiles if there are any
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // ... tilemap and layer setup ...
        this.map = this.add.tilemap("topDown-level-2", 16, 16, 45, 25);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("tilemap_new", "tilemap_new");

        // create layers
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
        this.pathLayer = this.map.createLayer("Paths", this.tileset, 0, 0);
        this.treeLayer = this.map.createLayer("Trees", this.tileset, 0, 0);

        // set up easystar
        this.grid = this.layersToGrid([this.pathLayer]);
        this.finder = new EasyStar.js();
        this.finder.setGrid(this.grid);
        this.finder.setAcceptableTiles([0, 522, 523, 460, 68, 458, 459]);

        // tree collision setup
        this.treeLayer.setCollisionByProperty({ collides: true });

        // create enemy group
        this.enemies = this.physics.add.group();

        // create player with saved game state
        this.playerObj = new Player(this, this.map.widthInPixels / 2, this.map.heightInPixels - 25, { hasSword: this.hasSword });
        this.player = this.playerObj.getContainer();
        this.player.setDepth(3);

        // player collision on tree layer
        this.physics.add.collider(this.player, this.treeLayer);

        // spawn goblin if he is not yet defeated
        if (!this.goblinDefeated) {
            this.goblinSpawnX = this.map.widthInPixels / 2;
            this.goblinSpawnY = this.map.heightInPixels / 4;
            
            // create goblin as enemy class; pass: scene, spawn loaction, player, animations/sprites, enemy key, and finder/map/grid for easystar
            this.goblin = new Enemy(this, this.goblinSpawnX, this.goblinSpawnY, "idle_gob", this.playerObj, 
                ["idle_g", "walk_g", "attack_g", "damage_g", "death_g"], "Enemy_Goblin", this.finder, this.map, this.grid);
            this.enemies.add(this.goblin.enemy);    //add goblin to enemy group
            this.goblin.enemy.body.setImmovable(true);
            this.physics.add.collider(this.goblin.enemy, this.treeLayer);

        }
        
        // player takes damage if they collide with enemy
        this.physics.add.collider(this.player, this.enemies, (player, enemySprite) => {
            const enemy = enemySprite.getData('ref');
            if (enemy && this.playerObj.canBeHit && !this.playerObj.isDead && enemy.canAttack) {
                this.playerObj.health -= 25;
                this.playerObj.takeDmg = true;
                this.playerObj.canBeHit = false;

                // Knockback player when hit
                this.playerObj.knockback(enemySprite.x, enemySprite.y);
            }
        });

        // enemy takes damage if hit by attack hitbox 
        this.physics.add.overlap(this.playerObj.attackHitbox, this.enemies, (hitbox, enemySprite) => {
            const enemy = enemySprite.getData('ref');
            enemy.canAttack = false;
            if (enemy && enemy.canBeHit) {
                this.time.delayedCall(100, () => {
                    // enemy.canAttack = true;
                    enemy.takeDamage(this.playerObj.swordDamage); 
                });
            }
        });

        // camera set up
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(75, 75);
        this.cameras.main.setZoom(3.5);

        // limit player to map
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // input
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
        // keep UI moving with camera
        this.updateUI();

        // update player
        this.playerObj.update();

        // if goblin is spawned update
        if (this.goblin) {
            this.goblin.update();
        }

        // if goblin defeated and the player leaves map
        // send player back to the town with updated game state
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

    layersToGrid(layers) {
        // helper function to translate tilemap to 2d array for easystar
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