import Phaser from "phaser";
import Player from "../entities/Player.js";
import Coin from "../entities/Coin.js";
import mapData from "../assets/tilemap/fase1/map.json";
import levelMaker from "../utils/LevelMaker.js";
import HUD from '../ui/HUD.js';

export default class Fase1 extends Phaser.Scene {

  constructor() {
    super("Fase1");
  }

  preload() {
    this.load.spritesheet('player', '/assets/knight/sprites/knight.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('coin', '/assets/knight/sprites/coin.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet('enemy', '/assets/knight/sprites/slime_purple.png', {
      frameWidth: 24,
      frameHeight: 24
    });

    this.load.spritesheet('fase_1', '/assets/fases/fase1_spritesheet.png', {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {

    this.anims.create({
      key: 'parado',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'andar',
      frames: this.anims.generateFrameNumbers('player', { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'player_died',
      frames: this.anims.generateFrameNumbers('player', { start: 56, end: 59 }),
      frameRate: 5,
      repeat: 0
    })

    this.anims.create({
      key: 'coin_spin',
      frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'enemy_move',
      frames: this.anims.generateFrameNumbers('enemy', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });


    this.ajustaWorld(mapData);

    // fazedor de níveis

    this.player = new Player(this, 0, 0);

    // Cria o HUD
    this.hud = new HUD(this);

    // Conecta o HUD ao player
    this.player.setHUD(this.hud);

    levelMaker(this, mapData, 'fase_1', this.player);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setDeadzone(0, 100);


  }

  update() {
    if (this.player) {
      this.player.update();
    }

    // Atualiza todos os inimigos
    this.physics.world.bodies.entries.forEach(body => {
      if (body.gameObject && body.gameObject.update && body.gameObject.constructor.name === 'Enemy') {
        body.gameObject.update();
      }
    });
  }

  ajustaWorld(mapData) {
    // set width and height of the world
    this.physics.world.setBounds(0, 0, mapData.mapWidth * mapData.tileSize, mapData.mapHeight * mapData.tileSize);
    this.cameras.main.setBounds(0, 0, mapData.mapWidth * mapData.tileSize, mapData.mapHeight * mapData.tileSize);

  }


}
