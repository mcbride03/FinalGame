class Player {
    constructor(scene, x, y, data) {
        this.scene = scene;
        this.hasSword = data?.hasSword || false;
        this.isAttacking = false;

        // Create sprites
        this.playerBod = scene.add.sprite(0, 0, "idle_bod", 0);
        this.playerHair = scene.add.sprite(0, 0, "idle_hair", 0);
        this.playerTool = scene.add.sprite(0, 0, "idle_tool", 0).setVisible(false);

        // Group into a container
        this.container = scene.add.container(x, y, [this.playerBod, this.playerHair, this.playerTool]).setDepth(2);

        // Enable physics
        scene.physics.world.enable(this.container);
        const body = this.container.body;
        body.setCollideWorldBounds(true);
        body.setSize(16, 16);
        body.setOffset(-8, -8);

        // Input
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        const body = this.container.body;
        body.setVelocity(0);

        if (!this.scene.dialogueActive && !this.isAttacking) {
            this.playerMovement();
        }

        if (!this.isAttacking && !this.scene.dialogueActive && this.hasSword && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.attack();
        }
    }

    playerMovement() {
        const SPEED = 75;
        const body = this.container.body;
        const { left, right, up, down } = this.cursors;

        if (left.isDown || right.isDown || up.isDown || down.isDown) {
            this.playerBod.play("walk", true);
            this.playerHair.play("walk_h", true);
        } else {
            this.playerBod.play("idle", true);
            this.playerHair.play("idle_h", true);
        }

        if (left.isDown) {
            body.setVelocityX(-SPEED);
            this.setFlip(true);
        } else if (right.isDown) {
            body.setVelocityX(SPEED);
            this.setFlip(false);
        }

        if (up.isDown) {
            body.setVelocityY(-SPEED);
        } else if (down.isDown) {
            body.setVelocityY(SPEED);
        }
    }

    setFlip(flip) {
        this.playerBod.setFlipX(flip);
        this.playerHair.setFlipX(flip);
        this.playerTool.setFlipX(flip);
    }

    attack() {
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
}
