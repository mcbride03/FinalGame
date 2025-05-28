class Load extends Phaser.Scene {
    
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load character spritesheet
        this.load.atlas("topdown_characters", "/kenney_roguelike-characters/Spritesheet/roguelikeChar_transparent.png", "roguelikeChar_transparent.json")
        // this.load.atlas("sunny_character_idle","/Sunnyside_World_Assets/Chracters/Human/IDLE/base_idle_strip9.png", "")

        // Load tilemap information
        this.load.image("kenney_Indoor", "kenney_roguelike-indoors/Tilesheets/roguelikeIndoor_transparent.png");
        this.load.image("kenney_RPG", "kenney_roguelike-rpg-pack/Spritesheet/roguelikeSheet_transparent.png");
        this.load.image("kenny_UI", "kenney_ui-pack-rpg-expansion/Spritesheet/uipack_rpg_sheet.png");
        this.load.image("sunnyside_tilemap", "Sunnyside_World_Assets/Tileset/spr_tileset_sunnysideworld_16px.png");
        
// ============================================== Load Player Spritesheets (includes animation frames) ======================================================================== //

      // ------IDLE ------
        // base
        this.load.spritesheet('idle_bod', 'Sunnyside_World_Assets/Characters/Human/IDLE/base_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('idle_hair', 'Sunnyside_World_Assets/Characters/Human/IDLE/curlyhair_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });

      // ------ WALK ------
        // base
        this.load.spritesheet('walk_bod', 'Sunnyside_World_Assets/Characters/Human/Walking/base_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('walk_hair', 'Sunnyside_World_Assets/Characters/Human/WALKING/curlyhair_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });

// ====================================================================================================================================================================== //


        this.load.tilemapTiledJSON("topDown-level-1", "topDown-level-1.tmj");   // Tilemap in JSON

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_RPG", "kenney_roguelike-rpg-pack/Spritesheet/roguelikeSheet_transparent.png", {
            frameWidth: 16,
            frameHeight: 16,
            tileSpacing: 1
        });
        this.load.spritesheet("tilemap_new", "Sunnyside_World_Assets/Tileset/spr_tileset_sunnysideworld_16px.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    create() {
    
        // idle body animation
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('idle_bod', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        // idle hair animation
        this.anims.create({
            key: 'idle_h',
            frames: this.anims.generateFrameNumbers('idle_hair', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        // walk body animation
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('walk_bod', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.anims.create({
            key: 'walk_h',
            frames: this.anims.generateFrameNumbers('walk_hair', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });



        this.scene.start("gameScene");
    }
    update() {

    }
}