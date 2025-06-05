class Load extends Phaser.Scene {
    
    constructor() {
        super("loadScene");
    }

    preload() {

        // load type-writer dialogue plugin
        this.load.plugin('rextexttypingplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttypingplugin.min.js', true);  

        // load dialogue file
        this.load.json('dialogueData', 'src/Data/Dialogue.json');

        this.load.setPath("./assets/");

        this.load.image('titleScreen', 'TitleScreen.png');
        this.load.image('sword', 'Sunnyside_World_Assets/UI/sword.png');
        
        // Load tilemap information
        this.load.image("kenney_RPG", "kenney_roguelike-rpg-pack/Spritesheet/roguelikeSheet_transparent.png");
        this.load.atlasXML("kenney_UI_atlas", "kenney_ui-pack-rpg-expansion/Spritesheet/uipack_rpg_sheet.png", "kenney_ui-pack-rpg-expansion/Spritesheet/uipack_rpg_sheet.xml");
        this.load.image("sunnyside_tilemap", "Sunnyside_World_Assets/Tileset/spr_tileset_sunnysideworld_16px.png");

        // UI key images
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
        // hair curly
        this.load.spritesheet('idle_hair', 'Sunnyside_World_Assets/Characters/Human/IDLE/curlyhair_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair spikey
        this.load.spritesheet('idle_hair_spikey', 'Sunnyside_World_Assets/Characters/Human/IDLE/spikeyhair_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair long
        this.load.spritesheet('idle_hair_long', 'Sunnyside_World_Assets/Characters/Human/IDLE/longhair_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair mop
        this.load.spritesheet('idle_hair_mop', 'Sunnyside_World_Assets/Characters/Human/IDLE/mophair_idle_strip9.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair short
        this.load.spritesheet('idle_hair_short', 'Sunnyside_World_Assets/Characters/Human/IDLE/shorthair_idle_strip9.png', {
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
      // ----- ACTIONS -----
      // axe  
        // body
        this.load.spritesheet('axe_bod', 'Sunnyside_World_Assets/Characters/Human/AXE/base_axe_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('axe_hair', 'Sunnyside_World_Assets/Characters/Human/AXE/curlyhair_axe_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('axe_hair_bowl', 'Sunnyside_World_Assets/Characters/Human/AXE/bowlhair_axe_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('axe_hair_long', 'Sunnyside_World_Assets/Characters/Human/AXE/longhair_axe_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('axe_hair_mop', 'Sunnyside_World_Assets/Characters/Human/AXE/mophair_axe_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('axe_hair_short', 'Sunnyside_World_Assets/Characters/Human/AXE/shorthair_axe_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('axe_tool', 'Sunnyside_World_Assets/Characters/Human/AXE/tools_axe_strip10.png', {
            frameWidth: 96,
            frameHeight: 64
        });
      // dig  
        // body
        this.load.spritesheet('dig_bod', 'Sunnyside_World_Assets/Characters/Human/DIG/base_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('dig_hair', 'Sunnyside_World_Assets/Characters/Human/DIG/curlyhair_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('dig_hair_bowl', 'Sunnyside_World_Assets/Characters/Human/DIG/bowlhair_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('dig_hair_long', 'Sunnyside_World_Assets/Characters/Human/DIG/longhair_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('dig_hair_mop', 'Sunnyside_World_Assets/Characters/Human/DIG/mophair_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('dig_hair_short', 'Sunnyside_World_Assets/Characters/Human/DIG/shorthair_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('dig_tool', 'Sunnyside_World_Assets/Characters/Human/DIG/tools_dig_strip13.png', {
            frameWidth: 96,
            frameHeight: 64
        });
      // hammering  
        // body
        this.load.spritesheet('hammer_bod', 'Sunnyside_World_Assets/Characters/Human/HAMMERING/base_hamering_strip23.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('hammer_hair', 'Sunnyside_World_Assets/Characters/Human/HAMMERING/curlyhair_hamering_strip23.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('hammer_hair_bowl', 'Sunnyside_World_Assets/Characters/Human/HAMMERING/bowlhair_hamering_strip23.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('hammer_hair_long', 'Sunnyside_World_Assets/Characters/Human/HAMMERING/longhair_hamering_strip23.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('hammer_hair_mop', 'Sunnyside_World_Assets/Characters/Human/HAMMERING/mophair_hamering_strip23.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('hammer_hair_short', 'Sunnyside_World_Assets/Characters/Human/HAMMERING/shorthair_hamering_strip23.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('hammer_tool', 'Sunnyside_World_Assets/Characters/Human/HAMMERING/tools_hamering_strip23.png', {
            frameWidth: 96,
            frameHeight: 64
        });
      // watering  
        // body
        this.load.spritesheet('watering_bod', 'Sunnyside_World_Assets/Characters/Human/WATERING/base_watering_strip5.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        // hair
        this.load.spritesheet('watering_hair', 'Sunnyside_World_Assets/Characters/Human/WATERING/curlyhair_watering_strip5.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('watering_hair_bowl', 'Sunnyside_World_Assets/Characters/Human/WATERING/bowlhair_watering_strip5.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('watering_hair_long', 'Sunnyside_World_Assets/Characters/Human/WATERING/longhair_watering_strip5.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('watering_hair_mop', 'Sunnyside_World_Assets/Characters/Human/WATERING/mophair_watering_strip5.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('watering_hair_short', 'Sunnyside_World_Assets/Characters/Human/WATERING/shorthair_watering_strip5.png', {
            frameWidth: 96,
            frameHeight: 64
        });
        this.load.spritesheet('watering_tool', 'Sunnyside_World_Assets/Characters/Human/WATERING/tools_watering_strip5.png', {
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

        // Load the Tiled tilemap as a spritesheet
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
            key: 'idle_h_spikey',
            frames: this.anims.generateFrameNumbers('idle_hair_spikey', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });
        // idle hair long animation
        this.anims.create({
            key: 'idle_h_long',
            frames: this.anims.generateFrameNumbers('idle_hair_long', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });
        // idle hair mop animation
        this.anims.create({
            key: 'idle_h_mop',
            frames: this.anims.generateFrameNumbers('idle_hair_mop', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });
        // idle hair short animation
        this.anims.create({
            key: 'idle_h_short',
            frames: this.anims.generateFrameNumbers('idle_hair_short', { start: 0, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        // idle tool animation
        this.anims.create({
            key: 'idle_t',
            frames: this.anims.generateFrameNumbers('idle_tool', { start: 0, end: 8}),
            frameRate: 12,
            repeat: -1
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

        // axe body animation
        this.anims.create({
            key: 'axe_b',
            frames: this.anims.generateFrameNumbers('axe_bod', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });

        // axe hair animation
        this.anims.create({
            key: 'axe_h',
            frames: this.anims.generateFrameNumbers('axe_hair', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        
        // axe hair long animation
        this.anims.create({
            key: 'axe_h_long',
            frames: this.anims.generateFrameNumbers('axe_hair_long', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        // axe hair mop animation
        this.anims.create({
            key: 'axe_h_mop',
            frames: this.anims.generateFrameNumbers('axe_hair_mop', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        // axe hair short animation
        this.anims.create({
            key: 'axe_h_short',
            frames: this.anims.generateFrameNumbers('axe_hair_short', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });
        // axe hair bowl animation
        this.anims.create({
            key: 'axe_h_bowl',
            frames: this.anims.generateFrameNumbers('axe_hair_bowl', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1
        });

        // axe tool animation
        this.anims.create({
            key: 'axe_t',
            frames: this.anims.generateFrameNumbers('axe_tool', { start: 0, end: 9}),
            frameRate: 12,
            repeat: -1,
        });
    
        // dig body animation
        this.anims.create({
            key: 'dig_b',
            frames: this.anims.generateFrameNumbers('dig_bod', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });

        // dig hair animation
        this.anims.create({
            key: 'dig_h',
            frames: this.anims.generateFrameNumbers('dig_hair', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });
        
        // dig hair long animation
        this.anims.create({
            key: 'dig_h_long',
            frames: this.anims.generateFrameNumbers('dig_hair_long', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });
        // dig hair mop animation
        this.anims.create({
            key: 'dig_h_mop',
            frames: this.anims.generateFrameNumbers('dig_hair_mop', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });
        // dig hair short animation
        this.anims.create({
            key: 'dig_h_short',
            frames: this.anims.generateFrameNumbers('dig_hair_short', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });
        // dig hair bowl animation
        this.anims.create({
            key: 'dig_h_bowl',
            frames: this.anims.generateFrameNumbers('dig_hair_bowl', { start: 0, end: 12 }),
            frameRate: 12,
            repeat: -1
        });

        // dig tool animation
        this.anims.create({
            key: 'dig_t',
            frames: this.anims.generateFrameNumbers('dig_tool', { start: 0, end: 12}),
            frameRate: 12,
            repeat: -1
        });

        // hammering body animation
        this.anims.create({
            key: 'hammer_b',
            frames: this.anims.generateFrameNumbers('hammer_bod', { start: 0, end: 22 }),
            frameRate: 12,
            repeat: -1
        });

        // hammering hair animation
        this.anims.create({
            key: 'hammer_h',
            frames: this.anims.generateFrameNumbers('hammer_hair', { start: 0, end: 22 }),
            frameRate: 12,
            repeat: -1
        });
        
        // hammering hair long animation
        this.anims.create({
            key: 'hammer_h_long',
            frames: this.anims.generateFrameNumbers('hammer_hair_long', { start: 0, end: 22 }),
            frameRate: 12,
            repeat: -1
        });
        // hammering hair mop animation
        this.anims.create({
            key: 'hammer_h_mop',
            frames: this.anims.generateFrameNumbers('hammer_hair_mop', { start: 0, end: 22 }),
            frameRate: 12,
            repeat: -1
        });
        // hammering hair short animation
        this.anims.create({
            key: 'hammer_h_short',
            frames: this.anims.generateFrameNumbers('hammer_hair_short', { start: 0, end: 22 }),
            frameRate: 12,
            repeat: -1
        });
        // hammering hair bowl animation
        this.anims.create({
            key: 'hammer_h_bowl',
            frames: this.anims.generateFrameNumbers('hammer_hair_bowl', { start: 0, end: 22 }),
            frameRate: 12,
            repeat: -1
        });

        // hammering tool animation
        this.anims.create({
            key: 'hammer_t',
            frames: this.anims.generateFrameNumbers('hammer_tool', { start: 0, end: 22}),
            frameRate: 12,
            repeat: -1
        });

        // watering body animation
        this.anims.create({
            key: 'watering_b',
            frames: this.anims.generateFrameNumbers('watering_bod', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });

        // watering hair animation
        this.anims.create({
            key: 'watering_h',
            frames: this.anims.generateFrameNumbers('watering_hair', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });
        
        // watering hair long animation
        this.anims.create({
            key: 'watering_h_long',
            frames: this.anims.generateFrameNumbers('watering_hair_long', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });
        // watering hair mop animation
        this.anims.create({
            key: 'watering_h_mop',
            frames: this.anims.generateFrameNumbers('watering_hair_mop', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });
        // watering hair short animation
        this.anims.create({
            key: 'watering_h_short',
            frames: this.anims.generateFrameNumbers('watering_hair_short', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });
        // watering hair bowl animation
        this.anims.create({
            key: 'watering_h_bowl',
            frames: this.anims.generateFrameNumbers('watering_hair_bowl', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });

        // watering tool animation
        this.anims.create({
            key: 'watering_t',
            frames: this.anims.generateFrameNumbers('watering_tool', { start: 0, end: 4}),
            frameRate: 12,
            repeat: -1
        });

        // space animation
        this.anims.create({
            key: 'space',
            frames: this.anims.generateFrameNumbers('SPACE', {start: 0, end: 2}),
            frameRate: 6,
            repeat: 2
        });

        // start title scene
        this.scene.start("titleScene");
    }
    update() {

    }
}