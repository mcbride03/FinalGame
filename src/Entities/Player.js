// Class for Player creation
// 
//    Parameter Guide:
//      scene ------------------------- spawn scene
//      x, y -------------------------- spawn location
//      hasSword ---------------------- retrieve from game state
//
class Player {
    constructor(scene, x, y, hasSword) {
        this.scene = scene;
        this.hasSword = hasSword?.hasSword || false;
        this.isAttacking = false;
        this.swordDamage = 25;
        this.health = 100;
        this.takeDmg = false;
        this.canBeHit = true;
        this.isDead = false;
        this.isKnockedBack = false;

        // Create sprites
        this.playerBod = scene.add.sprite(0, 0, "idle_bod", 0);
        this.playerHair = scene.add.sprite(0, 0, "idle_hair", 0);
        this.playerTool = scene.add.sprite(0, 0, "idle_tool", 0).setVisible(false);

        // Group sprites into a container
        this.container = scene.add.container(x, y, [this.playerBod, this.playerHair, this.playerTool]).setDepth(2);

        // Enable physics
        scene.physics.world.enable(this.container);
        const body = this.container.body;
        body.setCollideWorldBounds(true);
        body.setSize(16, 16);
        body.setOffset(-8, -8);

        // sword hitbox creation
        this.attackHitbox = this.scene.physics.add.sprite(0, 0, null);
        this.attackHitbox.setSize(24, 28);
        this.attackHitbox.setVisible(false);
        this.attackHitbox.body.allowGravity = false;
        this.attackHitbox.body.enable = false; // disable initially

        // Load Restart UI and hide visibility
        this.restartBox = this.scene.add.sprite(0, 0, "kenney_UI_atlas", "buttonLong_brown.png")
            .setOrigin(0.5)
            .setDepth(100)
            .setScale(1)
            .setVisible(false);
        this.restartText = this.scene.add.bitmapText(0, 0, 'font', '', 16, 1)
            .setOrigin(0, 0)
            .setDepth(101)
            .setScale(1)
            .setTint("0xffffff")
            .setVisible(false);

        // Input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.restartKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // vvvv uncomment below for attack debugging vvvv
        // this.hasSword = true;
        // this.debugGraphics = this.scene.add.graphics();
        // this.debugGraphics.setDepth(100); // Ensure it draws on top   

    }

    update() {

        // if dead and press R restart the scene
        if (this.isDead && this.restartKey && Phaser.Input.Keyboard.JustDown(this.restartKey)) {
            this.scene.scene.restart(); // Restart the scene
        }
        
        // if dead skip the rest of update
        if (this.isDead) return;

        // if dying play death animation and skip rest of update
        if (this.health <= 0 && !this.isDead) {
            this.playDeath();
            return;
        }

        // if taking damage play damage animation and kock player back
        if (this.takeDmg) {
            this.playDamage();
            if (!this.isKnockedBack) { 
                this.container.body.setVelocity(0); 
            } 
        }

        // lock player movement for knockback and dialogue but set velocity to 0 for dialogue only
        if (this.isKnockedBack) {} 
        else if (this.scene.dialogueActive) {
             this.container.body.setVelocity(0); // Stop player input for dialogue
        } else {
            // Only allow player movement if not knocked back AND not in dialogue
            this.playerMovement();
        }

        // Update attack hitbox position if attacking
        if (this.isAttacking) {
            this.updateAttackHitboxPosition();
        }

        // Allow attack input unless dialogue active or already attacking
        if (!this.isAttacking && !this.takeDmg && !this.isDead && !this.isKnockedBack && !this.scene.dialogueActive && this.hasSword && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.attack();
        }
        // this.drawDebugHitbox(); // Uncomment for debugging (shows sword hitbox)
    }

    playerMovement() {
        const SPEED = 75;
        const body = this.container.body;
        const { left, right, up, down } = this.cursors;
        body.setVelocity(0);

        let moving = false;
        if (up.isDown) {
            body.setVelocityY(-SPEED);
            moving = true;
        } else if (down.isDown) {
            body.setVelocityY(SPEED);
            moving = true;
        } 
        
        if (left.isDown) {
            body.setVelocityX(-SPEED);
            this.setFlip(true);
            moving = true;
        } else if (right.isDown) {
            body.setVelocityX(SPEED);
            this.setFlip(false);
            moving = true;
        }

        // ******* ANIMATION PRIORITIZATION LOGIC *******
        // Only play walk/idle animations if not currently attacking or taking damage
        if (!this.isAttacking && !this.takeDmg) { // Also check !this.takeDmg for damage animation
            if (moving) {
                // Check if already playing walk to avoid restarting it unnecessarily
                if (this.playerBod.anims.currentAnim?.key !== "walk") {
                    this.playerBod.play("walk", true);
                    this.playerHair.play("walk_h", true);
                }
            } else {
                // Check if already playing idle to avoid restarting it unnecessarily
                if (this.playerBod.anims.currentAnim?.key !== "idle") {
                    this.playerBod.play("idle", true);
                    this.playerHair.play("idle_h", true);
                }
            }
        }
        // ***********************************************
    }

    setFlip(flip) {
        this.playerBod.setFlipX(flip);
        this.playerHair.setFlipX(flip);
        this.playerTool.setFlipX(flip);
    }

    attack() {
        // Prevent starting a new attack if one is already in progress
        if (this.isAttacking) return; 

        this.isAttacking = true;
        this.attackAnims();
        
        // Enable hitbox immediately, its position will be updated in update()
        this.attackHitbox.body.enable = true;
    }

    attackAnims() {
        this.playerTool.setVisible(true);
        this.playerBod.play("attack", true); // Ensure true for non-looping animations
        this.playerHair.play("attack_h", true);
        this.playerTool.play("attack_t", true);

        // Listen for the 'attack' animation to complete on the body
        this.playerBod.once("animationcomplete-attack", () => { // Specific event for 'attack' anim
            this.playerTool.setVisible(false);
            this.attackHitbox.setPosition(0,0); // Reset hitbox position
            this.attackHitbox.body.enable = false; // Disable hitbox when attack animation is done
            this.isAttacking = false;
        });
    }

    // update hitbox position dynamically
    updateAttackHitboxPosition() {
        const playerX = this.container.body.x + this.container.body.width / 2;
        const playerY = this.container.body.y + this.container.body.height / 2;

        const facingRight = !this.playerBod.flipX;
        const offsetX = facingRight ? 12 : -12; 
        const offsetY = -5; 

        this.attackHitbox.setPosition(playerX + offsetX, playerY + offsetY);
    }

    playDamage() {
        // Prevent playing damage if already playing death or damage
        if (this.isDead || this.playerBod.anims.currentAnim?.key === "damage_b") return;
        
        // Cancel attack if mid-swing
        if (this.isAttacking) {
            this.isAttacking = false;
            this.attackHitbox.body.enable = false;
            this.attackHitbox.setPosition(0, 0);
            this.playerTool.setVisible(false);
        }

        this.takeDmg = true;
        this.canBeHit = false; // Prevent further hits during damage animation

        this.playerBod.play("damage_b", true); // Play damage animation
        this.playerHair.play("damage_h", true);

        // Once damage animation is complete, reset flags
        this.playerBod.once("animationcomplete-damage_b", () => {
            this.takeDmg = false;
            this.scene.time.delayedCall(200, () => {
                this.canBeHit = true;
            });
        });
    }

    playDeath() {
        // skip if animation is in progress
        if (this.isDead || this.playerBod.anims.currentAnim?.key === "death_b") return;
        // set death flag and cancel and attacks
        this.isDead = true;
        this.cancelAttack();

        // stop player movement, play death animation, disable hitbox
        this.container.body.setVelocity(0, 0);
        this.container.body.enable = false;
        // this.attackHitbox.body.enable = false;
        this.playerBod.play("death_b", true);
        this.playerHair.play("death_h", true);

        // on completion of animation prompt respawn UI and allow player to restart
        this.playerBod.once("animationcomplete-death_b", () => {
            this.container.setVisible(false);
            const cam = this.scene.cameras.main;
            const centerX = cam.scrollX + cam.width / 2;
            const centerY = cam.scrollY + cam.height / 2;

            this.restartBox.setPosition(centerX, centerY);
            this.restartBox.setVisible(true);

            this.restartText.setText("YOU DIED\nPress R to Restart");
            this.restartText.setPosition(centerX - this.restartText.width / 2, centerY - this.restartText.height / 2);
            this.restartText.setVisible(true);
        });
    }

    knockback(fromX, fromY) {
        // cancel any attacks when knocked back
        if (this.isAttacking) {
            this.cancelAttack();
        }
        const body = this.container.body;

        // distance from player to enemy
        const dx = body.x - fromX;
        const dy = body.y - fromY;

        // straight line length to player from entity, default 1 to avoid division by 0 (pythagorean thm)
        const length = Math.sqrt(dx * dx + dy * dy) || 1;
        // calculate unit vector
        const normalizedX = dx / length;
        const normalizedY = dy / length;

        const knockbackForce = 100; // Tweakable value
        
        // set knockback flag and execute knockback
        this.isKnockedBack = true; 
        body.setVelocity(normalizedX * knockbackForce, normalizedY * knockbackForce);

        // freeze input for a moment and then release knockback state
        this.scene.time.delayedCall(200, () => { 
            body.setVelocity(0); // Stop movement after knockback
            this.isKnockedBack = false; // reset knockback flag
        });
    }
    cancelAttack() {
        // cancel attack and reset hitbox
        this.isAttacking = false;
        this.playerTool.setVisible(false);
        this.attackHitbox.body.enable = false;
        this.attackHitbox.setPosition(0, 0);
    }

    getContainer() {
        return this.container;
    }

    getBody() {
        return this.container.body;
    }

    getX() {
        return this.container.body.x;
    }

    getY() {
        return this.container.body.y;
    }

    getHasSword() {
        return this.hasSword;
    }

    setHasSword(value) {
        this.hasSword = value;
    }

    drawDebugHitbox() {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(1, 0xff0000, 1); // red for visual clarity
        const body = this.attackHitbox.body;
        this.debugGraphics.strokeRect(body.x, body.y, body.width, body.height);
    }
}