import Coin from "../entities/Coin.js";
import Enemy from "../entities/Enemy.js";

export default function levelMaker(scene, mapData, tilesetKey, player) {

  const collisionGroups = {
    ground: scene.physics.add.staticGroup(),
    platforms: scene.physics.add.staticGroup(),
    enemies: scene.physics.add.group(),
    coins: scene.physics.add.group(),
  };

  const layersData = [
    // {
    //   name: "background",
    //   collision: false,
    //   order: 1
    // },
    {
      name: "ground",
      collision: true,
      collision_type: 'ground',
      order: 2
    },
    {
      name: "platforms",
      collision: true,
      collision_type: 'platform',
      order: 2
    },
    {
      name: "decorations",
      collision: false,
      order: 3
    },
    {
      name: "water",
      collision: false,
      collision_type: 'water',
      order: 4
    },
    {
      name: "level_start",
      collision: false,
      order: 5,
      visible: false
    },
    {
      name: "level_end",
      collision: false,
      order: 5
    },
    {
      name: "enemies",
      collision: true,
      collision_type: 'enemy',
      order: 6,
      visible: false
    },
    {
      name: "coins",
      collision: true,
      collision_type: 'coin',
      visible: false,
      order: 6
    }
  ]

  layersData.sort((a, b) => a.order - b.order);

  layersData.forEach(layerData => {
    drawLayer(scene, layerData, mapData, tilesetKey);
  });

  // PRIMEIRO: Configura as colisões do terreno
  setupTerrainCollisions(scene, mapData, collisionGroups, player);

  // DEPOIS: Adiciona as entidades
  setPlayerStartPosition(scene, mapData, player);
  drawCoins(scene, mapData, collisionGroups.coins);
  drawEnemies(scene, mapData, collisionGroups.enemies);

  // FINALMENTE: Configura as colisões das entidades
  setupEntityCollisions(scene, collisionGroups, player);
}

function drawLayer(scene, layerData, mapData, tilesetKey) {
  const layer = mapData.layers.find(l => l.name === layerData.name);

  if (!layer) {
    console.warn(`Layer ${layerData.name} not found in map data.`);
    return;
  }

  if (layerData.visible === false) {
    return;
  }

  console.log(`Drawing layer: ${layerData.name}`);

  layer.tiles.forEach(tile => {
    scene.add.sprite(
      tile.x * mapData.tileSize + mapData.tileSize / 2,
      tile.y * mapData.tileSize + mapData.tileSize / 2,
      tilesetKey,
      tile.id
    );
  });
}

function setPlayerStartPosition(scene, mapData, player) {
  const startLayer = mapData.layers.find(l => l.name === "level_start");

  if (startLayer && startLayer.tiles.length > 0) {
    const startTile = startLayer.tiles[0];
    const startX = startTile.x * mapData.tileSize + mapData.tileSize / 2;
    const startY = startTile.y * mapData.tileSize + mapData.tileSize / 2;

    player.setPosition(startX, startY - 20);
  } else {
    console.warn("No level_start layer or tiles found in map data.");
  }
}

function drawCoins(scene, mapData, coinGroup) {
  const coinLayer = mapData.layers.find(l => l.name === "coins");

  if (!coinLayer) {
    console.warn("No coins layer found in map data.");
    return;
  }

  coinLayer.tiles.forEach(tile => {
    const x = tile.x * mapData.tileSize + mapData.tileSize / 2;
    const y = tile.y * mapData.tileSize + mapData.tileSize / 2;

    const coin = new Coin(scene, x, y);
    coinGroup.add(coin);
  });
}

function drawEnemies(scene, mapData, enemyGroup) {
  const enemyLayer = mapData.layers.find(l => l.name === "enemies");

  if (!enemyLayer) {
    console.warn("No enemies layer found in map data.");
    return;
  }

  enemyLayer.tiles.forEach(tile => {
    const x = tile.x * mapData.tileSize + mapData.tileSize / 2;
    const y = tile.y * mapData.tileSize + mapData.tileSize / 2; // Mais espaço para cair

    const enemy = new Enemy(scene, x, y);
    enemyGroup.add(enemy);

    // Força a aplicação da gravidade
    enemy.body.setGravityY(600);

    console.log(`Enemy created at: ${x}, ${y}, gravity: ${enemy.body.gravity.y}`);
  });
}

function setupTerrainCollisions(scene, mapData, collisionGroups, player) {
  const groundLayer = mapData.layers.find(l => l.name === "ground");
  const platformsLayer = mapData.layers.find(l => l.name === "platforms");

  if (groundLayer) {
    groundLayer.tiles.forEach(tile => {
      const x = tile.x * mapData.tileSize + mapData.tileSize / 2;
      const y = tile.y * mapData.tileSize + mapData.tileSize / 2;

      const collisionTile = collisionGroups.ground.create(x, y, null);
      collisionTile.body.setSize(mapData.tileSize, mapData.tileSize);
      collisionTile.setVisible(false);
    });
  }

  if (platformsLayer) {
    platformsLayer.tiles.forEach(tile => {
      const x = tile.x * mapData.tileSize + mapData.tileSize / 2;
      const y = tile.y * mapData.tileSize + mapData.tileSize / 2;

      const collisionTile = collisionGroups.platforms.create(x, y, null);
      collisionTile.body.setSize(mapData.tileSize, mapData.tileSize);
      collisionTile.setVisible(false);
    });
  }
}

function setupEntityCollisions(scene, collisionGroups, player) {
  // Colisões com o chão
  scene.physics.add.collider(player, collisionGroups.ground);
  scene.physics.add.collider(collisionGroups.enemies, collisionGroups.ground);

  // Colisões com plataformas  
  scene.physics.add.collider(player, collisionGroups.platforms);
  scene.physics.add.collider(collisionGroups.enemies, collisionGroups.platforms);

  // Colisão entre player e moedas
  scene.physics.add.overlap(player, collisionGroups.coins, (player, coin) => {
    coin.collect();
  });

  // Colisão entre player e inimigos - usando overlap para ter controle total
  scene.physics.add.overlap(player, collisionGroups.enemies, (player, enemy) => {
    enemy.onPlayerCollision(player);
  });
  
  // Evita que inimigos atravessem uns aos outros
  scene.physics.add.collider(collisionGroups.enemies, collisionGroups.enemies);
}