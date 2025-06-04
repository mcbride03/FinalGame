// key for anims array order:
//    0: idle, 1: walk, 2: attack, 3: damage, 4: death
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

        this.health = (enemyId == "Enemy_Goblin") ? 100 : 50; // Set health based on enemyId

        this.enemy = this.scene.physics.add.sprite(x, y, texture);
        this.enemy.setData('ref', this);  // Store reference to the Enemy class instance
        this.enemy.body.setSize(18, 18);
        this.enemy.body.setImmovable(true);
        this.enemy.setDepth(2);
        this.enemy.setDepth(2); // Set depth for correct layering

        // Play initial animation if available
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
        // Handle health/death state first
        if (this.isDead || this.isTakingDamage) {
            return; // If dead, do nothing else
        }

        if (this.health <= 0) {
            this.playDeath();
            return; // Prevent rest of update if dying
        }

        if (this.path.length <= 1 || this.nextStepIndex >= this.path.length) {
            this.playIdle();
            return;
        }
        
        const nextTile = this.path[this.nextStepIndex];
        const targetX = nextTile.x * this.map.tileWidth;
        const targetY = nextTile.y * this.map.tileHeight;

        const dx = targetX - this.enemy.x;
        const dy = targetY - this.enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const speed = 50;
        if (dist > 2) {
            this.enemy.setVelocity((dx / dist) * speed, (dy / dist) * speed);
            if (this.enemy.anims.currentAnim?.key !== this.anims[1]) {
                this.enemy.play(this.anims[1], true);
            }
        } else {
            this.nextStepIndex++;
        }
    }
    
    findPathToPlayer() {
        if (this.findingPath) return; // prevent overlap
        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
        const fromX = clamp(this.map.worldToTileX(this.enemy.x), 0, this.map.width - 1);
        const fromY = clamp(this.map.worldToTileY(this.enemy.y), 0, this.map.height - 1);
        const toX = clamp(this.map.worldToTileX(this.player.getX()), 0, this.map.width - 1);
        const toY = clamp(this.map.worldToTileY(this.player.getY()), 0, this.map.height - 1);
        
        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            
            if (path === null) {
                console.warn("Path was not found.");
            }
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