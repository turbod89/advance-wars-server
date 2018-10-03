const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



const { Unit, Terrain, Game, Map, Player} = require('../models');
const mapData = require('../data/map1');

const map = new Map(mapData);
map.build({
    terrains: Terrain.types,
    units: Unit.types,
});

const players = (new Array(mapData.teams)).fill(null).map( (e,i) => {

    const player = new Player();

    player.doTurn = async function ( turn ) {
        console.log('Player ' + i + ' turn in round '+turn.round);

        let isEnd = false;

        const isCmd = (needle,haystack) => haystack.some( command => needle.toLowerCase() === command.toLowerCase());

        while (!isEnd) {

            await new Promise( (resolve, reject) => {

                rl.resume();

                rl.prompt();

                rl.on('line', (line) => {

                    const words = line.trim().split(' ');

                    if (isCmd(words[0],['end', 'finish', 'q'])) {
                        isEnd = true;
                        rl.pause();
                        resolve();

                    } else if (isCmd(words[0],['units'])) {

                        if ( words.length < 2 || isCmd(words[1],['show'])) {
                            console.log(turn.myUnits);
                            turn.myUnits.forEach( unit => {
                                console.log(unit.str);
                            });
                        } else if (true) {
                            console.log(turn.units)
                        }

                    } else if (isCmd(words[0],['map', 'cells'])) {

                        if ( words.length < 2) {
                            console.log(turn.map);
                        } else if (isCmd(words[1],['print'])) {

                            let s = '';

                            for (let i = 0; i < turn.map.size[0]; i++) {
                                for (let j = 0; j < turn.map.size[1]; j++) {

                                    const cell = turn.map.getCell(i,j);

                                    if (cell.unit) {
                                        s += '!';
                                    } else {
                                        s += '.';
                                    }
                                }
                                s +='\n';
                            }

                            console.log('\n'+s+'\n');

                        } else if (isCmd(words[1],['log'])) {
                            console.log(turn.map);
                        } else if (true) {
                            console.log(turn.map);
                        }

                    } else if (isCmd(words[0],['help'])) {
                        console.log(`
    Avaliable commands:
    
    -> end
    -> help
    -> map
        -> print
        -> log
    -> units
        -> show

`);
                    } else if (true) {
                        console.error(`Unknown command '${words[0]}'. Type 'help' for help.`);
                    } else { }

                    rl.prompt();
                });
            });
        }

    };

    return player;

});

const game = new Game({
    players,
    map,
});

game.start();