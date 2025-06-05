// Class for Enemy creation
// 
//    Parameter Guide:
//      scene ------------------------- spawn scene
//      x, y -------------------------- spawn location
//      texture ----------------------- sprite texture
//      player ------------------------ player object
//      anims ------------------------- array of animation keys
//      enemyId ----------------------- Id for enemy
//    ENEMY PATHFINDING:
//      finder ------------------------ easystar finder
//      tilemap ----------------------- scene map (this.map)
//      grid -------------------------- 2d array mapped by layers (use layers to grid function)
//
//    Key for anims array order:
//      0: idle, 1: walk, 2: attack, 3: damage, 4: death
class Enemy {
    constructor(scene, x, y, texture, player, anims, enemyId, finder, tilemap, grid){
        this.scene = scene;
        this.player = player;
        this.enemyId = enemyId;
        this.anims = anims;
        this.finder = finder;
        this.map = tilemap;
        this.grid = grid;
        
        this.canBeHit = true; 
        this.isDead = false;
        this.canAttack = true;

        this.health = (this.enemyId == "Enemy_Goblin") ? 100 : 50; // Set health based on enemyId

        this.enemy = this.scene.physics.add.sprite(x, y, texture);
        this.enemy.setData('ref', this);  // Store reference to the Enemy class instance
        this.enemy.body.setSize(16, 16);
        this.enemy.body.setImmovable(true);
        this.enemy.setDepth(2);
        this.enemy.setDepth(2); // Set depth for correct layering

        // Play idle animation if available
        if (this.anims[0]) {
            this.enemy.play(this.anims[0], true); // Ensure looping for idle animation
        }
        
        this.path = [];
        this.findingPath = false;
        this.nextStepIndex = 0;
        this.pathTimer = scene.time.addEvent({
            delay: 500,
            callback: () => this.findPathToPlayer(),
            loop: true
        });
        
    }

    update() {
        // skip update if dead or damaged
        if (this.isDead || this.isTakingDamage) return;

        // play death animation on death
        if (this.health <= 0) {
            this.playDeath();
            return;
        }

        // get distance between player and enemy
        const playerX = this.player.getX();
        const playerY = this.player.getY();
        const dx = playerX - this.enemy.x;
        const dy = playerY - this.enemy.y;
        const distToPlayer = Math.sqrt(dx * dx + dy * dy);

        const speed = 40;

        // If close enough to player, skip path and walk directly toward them
        if (distToPlayer < 20) {
            const len = distToPlayer || 1; // avoid dividing by 0
            this.enemy.setVelocity((dx / len) * speed, (dy / len) * speed); 
            // play walking animation if not currently walking
            if (this.enemy.anims.currentAnim?.key !== this.anims[1]) {
                this.enemy.play(this.anims[1], true);
            }
            return;
        }

        // If no path or at the end of the path, stop moving
        if (this.path.length <= 1 || this.nextStepIndex >= this.path.length) {
            this.enemy.setVelocity(0);
            this.playIdle();
            return;
        }

        // move toward next tile in path
        const nextTile = this.path[this.nextStepIndex];
        const targetX = nextTile.x * this.map.tileWidth + this.map.tileWidth / 2;
        const targetY = nextTile.y * this.map.tileHeight + this.map.tileHeight / 2;

        const dxPath = targetX - this.enemy.x;
        const dyPath = targetY - this.enemy.y;
        const distPath = Math.sqrt(dxPath * dxPath + dyPath * dyPath);

        // If not yet close enough to the tile, keep moving toward it
        if (distPath > 2) {
            this.enemy.setVelocity((dxPath / distPath) * speed, (dyPath / distPath) * speed);
            
            // Play walking animation
            if (this.enemy.anims.currentAnim?.key !== this.anims[1]) {
                this.enemy.play(this.anims[1], true); // walk
            }
        } else {
            // Reached current tile target, move to next
            this.nextStepIndex++;
        }
    }
    
    findPathToPlayer() {
        if (this.findingPath) return; // prevent overlap path requests
        
        // Helper to keep values inside map bounds
        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
        
        // Convert world coordinates to tile coordinates
        const fromX = clamp(this.map.worldToTileX(this.enemy.x), 0, this.map.width - 1);
        const fromY = clamp(this.map.worldToTileY(this.enemy.y), 0, this.map.height - 1);
        const toX = clamp(this.map.worldToTileX(this.player.getX()), 0, this.map.width - 1);
        const toY = clamp(this.map.worldToTileY(this.player.getY()), 0, this.map.height - 1);
        
        // use easystar to calculate a path
        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            
            if (path === null) {
                console.warn("Path was not found.");
            }
            // If a valid path was found, store it and reset step index
            if (path && path.length > 1) {
                this.path = path;
                this.nextStepIndex = 1;  // skip current position
            }
        });
        this.finder.calculate();
    }
    
    playIdle() {
        // Only play idle if not already playing it, and it's the right time
        if (this.enemy.anims.currentAnim?.key !== this.anims[0]) {
            this.enemy.play(this.anims[0], true); // Ensure loop if it's idle
        }
    }

    // This method is called from the Player's attack overlap.
    // It should ONLY be called once per hit.
    takeDamage(dmg) {
        // Prevent damage if dead or currently in an invincibility frame
        if (this.isDead || !this.canBeHit) {
            return;
        }

        this.isTakingDamage = true;
        this.health -= dmg; // Apply damage
        this.canBeHit = false;
        this.canAttack = false; 

        this.enemy.setVelocity(0);

        // Play damage animation
        this.enemy.play(this.anims[3], true); 
        
        // Listen for damage animation completion to revert animation
        // Use specific event name to avoid conflicts if needed
        this.enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE + "-" + this.anims[3], () => {
            // If not dead, return to idle/walk or appropriate state
            if (!this.isDead) {
                this.playIdle(); // Revert to idle after damage anim
                this.isTakingDamage = false;
            }
        });

        this.scene.time.delayedCall(900, () => {
            this.canBeHit = true; // Make enemy vulnerable again
            this.canAttack = true;
        });

    }

    playDeath() {
        if (this.isDead) return; // Prevent multiple death calls
        
        this.isDead = true;
        this.enemy.body.enable = false; // Disable physics
        this.enemy.setVelocity(0); // Stop movement

        this.enemy.play(this.anims[4], true); // Play death animation once

        // Listen for death animation completion
        this.enemy.once(Phaser.Animations.Events.ANIMATION_COMPLETE + "-" + this.anims[4], () => {
            if (this.enemyId == "Enemy_Goblin") {
                this.scene.goblinDefeated = true;
            }
            this.enemy.destroy(); // Destroy sprite after animation finishes
        });
    }
}