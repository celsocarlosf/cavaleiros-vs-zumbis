import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');

    // Adiciona à cena e ativa a física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configura o corpo físico
    this.body.setSize(12, 12);
    this.body.setOffset(6, 12);
    this.body.setGravityY(600);
    this.setCollideWorldBounds(true);

    // Propriedades do inimigo
    this.health = 3;
    this.speed = 30;
    this.direction = 1; // 1 para direita, -1 para esquerda
    this.isDead = false;
    this.canAttack = true;
    this.attackCooldown = 1000; // 1 segundo entre ataques

    this.setDepth(50);

    // Animação inicial
    this.play('enemy_move');

    // Timer para mudança de direção aleatória
    scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      callback: this.changeDirection,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (this.isDead) return;

    // Movimento horizontal
    this.setVelocityX(this.speed * this.direction);

    // Vira o sprite baseado na direção
    this.flipX = this.direction === -1;

    // Muda direção se colidir com parede ou borda do mundo
    if (this.body.blocked.left || this.body.blocked.right) {
      this.changeDirection();
    }
  }

  changeDirection() {
    this.direction *= -1;
  }

  takeDamage(damage = 1) {
    if (this.isDead) return;

    this.health -= damage;

    // Efeito visual de dano (pisca vermelho)
    this.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.setVelocity(0, 0);

    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });

    this.particles = this.scene.add.particles(this.x, this.y + 8, 'whitePixel', {
      lifespan: 1000,
      speed: { min: 15, max: 25 },
      scale: { start: 4, end: 0 },
      gravityY: -5,
      emitting: false
    }).setDepth(20);
    this.particles.explode(12)

    // // TODO: Adicionar animação de morte
    // this.setAlpha(0.5);

    // // Remove o inimigo após um tempo
    // this.scene.time.delayedCall(1000, () => {
    //   this.destroy();
    // });

  }

  attack(player) {
    if (!this.canAttack || this.isDead) return;

    // TODO: Implementar lógica de ataque
    console.log("Enemy attacks player!");

    // Cooldown do ataque
    this.canAttack = false;
    this.scene.time.delayedCall(this.attackCooldown, () => {
      this.canAttack = true;
    });
  }

  // Método chamado quando o player toca no inimigo
  onPlayerCollision(player) {
    if (this.isDead) return;

    // Calcula a direção do empurrão ANTES de tudo
    const pushDirection = player.x < this.x ? -1 : 1;

    // Verifica se o player está caindo em cima do inimigo (como no Mario)
    const playerBottom = player.y + player.body.height / 2;
    const enemyTop = this.y - this.body.height / 2;

    // Player deve estar caindo (velocidade Y positiva) e acima do inimigo
    if (player.body.velocity.y > 50 && playerBottom < this.y && player.y < enemyTop + 10) {
      // Player mata o inimigo pulando em cima
      player.setVelocityY(-200); // Pequeno pulo de satisfação
      this.takeDamage(3); // Mata de uma vez

    } else {
      // Inimigo ataca o player (colisão lateral ou por baixo)
      this.attack(player);
      player.takeDamage(1, pushDirection);
    }
  }
}