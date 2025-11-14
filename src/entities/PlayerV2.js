import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    this.setup(scene);

    this.createAnimations(scene);

  }

  // --------------------------------------------------------------------------
  // SETUP
  // --------------------------------------------------------------------------
  setup(scene) {
    scene.add.existing(this);

    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);

    this.speed = 100;
    this.facing = 'right';
    this.isAttacking = false;
    this.gravityY = 800;
    this.setGravityY(this.gravityY);
    // Espada separada
    this.sword = scene.add.sprite(this.x, this.y, 'sword');
    this.sword.setOrigin(0.5, 0.5);
  }

  update() {
    this.setSwordPosition();
  }

  stop() {
    if (this.isAttacking) return;

    this.setVelocityX(0);
    this.play('player_idle', true);
  }

  walkLeft() {
    if (this.isAttacking) return; // não troca animação durante ataque

    this.setVelocityX(-this.speed);
    this.setFlipX(true);
    this.facing = 'left';
    this.play('player_run', true);
  }

  walkRight() {
    if (this.isAttacking) return;

    this.setVelocityX(this.speed);
    this.setFlipX(false);
    this.facing = 'right';
    this.play('player_run', true);
  }

  jump() {
    // Implementar mais tarde
  }

  // --------------------------------------------------------------------------
  // ATAQUE
  // --------------------------------------------------------------------------
  attack() {
    if (this.isAttacking) return;

    this.isAttacking = true;

    this.setVelocityX(0);
    // Ajusta ângulo inicial do ataque
    const xOffset = -5;
    const yOffset = -2;

    if (this.facing === 'right') {
      this.sword.setPosition(this.x + xOffset, this.y + yOffset);
      this.sword.setAngle(0);
    } else {
      this.sword.setPosition(this.x - xOffset, this.y + yOffset);
      this.sword.setAngle(360);
    }

    // fazer ataque
    this.scene.time.delayedCall(100, () => {

      this.setVelocityY(-50);

      if (this.facing === 'right') {
        this.setVelocityX(2);
        this.sword.setAngle(90);
        this.sword.setFlipX(false);
        this.sword.setPosition(this.x + 8, this.y + 8);
      } else {
        this.setVelocityX(-2);
        this.sword.setAngle(-90);
        this.sword.setFlipX(true);
        this.sword.setPosition(this.x - 8, this.y + 8);
      }

      this.sword.play('sword_swing', true);

      // reset position
      this.sword.on('animationcomplete', () => {
        this.isAttacking = false;
        this.setSwordPosition();
      });

    });

    // Toca animação da espada
    // this.sword.play('sword_swing', true);

    // Quando terminar, volta ao idle da espada e libera ataque
    // this.sword.once('animationcomplete', () => {
    //   this.isAttacking = false;
    //   this.sword.setAngle(this.facing === 'right' ? 90 : -90);
    //   this.sword.play('sword_idle');
    // });
  }

  setSwordPosition() {
    if (this.isAttacking) return;

    this.sword.play('sword_idle');

    const xOffset = 8;
    const yOffset = 8;

    this.sword.setScale(0.8);

    if (this.facing === 'right') {
      this.sword.setPosition(this.x + xOffset, this.y + yOffset);
      this.sword.setAngle(90);
    } else {
      this.sword.setPosition(this.x - xOffset, this.y + yOffset);
      this.sword.setAngle(-90);
    }
  }

  createAnimations(scene) {
    // Player idle
    scene.anims.create({
      key: 'player_idle',
      frames: scene.anims.generateFrameNumbers('knight', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.play('player_idle');

    // Player run
    scene.anims.create({
      key: 'player_run',
      frames: scene.anims.generateFrameNumbers('knight', { start: 16, end: 23 }),
      frameRate: 10,
      repeat: -1
    });

    // Player death 
    scene.anims.create({
      key: 'player_die',
      frames: scene.anims.generateFrameNumbers('knight', { start: 56, end: 59 }),
      frameRate: 5,
      repeat: 0
    });

    // Sword idle
    scene.anims.create({
      key: 'sword_idle',
      frames: scene.anims.generateFrameNumbers('sword', { start: 0, end: 0 }),
      frameRate: 5,
      repeat: -1
    });

    // Sword swing (ataque)
    scene.anims.create({
      key: 'sword_swing',
      frames: scene.anims.generateFrameNumbers('sword', { start: 4, end: 7 }),
      frameRate: 15,
      repeat: 0
    });

    this.sword.play('sword_idle');
  }
}
