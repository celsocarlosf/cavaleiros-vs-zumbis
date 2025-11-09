import Phaser from "phaser";

export default class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    // Corrige para usar 'coin' em vez de 'coins'
    super(scene, x, y, 'coin');

    // Adiciona à cena e ativa a física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configura o corpo físico
    this.body.setSize(8, 8);
    this.body.setOffset(4, 3);
    
    // Moeda não é afetada por gravidade
    this.body.setGravityY(0);
    
    // Define profundidade
    this.setDepth(50);
    
    // Propriedade para controlar se foi coletada
    this.collected = false;
    
    // Inicia a animação
    this.play('coin_spin');
  }

  collect() {

    if (this.collected) return;
    
    this.collected = true;
    
    // Para a animação atual
    this.stop();
    
    // Efeito de coleta
    this.scene.tweens.add({
      targets: this,
      y: this.y - 20,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
  }
}