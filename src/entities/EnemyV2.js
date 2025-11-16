import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy_slime');

    // Adiciona à cena e ativa a física
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.createAnimations(scene)

    // Configura o corpo físico
    this.body.setSize(12, 12);
    this.body.setOffset(6, 12);
    this.body.setGravityY(600);

    this.gravityY = 800;
    this.setGravityY(this.gravityY);

    // Propriedades do inimigo
    this.health = 3;
    this.speed = 30;
    this.direction = 1; // 1 para direita, -1 para esquerda
    this.isDead = false;
    this.canAttack = true;
    this.attackCooldown = 1000; // 1 segundo entre ataques

    this.setDepth(50);


    // Animação inicial
    this.play('enemy_slime_move');

    // // Timer para mudança de direção aleatória
    // scene.time.addEvent({
    //   delay: Phaser.Math.Between(2000, 4000),
    //   callback: this.changeDirection,
    //   callbackScope: this,
    //   loop: true
    // });
  }


  update() {
    // if (this.isDead) return;

    // // Movimento horizontal
    // this.setVelocityX(this.speed * this.direction);

    // // Vira o sprite baseado na direção
    // this.flipX = this.direction === -1;

    // // Muda direção se colidir com parede ou borda do mundo
    // if (this.body.blocked.left || this.body.blocked.right) {
    //   this.changeDirection();
    // }
  }

  changeDirection() {
    // this.direction *= -1;
  }

  takeDamage(damage = 1) {
    // if (this.isDead) return;

    // this.health -= damage;

    // // Efeito visual de dano (pisca vermelho)
    // this.setTint(0xff0000);
    // this.scene.time.delayedCall(200, () => {
    //   this.clearTint();
    // });

    // if (this.health <= 0) {
    //   this.die();
    // }
  }

  die() {
    // this.isDead = true;
    // this.setVelocity(0, 0);

    // this.scene.tweens.add({
    //   targets: this,
    //   scaleX: 0,
    //   scaleY: 0,
    //   duration: 500,
    //   ease: 'Power2',
    //   onComplete: () => {
    //     this.destroy();
    //   }
    // });

    // this.particles = this.scene.add.particles(this.x, this.y + 8, 'whitePixel', {
    //   lifespan: 1000,
    //   speed: { min: 15, max: 25 },
    //   scale: { start: 4, end: 0 },
    //   gravityY: -5,
    //   emitting: false
    // }).setDepth(20);
    // this.particles.explode(12)

  }

  attack(player) {
    // if (!this.canAttack || this.isDead) return;

    // // TODO: Implementar lógica de ataque
    // console.log("Enemy attacks player!");

    // // Cooldown do ataque
    // this.canAttack = false;
    // this.scene.time.delayedCall(this.attackCooldown, () => {
    //   this.canAttack = true;
    // });
  }

  createAnimations(scene) {
    this.anims.create({
      key: 'enemy_slime_move',
      frames: this.anims.generateFrameNumbers('enemy_slime', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  }
}