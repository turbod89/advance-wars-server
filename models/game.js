const Turn = require('./turn');


const dijkstra = function (cell, remaining_moves, map, calcule_cost, already_visited = null) {

    if (already_visited === null) {
        already_visited = new Set();
    }

    already_visited.add(cell);

    const adjacent_cells = map.getAdjacent(cell);

    for (const adjacent_cell of adjacent_cells) {

        const cost =  calcule_cost(adjacent_cell);
        const isCellAlreadyVisited = already_visited.has(adjacent_cell);

        if (!isCellAlreadyVisited && typeof cost === 'number' && cost <= remaining_moves) {
            already_visited.add( adjacent_cell );
            dijkstra(adjacent_cell, remaining_moves - cost,map,calcule_cost, already_visited);
        }

    }

    return already_visited;
};

const Game = function () {

    const args = Array.prototype.slice.call(arguments);
    const $a = args[0] || {};

    const max_turns = 10;

    const units = [];
    let turn_cnt = null;
    let status = 'CREATED';




    Object.defineProperties(this,{
        'length': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': ( $a['players'] && $a['players'].length) || 0
        },
        'players': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': $a['players'] || []
        },
        'map': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': $a['map'] || null
        },
        'turn': {
            'enumerable': true,
            'configurable': false,
            'get': () => turn_cnt,
        },
        'status': {
            'enumerable': true,
            'configurable': false,
            'get': () => status,
        },
        'units': {
            'enumerable': true,
            'configurable': false,
            'get': () => units,
        },
        'start': {
            'enumerable': true,
            'configurable': false,
            'writable': false,
            'value': async function () {

                turn_cnt = 0;
                status = 'STARTED';

                while (!this.isEnd) {
                    const turn = new Turn(this);
                    await turn.dealer.doTurn(turn);

                    turn_cnt++;

                    if (this.turn > max_turns) {
                        status = 'FINISHED';
                    }
                }

            },
        },
    });

    //
    //
    //

    this.map.cells.forEach( cell => {
        if (cell.unit && cell.unit !== null) {
            const player = this.players[cell.unit.team];
            const Type = cell.unit.type;
            cell.unit = new Type();
            cell.unit.owner = player;
            units.push(cell.unit);
        }
    });
};

Object.defineProperties(Game.prototype,{
    'isEnd': {
        'enumerable': true,
        'configurable': false,
        'get': function () {
            return this.status === 'FINISHED';
        },
    },



    'getUnitById': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (id) {
            const index = this.units.findIndex(unit => unit.id === id);
            return index < 0 ? null : this.units[index];
        }
    },

    'isValidUnitCell': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit, cell) {
            return cell.terrain.cost[unit.type] !== null && !(cell.unit && cell.unit.owner !== unit.owner);
        },
    },

    'getUnitReachableCells': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit) {
            const cellIndex = this.map.getUnitCellIndex(unit);

            if (cellIndex === null) {

            } else {
                const cell = this.map.getCell(cellIndex);
                return dijkstra(cell, unit.move, this.map, cell => {

                    if (!this.isValidUnitCell(unit,cell)) {
                        return null;
                    }

                    return cell.terrain.cost[unit.type];
                });
            }

            return new Set();
        }
    },

    'getUnitVisibleCells': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit) {
            const cellIndex = this.map.getUnitCellIndex(unit);

            if (cellIndex === null) {

            } else {
                const cell = this.map.getCell(cellIndex);
                return dijkstra(cell, unit.vision, this.map, cell => cell.terrain.visibility[unit.type]);
            }

            return new Set();
        }
    },

    'getUnitAPrioryReachableCells': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit) {
            const cellIndex = this.map.getUnitCellIndex(unit);

            if (cellIndex === null) {

            } else {
                const visible_cells = this.getUnitVisibleCells(unit);
                const cell = this.map.getCell(cellIndex);
                return dijkstra(cell, unit.move, this.map, cell => {

                    if (visible_cells.has(cell) && this.isValidUnitCell(unit,cell)) {
                        return null;
                    }

                    return cell.terrain.cost[unit.type];
                });
            }

            return new Set();
        }
    },

    'getPlayerVisibleCells': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (player) {

            const visited_cells = new Set();

            for (let unit of this.units) {
                if (unit.owner === player) {

                    const visible_cells = this.getUnitVisibleCells(unit);

                    for (let cell of visible_cells) {

                        const already_visited = visited_cells.has(cell);
                        if (!already_visited) {
                            visited_cells.add(cell);
                        }
                    }
                }
            }

            return visited_cells;
        }
    },

    'move': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit, targetCell) {

            const actualCell = this.map.getUnitCell(unit);
            targetCell.unit = actualCell.unit;
            actualCell.unit = null;

            return this;
        }
    },

    'attack': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (attacker, defender, counterAttack = false) {

            if ( !(defender.type in attacker.damage) || attacker.damage[defender.type] === null) {
                // attacker is not allow to attack defender
                return this;
            }

            const attackerOffensive = 1;
            const defenderDefense = 1;
            const defenderCell = this.map.getUnitCell(defender);
            const R = 0.1 * Math.random();
            const damage = Math.max( 0, Math.min(1,
                (attacker.damage[defender.type] * attackerOffensive + R)
                * attacker.hp
                * ( 1 - defenderDefense + 1 - defenderCell.terrain.defense[defender.type] * defender.hp)
            ));

            defender.hp -= damage;

            if (counterAttack === false && defender.hp > 0 ) {
                this.attack(defender, attacker, true);
            }

            if (defender.hp <= 0) {
                defenderCell.unit = null;
                delete defender;
            }

            return this;
        }
    },

    'travelThroughRoute': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (unit, route) {

            const cellIndex = this.map.getUnitCellIndex(unit);

            if (cellIndex === null) {
                let actual_cell = this.map.getCell(cellIndex);
                let avaliable_move = this.unit.move;

                for (const direction of route) {
                    const cell = this.map.go(actual_cell,direction);

                    const reachable = cell === null
                        || !this.isValidUnitCell(unit,cell)
                        || avaliable_move < cell.terrain.cost[unit.type];

                    if ( ! reachable) {
                        return {
                            valid: false,
                            cell: actual_cell,
                        };
                    }

                    avaliable_move -= cell.terrain.cost[unit.type];
                    actual_cell = cell;
                }

                return {
                    valid: true,
                    cell: actual_cell,
                };

            } else {

            }

            return null;
        }
    },


});

module.exports = Game;