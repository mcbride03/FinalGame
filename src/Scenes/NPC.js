// Class for NPC creation
// 
//    Parameter Guide:
//      scene -------------- spawn scene
//      x, y --------------- spawn location
//      texture, texture1 -- body, hair -> respective sprite keys
//      player ------------- my.sprite.player
//      anim_b, anim_h ----- body, hair -> respective animation keys
//      
class Npc {
    constructor(scene, x, y, textureB, textureH, player, animB, animH, dialogueData, npcId) {
        this.scene = scene;
        this.dialogueIndex = 0;
        this.dialogueActive = false;
        this.waitingForAdvance = false;
        this.npcId = npcId;
        this.dialogueData = dialogueData;

        // Create visuals
        this.spriteB = this.scene.add.sprite(0, 0, textureB, 0);
        this.spriteH = this.scene.add.sprite(0, 0, textureH, 0);
        this.spriteB.play(animB);
        this.spriteH.play(animH);

        this.npc = this.scene.add.container(x, y, [this.spriteB, this.spriteH]);
        this.scene.physics.world.enable(this.npc);
        this.npc.body.setSize(16, 20).setCollideWorldBounds(true).setOffset(-8, -10);
        this.npc.body.moves = false;
        this.npc.setDepth(2);
        this.scene.physics.add.collider(player, this.npc);

        // Interaction zone
        this.interactZone = this.scene.add.zone(x, y, 32, 32);
        this.scene.physics.world.enable(this.interactZone);
        this.interactZone.body.setAllowGravity(false).setImmovable(true);
        this.inRange = false;
        this.scene.physics.add.overlap(player, this.interactZone, () => {
            this.inRange = true;
        });

        // Dialogue UI
        this.dialogueBox = this.scene.add.sprite(0, 0, "kenney_UI_atlas", "buttonLong_beige.png")
            .setOrigin(0.5)
            .setDepth(100)
            .setVisible(false);

        this.dialogueText = this.scene.add.bitmapText(0, 0, 'font', '', 16)
            .setOrigin(0, 0)
            .setDepth(101)
            .setScale(0.5)
            .setVisible(false);

        this.typing = this.scene.plugins.get('rextexttypingplugin').add(this.dialogueText, {
            speed: 50
        });

        this.interactKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update() {
        this.updateDialoguePosition();

        if (this.inRange && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            if (!this.dialogueActive) {
                this.startDialogue(this.dialogueLines);
            } else {
                if (this.typing.isRunning) {
                    this.typing.stop();
                    this.waitingForAdvance = true;
                } else if (this.waitingForAdvance) {
                    this.showNextLine();
                    this.waitingForAdvance = false;
                }
            }
        }
        this.inRange = false;
        return this.dialogueActive;
    }

    startDialogue() {
        const data = this.dialogueData[this.npcId];
        const lines = this.scene.goblinDefeated ? data.GoblinDead : (this.scene.hasTalkedtoFrank ? data.AfterIntro : data.Intro);

        this.dialogueLines = lines;
        this.dialogueIndex = 0;
        this.dialogueActive = true;

        this.dialogueBox.setVisible(true);
        this.dialogueText.setVisible(true);
        this.showNextLine();
    }

    showNextLine() {
        if (this.dialogueIndex < this.dialogueLines.length) {
            const line = this.dialogueLines[this.dialogueIndex];
            this.typing.start(line);
            this.typing.once('complete', () => {
                this.dialogueIndex++;
                this.waitingForAdvance = true;
            });
        } else {
            this.endDialogue();
        }
    }

    endDialogue() {
        this.dialogueBox.setVisible(false);
        this.dialogueText.setVisible(false);
        this.dialogueActive = false;
        this.hasTalked = true;

        if (this.npcId === "NPC_Frank") {
            this.scene.canPickupSword = this.hasTalked;
            this.scene.hasTalkedtoFrank = this.hasTalked;
        }
    }

    updateDialoguePosition() {
        const cam = this.scene.cameras.main;
        const x = cam.scrollX + cam.width / 2;
        const y = cam.scrollY + cam.height / 1.66;

        this.dialogueBox.setPosition(x, y);
        this.dialogueText.setPosition(x - (this.dialogueBox.width - 10) / 2, y - (this.dialogueBox.height - 10) / 2);
    }

    destroy() {
        this.npc.destroy();
        this.spriteB.destroy();
        this.spriteH.destroy();
        this.interactZone.destroy();
        this.dialogueBox.destroy();
        this.dialogueText.destroy();
    }
}
