import Player from '../entities/PlayerV2.js';

export default class LevelBase extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.levelKey = key;
  }

  create() {
    // Criar mundo, física, jogador, etc.
    this.createControlls();
    this.createMap();
    this.createPlayer();
    this.setupCollisions();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.walkLeft();
    } else if (this.cursors.right.isDown) {
      this.player.walkRight();
    } else {
      this.player.stop();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.player.jump();
    }

    if (Phaser.Input.Keyboard.JustUp(this.cursors.up)) {
      this.player.cancelJump();
    }

    if (this.attackKey.isDown) {
      this.player.attack();
    }

    this.player.update();
  }


  createControlls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  createMap() {


  }

  createPlayer() {
    this.player = new Player(this, 100, 400);
  }

  setupCollisions() {
    // Setup de colisões genéricas (ex: chão, inimigos)
  }

}