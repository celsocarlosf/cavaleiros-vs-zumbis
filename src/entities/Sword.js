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

    this.isAttacking = false;
    this.swordState = 'idle'; // idle, up, attacking

    this.createAnimations(scene);

    this.play('sword_idle');
  }

  updatePosition(player) {
    
    this.setScale(0.8);

    if (this.swordState == 'up') {
      this.setUpPosition(player);
      return
    }

    if (this.swordState == 'attacking') {
      this.setAttackPosition(player);
      return;
    }

    if (this.swordState == 'idle') {
      this.setIdlePosition(player);
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
      this.setAttackPosition(player);

      this.play('sword_swing', true);

      // reset position
      const completeHandler = () => {
        this.isAttacking = false;
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