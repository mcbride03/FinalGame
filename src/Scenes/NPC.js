// Class for NPC creation
// 
//    Parameter Guide:
//      scene -------------- spawn scene
//      x, y --------------- spawn location
//      texture, texture1 -- body, hair -> respective sprite keys
//      player ------------- my.sprite.player
//      anim_b, anim_h ----- body, hair -> respective animation keys
//      
class Npc extends Phaser.Scene {
    constructor(scene, x, y, texture, texture1, player, anim_b, anim_h) {
        super(scene, x, y, texture, texture1);

        scene.texture_b = scene.add.sprite(0, 0, texture, 0);
        scene.texture_h = scene.add.sprite(0, 0, texture1, 0);
        // npc creation
        this.npc = scene.add.container(x, y, [scene.texture_b, scene.texture_h]);


        //animation play
        scene.texture_b.play(anim_b);
        scene.texture_h.play(anim_h);

        // physics and collision for npcs
        scene.physics.world.enable(this.npc);
        this.npc.body.setCollideWorldBounds(true)
            .setSize(16, 20)
            .setOffset(-16 / 2, -16 / 2);
        this.npc.setDepth(2);
        scene.physics.add.collider(player, this.npc);
        this.npc.body.moves = false;    // make npc immovable

    }
    update(){

    }
    destroy() {
        super.destroy();
    }









}