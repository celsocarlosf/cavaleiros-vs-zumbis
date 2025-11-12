import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Usa a textura já carregada (precisa ter sido carregada no preload da cena)
    super(scene, x, y, 'player');

    // Adiciona à cena e ativa a física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configura o corpo físico
    this.body.setSize(14, 19);
    this.body.setOffset(9, 9);
    this.body.setGravityY(800);
    this.setCollideWorldBounds(true);

    // Controles
    this.cursors = scene.input.keyboard.createCursorKeys();

    // Tecla M para testar morte
    this.mKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    this.setDepth(100)

    // Propriedades do jogador
    this.health = 3;
    this.maxHealth = 5;
    this.isInvulnerable = false;
    this.invulnerabilityTime = 1500; // 1.5 segundos de invencibilidade

    // Referência ao HUD (será definida pela cena)
    this.hud = null;

    // Animação inicial
    this.particles = scene.add.particles(0, 0, 'whitePixel', {
      scale: { start: 1.5, end: 0.5, random: true },
      alpha: { start: 1, end: 0 },
      speedY: { min: -1, max: -12 },
      lifespan: { min: 100, max: 1000, ease: 'bounce.in' },                   // duração da partícula (0.5 segundos)
      frequency: 40,          // intervalo entre emissões
      quantity: 5,
      bounce: 5,
    }).setDepth(20);

    // Para as partículas inicialmente
    this.particles.stop();

    this.play('parado');
  }

  // Método para conectar o HUD
  setHUD(hud) {
    this.hud = hud;
    // Atualiza o HUD com a vida inicial
    if (this.hud) {
      this.hud.updateHealth(this.health, this.maxHealth);
    }
  }

  update() {
    // Se não tem controles (morreu), não processa movimento
    if (!this.cursors) return;

    // Atalho para testar morte - tecla M
    if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
      console.log("Testando animação de morte...");
      this.die();
      return;
    }

    const speed = 100;
    const jumpForce = -300;
    let isRunning = false;

    // Movimento horizontal
    if (this.cursors.left.isDown) {
      this.setVelocityX(-speed);
      this.flipX = true;
      this.anims.play('andar', true);
      isRunning = true;
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(speed);
      this.flipX = false;
      this.anims.play('andar', true);
      isRunning = true;
    } else {
      this.setVelocityX(0);
      this.anims.play('parado', true);
      isRunning = false;
    }

    // Controla o emitter baseado no movimento
    if (isRunning && this.body.blocked.down) {
      // Posiciona o emitter nos pés do player
      // this.particles.setPosition(this.x, this.y + 10);
      // set oposit speed for more natural effect
      // this.particles.setAngle(this.flipX ? 0 : 180);

      this.particles.startFollow(this, 0, 10);
      this.particles.start();
    } else {
      this.particles.stop();
    }

    // Pular
    if (this.cursors.up.isDown && this.body.blocked.down) {
      this.setVelocityY(jumpForce);
    }
  }

  takeDamage(damage = 1, pushDirection = 0) {
    // Se está invulnerável, não toma dano
    if (this.isInvulnerable) return;

    this.health -= damage;
    console.log(`Player health: ${this.health}/${this.maxHealth}`);

    // Atualiza o HUD
    if (this.hud) {
      this.hud.updateHealth(this.health, this.maxHealth);
    }

    // Ativa invencibilidade temporária
    this.isInvulnerable = true;

    // Aplica o knockback apenas se não vai morrer
    if (this.health > 0 && pushDirection !== 0) {
      this.setVelocityX(pushDirection * 150);
      this.setVelocityY(-100); // Pequeno pulo de knockback
    }

    // Efeito visual de piscar
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 150,
      yoyo: true,
      repeat: Math.floor(this.invulnerabilityTime / 300),
      onComplete: () => {
        this.alpha = 1;
        this.isInvulnerable = false;
      }
    });

    // Efeito visual de dano (tint vermelho)
    this.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });

    // Verifica se morreu
    if (this.health <= 0) {
      this.die();
    }
  }

  // Método para curar o player (opcional)
  heal(amount = 1) {
    this.health = Math.min(this.health + amount, this.maxHealth);
    if (this.hud) {
      this.hud.updateHealth(this.health, this.maxHealth);
    }
    console.log(`Player healed! Health: ${this.health}/${this.maxHealth}`);
  }

  die() {
    console.log("Game Over!");

    // Para o movimento do player IMEDIATAMENTE
    this.setVelocity(0, 0);
    this.body.setVelocity(0, 0); // Garante que pare mesmo

    // Remove controles para evitar movimento durante a morte
    this.cursors = null;

    // Toca a animação de morte
    this.play('player_died');

    // Opcional: adiciona um efeito sonoro de morte aqui
    // this.scene.sound.play('death_sound');

    // Aguarda a animação terminar antes de fazer mais ações
    this.on('animationcomplete-player_died', () => {
      // Escurece o player gradualmente
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          // Aqui você pode reiniciar a fase ou mostrar game over
          this.scene.scene.restart(); // Reinicia a fase atual
          // ou
          // this.scene.scene.start('GameOver'); // Vai para tela de game over
        }
      });
    });
  }
}
