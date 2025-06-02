class Enemy {
    constructor(scene, x, y, texture, player, anim_idle, anim_walk, anim_attack, enemyId){
        this.scene = scene;
            this.enemy = this.physics.add.sprite(x, y, texture);
            this.enemy.body.setSize(16, 16);
            this.enemy.play(anim_idle);
        
    }
    update() {

    }
}
