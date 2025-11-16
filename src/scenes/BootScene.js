
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.spritesheet('knight', '/assets/knight/sprites/knight.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('world', '/assets/knight/sprites/world_tileset.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet('sword', '/assets/knight/sprites/excalibur.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('enemy_slime', '/assets/knight/sprites/slime_purple.png', {
      frameWidth: 24,
      frameHeight: 24
    });
  }

  create() {
    this.scene.start('Level1');
  }
}