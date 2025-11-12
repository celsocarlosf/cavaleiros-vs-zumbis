import Phaser from "phaser";
import GameScene from "./scenes/GameScene.js";
import Fase1 from "./scenes/Fase1.js";

const TILE_SIZE = 16;

// Número de tiles visíveis horizontal e vertical
const VIEW_TILES_X = 35; // largura em tiles
const VIEW_TILES_Y = 20; // altura em tiles

const config = {
  type: Phaser.AUTO,
  width: VIEW_TILES_X * TILE_SIZE, // 480 pixels
  height: VIEW_TILES_Y * TILE_SIZE, // 320 pixels
  backgroundColor: "#3095f3",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // será substituída na cena
      //debug: true,       // mostra o contorno dos objetos
    },
  },
  scene: [GameScene, Fase1],
  scale: {
    mode: Phaser.Scale.FIT,     // Ajusta o canvas para caber na tela do navegador
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
