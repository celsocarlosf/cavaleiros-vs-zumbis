import Phaser from "phaser";
import Test1 from "./scenes/Test1.js";
import Test2 from "./scenes/Test2.js";
import Test3 from "./scenes/Test3.js";
import Fase1 from "./scenes/Fase1.js";
import BootScene from "./scenes/BootScene.js";
import Level1 from "./scenes/Level1.js";

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
      // gravity: { y: 0 }, 
      debug: true,      
    },
  },
  scene: [BootScene, Level1],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
