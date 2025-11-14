import LevelBase from './LevelBase.js';

export default class Level1 extends LevelBase {
  constructor() {
    super('Level1');
  }

  create() {
    super.create(); // Chama a base

    // Aqui você adiciona coisas específicas do level 1:
    // - inimigos diferentes
    // - triggers
    // - portas, etc.
  }
}