import Phaser from "phaser";

export default class Sword extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'sword');

    scene.add.existing(this);

    this.setOrigin(0.5, 0.5);

    this.idleOffsetX = 8;
    this.idleOffsetY = 8;
    this.attackOffsetX = -5;
    this.attackOffsetY = -2;
    this.hitboxOffsetX = 12;
    this.hitboxOffsetY = 2;

    this.isAttacking = false;
    this.swordState = 'idle'; // idle, up, attacking

    this.createAnimations(scene);

    this.createHitbox(scene);

    this.play('sword_idle');
  }

  updatePosition(player) {

    this.setScale(0.8);

    this.updateHitbox(player);

    if (this.swordState == 'up') {
      this.setUpPosition(player);
      return
    }

    if (this.swordState == 'attacking') {
      this.setAttackPosition(player);
      return;
    }

    this.setIdlePosition(player);
  }

  updateHitbox(player) {
    if (player.facing === 'right') {
      this.hitbox.setPosition(player.x + this.hitboxOffsetX, player.y + this.hitboxOffsetY);
    } else {
      this.hitbox.setPosition(player.x - this.hitboxOffsetX, player.y + this.hitboxOffsetY);
    }
  }

  setIdlePosition(player) {
    if (player.facing === 'right') {
      this.setPosition(player.x + this.idleOffsetX, player.y + this.idleOffsetY);
      this.setAngle(90);
    } else {
      this.setPosition(player.x - this.idleOffsetX, player.y + this.idleOffsetY);
      this.setAngle(-90);
    }
  }

  setUpPosition(player) {
    if (player.facing === 'right') {
      this.setPosition(player.x + this.attackOffsetX, player.y + this.attackOffsetY);
      this.setAngle(0);
    } else {
      this.setPosition(player.x - this.attackOffsetX, player.y + this.attackOffsetY);
      this.setAngle(360);
    }
  }

  setAttackPosition(player) {
    if (player.facing === 'right') {
      this.setAngle(90);
      this.setFlipX(false);
      this.setPosition(player.x + this.idleOffsetX, player.y + this.idleOffsetY);
    } else {
      this.setAngle(-90);
      this.setFlipX(true);
      this.setPosition(player.x - this.idleOffsetX, player.y + this.idleOffsetY);
    }
  }

  attack(player, onAttackComplete) {

    if (this.isAttacking) return;

    this.isAttacking = true;

    this.swordState = 'up';

    // fazer ataque
    this.scene.time.delayedCall(100, () => {
      this.swordState = 'attacking';
      this.enableHitbox();
      this.setAttackPosition(player);

      this.play('sword_swing', true);

      // reset position
      const completeHandler = () => {
        this.isAttacking = false;
        this.disableHitbox();
        this.swordState = 'idle';
        this.play('sword_idle', true);
        this.off('animationcomplete', completeHandler);
        if (onAttackComplete) {
          onAttackComplete();
        }
      };

      this.on('animationcomplete', completeHandler);
    });
  }

  createHitbox(scene) {
    this.hitbox = scene.add.rectangle(this.x, this.y, 10, 20, 0xff0000, 0.3);

    scene.physics.add.existing(this.hitbox);

    // this.hitbox.body.setAllowGravity(false);
    // this.hitbox.body.setImmovable(true);
    this.hitbox.body.enable = false;
  }

  enableHitbox() {
    this.hitbox.body.enable = true;
  }

  disableHitbox() {
    this.hitbox.body.enable = false;
  }

  createAnimations(scene) {
    if (!scene.anims.exists('sword_idle')) {
      scene.anims.create({
        key: 'sword_idle',
        frames: scene.anims.generateFrameNumbers('sword', { start: 0, end: 0 }),
        frameRate: 5,
        repeat: -1
      });
    }

    if (!scene.anims.exists('sword_swing')) {
      scene.anims.create({
        key: 'sword_swing',
        frames: scene.anims.generateFrameNumbers('sword', { start: 4, end: 7 }),
        frameRate: 15,
        repeat: 0
      });
    }
  }
}