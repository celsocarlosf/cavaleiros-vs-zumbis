import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {

  constructor() {
    super("GameScene");
  }


  preload() {
    // Carrega o spritesheet do knight (6 frames de 32x32 pixels)
    this.load.spritesheet('knight', '/assets/knight/sprites/knight.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet('sword', '/assets/knight/sprites/excalibur.png', {
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
      key: 'sword',
      frames: this.anims.generateFrameNumbers('sword', { start: 0, end: 0 }),
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: 'sword_swing',
      frames: [
        { key: "sword", frame: 6 },
        { key: "sword", frame: 5 },
        { key: "sword", frame: 5 },
        { key: "sword", frame: 5 },
        { key: "sword", frame: 6 },
        // volta
        { key: "sword", frame: 10 },
        { key: "sword", frame: 9 },
        { key: "sword", frame: 9 },
        { key: "sword", frame: 9 },
        { key: "sword", frame: 10 }
      ],
      frameRate: 100  ,
      repeat: 0,
      // yoyo: true
    });

    // Adiciona sprite à tela
    this.player = this.physics.add.sprite(200, 200);
    this.player.setDepth(10);
    //this.player.setGravityY(800);
    this.sword = this.add.sprite(200, 210, 'sword');
    this.sword.play('sword');
    this.sword.setDepth(0)
    // this.sword.setPipeline('Light2D'); // opcional, se estiver usando luzes
    // this.sword.setAntialias(false);

    // rotate 30 degrees
    // this.sword.rotation = Phaser.Math.DegToRad(30);
    this.sword.setAngle(30)

    console.log("Largura da espada:", this.sword.width);
    console.log("Altura da espada:", this.sword.height);

    // this.swordDebug = this.add.graphics();
    // this.swordDebug.lineStyle(1, 0xff0000); // linha vermelha de 2px
    // this.swordDebug.strokeRect(
    //   this.sword.x - this.sword.width / 2,
    //   this.sword.y - this.sword.height / 2,
    //   this.sword.width,
    //   this.sword.height
    // );

    this.sword.setOrigin(0.5, 1);




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

    // if press space, play sword animation once 
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.tweens.add({
        targets: this.sword,
        angle: 90,
        duration: 50,
        yoyo: true,       // volta pro ângulo original automaticamente
        // ease: 'Sine.InOut',
        repeat: 0
      });

      this.sword.play('sword_swing', true);

      this.sword.on('animationcomplete', () => {
        // remove play sword_swing animation
        //this.sword.play('sword_swing', true);
        this.sword.play('sword');
      });


    }


  }
}
