export default class HUD {
  constructor(scene) {
    this.scene = scene;
    this.healthText = null;
    this.createHealthDisplay();
  }

  createHealthDisplay() {
    // Texto da vida no canto superior esquerdo
    this.healthText = this.scene.add.text(20, 20, 'LIFE: 5/5', {
      fontSize: '16px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      fontFamily: 'Arial'
    });
    
    // Fixa a posição na tela (não move com a câmera)
    this.healthText.setScrollFactor(0);
    this.healthText.setDepth(1000); // Sempre no topo
  }

  updateHealth(currentHealth, maxHealth) {
    if (this.healthText) {
      // Muda a cor baseada na vida
      let color = '#ffffff';
      if (currentHealth <= 1) {
        color = '#ff0000'; // Vermelho quando crítico
      } else if (currentHealth <= 2) {
        color = '#ffaa00'; // Laranja quando baixo
      }
      
      this.healthText.setText(`LIFE: ${currentHealth}/${maxHealth}`);
      this.healthText.setFill(color);
    }
  }

  destroy() {
    if (this.healthText) {
      this.healthText.destroy();
    }
  }
}