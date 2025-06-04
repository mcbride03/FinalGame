class Load extends Phaser.Scene {
    
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.plugin('rextagtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextagtextplugin.min.js', true);
        this.load.plugin('rextexttypingplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttypingplugin.min.js', true);  

        this.load.json('dialogueData', 'src/Scenes/Dialogue.json');

        this.load.setPath("./assets/");

        this.load.image('titleScreen', 'TitleScreen.png');
        this.load.image('sword', 'Sunnyside_World_Assets/UI/sword.png');
        // Load character spritesheet
        this.load.atlas("topdown_characters", "/kenney_roguelike-characters/Spritesheet/roguelikeChar_transparent.png", "roguelikeChar_transparent.json")
        // this.load.atlas("sunny_character_idle","/Sunnyside_World_Assets/Chracters/Human/IDLE/base_idle_strip9.png", "")

        // Load tilemap information
        this.load.image("kenney_Indoor", "kenney_roguelike-indoors/Tilesheets/roguelikeIndoor_transparent.png");
        this.load.image("kenney_RPG", "kenney_roguelike-rpg-pack/Spritesheet/roguelikeSheet_transparent.png");
        this.load.atlasXML("kenney_UI_atlas", "kenney_ui-pack-rpg-expansion/Spritesheet/uipack_rpg_sheet.png", "kenney_ui-pack-rpg-expansion/Spritesheet/uipack_rpg_sheet.xml");
        this.load.image("sunnyside_tilemap", "Sunnyside_World_Assets/Tileset/spr_tileset_sunnysideworld_16px.png");

        this.load.image('SPACEKEY', 'SimpleKeys/SimpleKeys/Jumbo/Light/Single PNGs/SPACE.png');
        this.load.image('ZKEY', 'SimpleKeys/SimpleKeys/Jumbo/Light/Single PNGs/Z.png');


        // Load bitmap
        this.load.bitmapFont('font', '/pixel_fonts/fonts/minogram_6x10.png', '/pixel_fonts/fonts/minogram_6x10.xml');
        
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
        // hair 1
        this.load.spritesheet('idle_hair_1', 'Sunnyside_World_Assets/Characters/Human/IDLE/spikeyhair_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // tool
        this.load.spritesheet('idle_tool', 'Sunnyside_World_Assets/Characters/Human/IDLE/tools_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // goblin
        this.load.spritesheet('idle_gob', 'Sunnyside_World_Assets/Characters/Goblin/PNG/spr_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        })

      // ------ WALK ------
        // base
        this.load.spritesheet('walk_bod', 'Sunnyside_World_Assets/Characters/Human/WALKING/base_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('walk_hair', 'Sunnyside_World_Assets/Characters/Human/WALKING/curlyhair_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // goblin
        this.load.spritesheet('walk_gob', 'Sunnyside_World_Assets/Characters/Goblin/PNG/spr_walk_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        })

      // ----- ATTACK -----
        // base
        this.load.spritesheet('attack_bod', 'Sunnyside_World_Assets/Characters/Human/ATTACK/base_attack_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('attack_hair', 'Sunnyside_World_Assets/Characters/Human/ATTACK/curlyhair_attack_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // sword
        this.load.spritesheet('attack_tool', 'Sunnyside_World_Assets/Characters/Human/ATTACK/tools_attack_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // goblin
        this.load.spritesheet('attack_gob', 'Sunnyside_World_Assets/Characters/Goblin/PNG/spr_attack_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
      // ----- DAMAGE -----
        // goblin
        this.load.spritesheet('damage_gob', 'Sunnyside_World_Assets/Characters/Goblin/PNG/spr_hurt_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        // body
        this.load.spritesheet('damage_bod', 'Sunnyside_World_Assets/Characters/Human/HURT/base_hurt_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        // hair
        this.load.spritesheet('damage_hair', 'Sunnyside_World_Assets/Characters/Human/HURT/curlyhair_hurt_strip8.png', {
            frameWidth: 96,
            frameHeight: 64
        });

      // ----- DEATH -----
        // goblin
        this.load.spritesheet('death_gob', 'Sunnyside_World_Assets/Characters/Goblin/PNG/spr_death_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        // body
        this.load.spritesheet('death_bod', 'Sunnyside_World_Assets/Characters/Human/DEATH/base_death_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });

        // hair
        this.load.spritesheet('death_hair', 'Sunnyside_World_Assets/Characters/Human/DEATH/curlyhair_death_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
// ====================================================================================================================================================================== //

        // Load keypress animation spritesheets
        this.load.spritesheet('SPACE', 'SimpleKeys/SimpleKeys/Jumbo/Light/Spritesheets/SPACE.png', {
            frameWidth: 98,
            frameHeight: 21
        });



        this.load.tilemapTiledJSON("topDown-level-1", "topDown-level-1.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("topDown-level-2", "topDown-level-2.tmj");   // Tilemap in JSON

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
        
        // idle hair spikey animation
        this.anims.create({
            key: 'idle_h_spike',
            frames: this.anims.generateFrameNumbers('idle_hair_1', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        // idle tool animation
        this.anims.create({
            key: 'idle_t',
            frames: this.anims.generateFrameNumbers('idle_tool', { start: 0, end: 8}),
            frameRate: 12
        });

        // idle goblin animation
        this.anims.create({
            key: 'idle_g',
            frames: this.anims.generateFrameNumbers('idle_gob', {start: 0, end: 7}),
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
        
        // walk hair animation
        this.anims.create({
            key: 'walk_h',
            frames: this.anims.generateFrameNumbers('walk_hair', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });

        // walk goblin animation
        this.anims.create({
            key: 'walk_g',
            frames: this.anims.generateFrameNumbers('walk_gob', {start: 0, end: 7}),
            frameRate:12,
            repeat: -1
        });

        // attack body animation
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('attack_bod', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: 0
        });

        // attack hair animation
        this.anims.create({
            key: 'attack_h',
            frames: this.anims.generateFrameNumbers('attack_hair', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: 0
        });

        // attack tool animation
        this.anims.create({
            key: 'attack_t',
            frames: this.anims.generateFrameNumbers('attack_tool', {start: 0, end: 9}),
            frameRate: 12,
            repeat: 0
        });     
        
        // attack goblin animation
        this.anims.create({
            key: 'attack_g',
            frames: this.anims.generateFrameNumbers('attack_gob', {start: 0, end: 8}),
            frameRate:12
        });

        // damage body animation
        this.anims.create({
            key: 'damage_b',
            frames: this.anims.generateFrameNumbers('damage_bod', {start: 0, end: 7}),
            frameRate: 12
        });

        // damage hair animation
        this.anims.create({
            key: 'damage_h',
            frames: this.anims.generateFrameNumbers('damage_hair', {start: 0, end: 7}),
            frameRate:12
        });

        // damage goblin animation
        this.anims.create({
            key: 'damage_g',
            frames: this.anims.generateFrameNumbers('damage_gob', {start: 0, end: 7}),
            frameRate:12
        });

        // death goblin animation
        this.anims.create({
            key: 'death_g',
            frames: this.anims.generateFrameNumbers('death_gob', {start: 0, end: 8}),
            frameRate:12
        });

        // death body animation
        this.anims.create({
            key: 'death_b',
            frames: this.anims.generateFrameNumbers('death_bod', {start: 0, end: 12}),
            frameRate:12
        });

        // death hair animation
        this.anims.create({
            key: 'death_h',
            frames: this.anims.generateFrameNumbers('death_hair', {start: 0, end: 12}),
            frameRate:12
        });

        // space animation
        this.anims.create({
            key: 'space',
            frames: this.anims.generateFrameNumbers('SPACE', {start: 0, end: 2}),
            frameRate: 6,
            repeat: 2
        });

        this.scene.start("titleScene");
    }
    update() {

    }
}