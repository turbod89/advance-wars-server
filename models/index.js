const Unit = require('./unit');
const Terrain = require('./terrain');
const Game = require('./game');
const Map = require('./map');
const Player = require('./player');

const entities = require('../data/entities');

/*
*   Load units
* */
entities.units.forEach(unitData => {
    Unit.addType(unitData.type, unitData);
});

/*
*   Load terrains
* */
entities.terrain.forEach(terrainData => {
    Terrain.addType(terrainData.type, terrainData);
});

module.exports = {
    Terrain,
    Unit,
    Map,
    Game,
    Player,
};