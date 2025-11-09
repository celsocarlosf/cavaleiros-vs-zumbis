import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }


  preload() {
    // Carrega o spritesheet do personagem (6 frames de 32x32 pixels)
    this.load.spritesheet('personagem', '/assets/knight/sprites/knight.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('mundo', '/assets/knight/sprites/world_tileset.png', {
      frameWidth: 16,
      frameHeight: 16
    });

  }

  create() {

    const worldWidth = 60 * 16;
    const worldHeight = 20 * 16;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

    // desenhar chao com 60 na primeira linha 
    for (let i = 0; i < 60; i++) {
      this.add.sprite(i * 16 + 8, 16 * 20 - 8, 'mundo', 0);
    }

    // Cria animação
    this.anims.create({
      key: 'parado',
      frames: this.anims.generateFrameNumbers('personagem', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'andar',
      frames: this.anims.generateFrameNumbers('personagem', { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1
    });

    // Adiciona sprite à tela
    this.player = this.physics.add.sprite(200, 16 * 19 - 12, 'player');

    this.cameras.main.startFollow(this.player);

    this.player.play('andar');
  }

  update() {

    // seta pro lado direito
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.player.x -= 2;
      this.player.setFlipX(true);
      this.player.play('andar', true);
    } else if (cursors.right.isDown) {
      this.player.x += 2;
      this.player.setFlipX(false);
      this.player.play('andar', true);
    } else {
      this.player.play('parado', true);
    }
  }
}
