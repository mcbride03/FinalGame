// Class for NPC creation
// 
//    Parameter Guide:
//      scene ------------------------- spawn scene
//      x, y -------------------------- spawn location
//      textureB, textureH, textureT -- body, hair -> respective sprite keys
//      player ------------------------ my.sprite.player
//      anim_b, anim_h, anim_t -------- body, hair -> respective animation keys
//      dialogueData ------------------ JSON
//      npcId ------------------------- key as it shows in JSON
//      flip -------------------------- flip sprites horizontally
//
class Npc {
    constructor(scene, x, y, textureB, textureH, textureT, player, animB, animH, animT, dialogueData, npcId, flip) {
        this.scene = scene;
        this.dialogueIndex = 0;
        this.dialogueActive = false;
        this.waitingForAdvance = false;
        this.npcId = npcId;
        this.dialogueData = dialogueData;
        this.worldX = x;
        this.worldY = y;
        this.flip = flip

        // Create visuals
        this.spriteB = this.scene.add.sprite(0, 0, textureB, 0);
        this.spriteH = this.scene.add.sprite(0, 0, textureH, 0);
        this.spriteB.play(animB);
        this.spriteH.play(animH);
        if (textureT && animT) {
            this.spriteT = this.scene.add.sprite(0, 0, textureT, 0);
        }


        this.spawnCentered();

        let npcParts = [this.spriteB, this.spriteH];
        if (this.spriteT) {
            npcParts.push(this.spriteT);
            this.spriteT.play(animT);
        }

        for (let part of npcParts) {
            part.setFlipX(this.flip);
        }

        this.npc = this.scene.add.container(this.worldX, this.worldY, npcParts);        
        this.scene.physics.world.enable(this.npc);
        this.npc.body.setSize(16, 18).setCollideWorldBounds(true).setOffset(-8, -10);
        this.npc.body.moves = false;
        this.npc.setDepth(2);
        this.scene.physics.add.collider(player, this.npc);

        // Interaction zone
        this.interactZone = this.scene.add.zone(this.worldX, this.worldY, 32, 32);
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
            speed: 25
        });
    }

    update() {
        this.updateDialoguePosition();

        if (this.inRange && Phaser.Input.Keyboard.JustDown(this.scene.interactKey)) {
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

    spawnCentered() {
        const tileX = Math.floor(this.worldX / this.scene.map.tileWidth);
        const tileY = Math.floor(this.worldY / this.scene.map.tileHeight);

        this.worldX = tileX * this.scene.map.tileWidth + this.scene.map.tileWidth / 2;
        this.worldY = tileY * this.scene.map.tileHeight + this.scene.map.tileHeight / 2;
    }
}
