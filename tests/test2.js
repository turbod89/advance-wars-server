const readline = require('readline');
const printer = require('./printer');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



const { Unit, Terrain, Game, Map, Player} = require('../models');
const mapData = require('../data/map2');

const map = new Map(mapData);
map.build({
    terrains: Terrain.types,
    units: Unit.types,
});

const players = (new Array(mapData.teams)).fill(null).map( (e,i) => {

    const player = new Player();

    player.doTurn = async function ( turn ) {};

    return player;

});

const game = new Game({
    players,
    map,
});


printer(map);
const unit = game.units[0];
const reachable_cells = game.getUnitReachableCells(unit);
for (const cell of reachable_cells) {
    console.log(cell.coordinates);
}
printer(map,{only: reachable_cells});


const player = players[0];

const visible_cells = game.getPlayerVisibleCells(player);
for (const cell of visible_cells) {
    console.log(cell.coordinates);
}