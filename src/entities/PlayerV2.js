import Phaser from "phaser";
import Sword from "./Sword.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    this.setup(scene);

    this.createAnimations(scene);
  }

  setup(scene) {
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    // speed
    this.speed = 100;
    this.maxSpeed = 150;
    this.xAcceleration = 500;

    // jump
    this.jumpVelocity = -300;
    this.shortHopMultiplier = 0.5;

    // physics
    this.groundDrag = 1000;
    this.airDrag = 80;
    this.gravityY = 800;
    this.setGravityY(this.gravityY);

    // Espada separada
    this.sword = new Sword(scene, this.x, this.y);

    // states
    this.isAttacking = false;
    this.isJumping = false;
    this.facing = 'right';
  }

  update() {
    this.sword.updatePosition(this);

    // set max speed
    if (this.body.velocity.x > this.maxSpeed) {
      this.setVelocityX(this.maxSpeed);
    } else if (this.body.velocity.x < -this.maxSpeed) {
      this.setVelocityX(-this.maxSpeed);
    }

    if (this.body.onFloor()) {
      this.setDragX(this.groundDrag);
    } else {
      this.setDragX(this.airDrag);
    }
  }

  stop() {

    this.setAccelerationX(0);
    this.play('player_idle', true);
  }

  walkLeft() {

    this.setAccelerationX(-this.xAcceleration);
    this.setFlipX(true);
    this.facing = 'left';
    this.play('player_run', true);
  }

  walkRight() {

    this.setAccelerationX(this.xAcceleration);
    this.setFlipX(false);
    this.facing = 'right';
    this.play('player_run', true);
  }

  jump() {
    if (this.body.blocked.down || this.body.onFloor()) {
      this.setVelocityY(this.jumpVelocity);
      this.isJumping = true;
    }
  }

  cancelJump() {
    if (this.isJumping && this.body.velocity.y < 0) {
      this.setVelocityY(this.body.velocity.y * this.shortHopMultiplier);
    }

    this.isJumping = false;
  }

  attack() {
    if (this.isAttacking) return;

    this.isAttacking = true;

    this.sword.attack(this, () => {

      this.isAttacking = false;
    });
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


  }
}
