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

    this.load.spritesheet('enemy', '/assets/knight/sprites/slime_purple.png', {
      frameWidth: 24,
      frameHeight: 24
    });

    // Cria uma textura branca de um circulo 5 x 5 pixels diretamente (não precisa carregar imagem)
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('whiteCircle', 8, 8);
  }

  create() {

    this.createAnimations();

    this.createWorld();

    // Adiciona sprite à tela
    this.player = this.physics.add.sprite(200, 200);

    this.enemy = this.physics.add.sprite(300, 200);

    this.enemy.play('enemy_move');




  }

  update() {

    const cursors = this.input.keyboard.createCursorKeys();

    this.player.play('parado', true);

    if (cursors.left.isDown) {
      this.player.x -= 2;
      this.player.setFlipX(true);
      this.player.play('andar', true);
    }

    if (cursors.right.isDown) {
      this.player.x += 2;
      this.player.setFlipX(false);
      this.player.play('andar', true);
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {

      console.log("Criando partículas de explosao...");

      // make enemy shirnk
      this.tweens.add({
        targets: this.enemy,
        scaleX: 0,
        scaleY: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          this.enemy.destroy();
        }
      });

      this.particles = this.add.particles(this.enemy.x, this.enemy.y + 8, 'whiteCircle', {
        lifespan: 1000,
        speed: { min: 15, max: 25 },
        scale: { start: 2, end: 0 },
        gravityY: -5,
        emitting: false
      }).setDepth(20);
      this.particles.explode(8)
    }
  }

  createAnimations() {
    // Cria animação
    this.anims.create({
      key: 'parado',
      frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'andar',
      frames: this.anims.generateFrameNumbers('knight', { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1
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
