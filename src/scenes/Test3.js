import Phaser from "phaser";

export default class Test2 extends Phaser.Scene {

  constructor() {
    super("Test2");
  }

  preload() {

    // Carrega o spritesheet do knight (6 frames de 32x32 pixels)
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
  }

  create() {

    this.createAnimations();

    this.createWorld();

    // Adiciona sprite à tela
    this.player = this.physics.add.sprite(200, 200);
    this.player.play('knight_idle');
    // this.player.setDepth(10);
    this.sword = this.add.sprite(0, 0, 'sword');
    this.sword.setOrigin(0.5, 1);
    this.sword.setAngle(90);
    this.sword.play('sword_idle');
  }

  update() {

    const cursors = this.input.keyboard.createCursorKeys();

    this.player.play('knight_idle', true);
    let swordX = this.player.x - 10;
    let swordY = this.player.y;

    this.sword.setPosition(swordX, swordY);

    if (cursors.left.isDown) {
      this.player.x -= 2;
      this.player.setFlipX(true);
      this.player.play('knight_walk', true);
    }

    if (cursors.right.isDown) {
      this.player.x += 2;
      this.player.setFlipX(false);
      this.player.play('knight_walk', true);
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      // rotate sword to 0
      this.sword.setAngle(0);
      // await 500 ms and rotate back to 90
      this.time.delayedCall(200, () => {
        this.sword.setAngle(90);
        this.sword.play('sword_swing', true);
        this.sword.on('animationcomplete', () => {
          this.sword.play('sword_idle');
        });

      });

    }
  }

  createAnimations() {
    // Cria animação
    this.anims.create({
      key: 'knight_idle',
      frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'knight_walk',
      frames: this.anims.generateFrameNumbers('knight', { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'sword_idle',
      frames: this.anims.generateFrameNumbers('sword', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'sword_swing',
      frames: this.anims.generateFrameNumbers('sword', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'enemy_move',
      frames: this.anims.generateFrameNumbers('enemy', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  }

  createWorld() {

    const worldWidth = 60 * 16;
    const worldHeight = 20 * 16;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    // desenhar chao com 60 na primeira linha 
    for (let i = 0; i < 60; i++) {
      this.add.sprite(i * 16 + 8, 16 * 20 - 8, 'world', 0);
    }
  }
}
