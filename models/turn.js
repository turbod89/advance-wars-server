const Map = require('./map');

/**
 *  Creates a game copy with game's info
 *  filtered to info that player can know.
 *
 *  As example, in a poker game, it should
 *  create a copy of the game with only
 *  the info of player's hand and the table.
 *
 * */

const Turn = function (game) {

    const dealer = game.players[ game.turn % game.players.length];
    const unitsWichHaveBeenAlreadyMoved = new Set();
    const myUnits = [];
    const units = [];

    const filteredCells = game.map.cells.map( (cell,i) => {
        const x = game.map.getCellCoordinates(cell);
        const newCell = {
            terrain: cell.terrain,
        };

        if (cell.unit && cell.unit.owner === cell.unit.owner) {
            newCell.unit = cell.unit;
            units.push(cell.unit);
            if (cell.unit.owner === cell.unit.owner) {
                myUnits.push(cell.unit);
            }
        }

        return newCell;
    });

    const map = new Map({
        offset: game.map.offset,
        size: game.map.size,
        cells: filteredCells,
    });

    Object.defineProperties(this, {
        'dealer': {
            'enumerable': true,
            'configurable': false,
            'get': () => dealer,
        },

        'round': {
            'enumerable': true,
            'configurable': false,
            'get': () => Math.floor( game.turn / game.players.length ),
        },

        'map': {
            'enumerable': true,
            'configurable': false,
            'get': () => map,
        },

        'moveTo': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': function (targetUnit, cell) {

                const alreadyMoved = unitsWichHaveBeenAlreadyMoved.has( targetUnit);

                if (alreadyMoved) {
                    console.error('This unit has been already moved this turn');
                    return this;
                }

            },
        },

        'myUnits': {
            'enumerable': true,
            'configurable': false,
            'get': () => myUnits,
        },

        'units': {
            'enumerable': true,
            'configurable': false,
            'get': () => units,
        },
    })

};


module.exports = Turn;