class Title extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }
    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.title = this.add.sprite(1440/2, 900/2, 'titleScreen');
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.scene.start("gameScene");
        }
    }
}