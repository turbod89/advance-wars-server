const clc = require("cli-color");

const tiles = [
    {
        size: [2,3],
        terrains: {
            "Plain": {
                chars: [
                    clc.xterm(46).bgXterm(70)('`'),
                    clc.xterm(46).bgXterm(70)(' '),
                    clc.xterm(46).bgXterm(70)('.'),
                    clc.xterm(46).bgXterm(70)(' '),
                    clc.xterm(46).bgXterm(70)(','),
                    clc.xterm(46).bgXterm(70)(' ')
                ],
                highlightChars: [
                    clc.xterm(46).bgXterm(124)('`'),
                    clc.xterm(46).bgXterm(124)(' '),
                    clc.xterm(46).bgXterm(124)('.'),
                    clc.xterm(46).bgXterm(124)(' '),
                    clc.xterm(46).bgXterm(124)(','),
                    clc.xterm(46).bgXterm(124)(' ')
                ],
            },
            "River": {
                chars: [
                    clc.xterm(39).bgXterm(18)('-'),
                    clc.xterm(39).bgXterm(18)('~'),
                    clc.xterm(39).bgXterm(18)('~'),
                    clc.xterm(39).bgXterm(18)('~'),
                    clc.xterm(39).bgXterm(18)('~'),
                    clc.xterm(39).bgXterm(18)('-')
                ],
                highlightChars: [
                    clc.xterm(39).bgXterm(124)('-'),
                    clc.xterm(39).bgXterm(124)('~'),
                    clc.xterm(39).bgXterm(124)('~'),
                    clc.xterm(39).bgXterm(124)('~'),
                    clc.xterm(39).bgXterm(124)('~'),
                    clc.xterm(39).bgXterm(124)('-')
                ],
            },
            "Bridge": {
                chars: [
                    clc.xterm(94).bgXterm(8)('='),
                    clc.xterm(94).bgXterm(8)('='),
                    clc.xterm(94).bgXterm(8)('='),
                    clc.xterm(94).bgXterm(8)('I'),
                    clc.xterm(94).bgXterm(8)(' '),
                    clc.xterm(94).bgXterm(8)('I')
                ],
                highlightChars: [
                    clc.xterm(94).bgXterm(124)('='),
                    clc.xterm(94).bgXterm(124)('='),
                    clc.xterm(94).bgXterm(124)('='),
                    clc.xterm(94).bgXterm(124)('I'),
                    clc.xterm(94).bgXterm(124)(' '),
                    clc.xterm(94).bgXterm(124)('I')
                ],
            },
            "Road": {
                chars: [
                    clc.xterm(0).bgXterm(8)('+'),
                    clc.xterm(0).bgXterm(8)('+'),
                    clc.xterm(0).bgXterm(8)('+'),
                    clc.xterm(0).bgXterm(8)('+'),
                    clc.xterm(0).bgXterm(8)('+'),
                    clc.xterm(0).bgXterm(8)('+')
                ],
                highlightChars: [
                    clc.xterm(0).bgXterm(124)('+'),
                    clc.xterm(0).bgXterm(124)('+'),
                    clc.xterm(0).bgXterm(124)('+'),
                    clc.xterm(0).bgXterm(124)('+'),
                    clc.xterm(0).bgXterm(124)('+'),
                    clc.xterm(0).bgXterm(124)('+')
                ],
            },
            "Wood": {
                chars: [
                    clc.xterm(94).bgXterm(58)('&'),
                    clc.xterm(94).bgXterm(58)('&'),
                    clc.xterm(94).bgXterm(58)('&'),
                    clc.xterm(94).bgXterm(58)('&'),
                    clc.xterm(94).bgXterm(58)('&'),
                    clc.xterm(94).bgXterm(58)('&')
                ],
                highlightChars: [
                    clc.xterm(94).bgXterm(124)('&'),
                    clc.xterm(94).bgXterm(124)('&'),
                    clc.xterm(94).bgXterm(124)('&'),
                    clc.xterm(94).bgXterm(124)('&'),
                    clc.xterm(94).bgXterm(124)('&'),
                    clc.xterm(94).bgXterm(124)('&')
                ],
            },
            "Mountain": {
                chars: [
                    clc.xterm(58).bgXterm(94)('M'),
                    clc.xterm(58).bgXterm(94)('^'),
                    clc.xterm(58).bgXterm(94)(' '),
                    clc.xterm(58).bgXterm(94)(' '),
                    clc.xterm(58).bgXterm(94)('^'),
                    clc.xterm(58).bgXterm(94)('M')
                ],
                highlightChars: [
                    clc.xterm(58).bgXterm(124)('M'),
                    clc.xterm(58).bgXterm(124)('^'),
                    clc.xterm(58).bgXterm(124)(' '),
                    clc.xterm(58).bgXterm(124)(' '),
                    clc.xterm(58).bgXterm(124)('^'),
                    clc.xterm(58).bgXterm(124)('M')
                ],
            },
            "Sea": {
                chars: 's    s',
            },
        },
    },

];

module.exports = function (map, opt = {}) {

    const tileSet = tiles[0];

    let s = '';
    for (let i = 0; i < map.size[0]; i++) {
        for (let y = 0; y < tileSet.size[0]; y++) {
            for (let j = 0; j < map.size[1]; j++) {
                const cell = map.cells ? map.cells[i * map.size[1] + j] : map[i * map.size[1] + j];
                for (let x = 0; x < tileSet.size[1]; x++) {
                    const tile = tileSet.terrains[cell.terrain.type || cell.terrain];
                    if ( opt['only'] && opt['only'].has(cell) && ('highlightChars' in tile)) {
                        s += tile.highlightChars[y * tileSet.size[1] + x];
                    } else {
                        s += tile.chars[y * tileSet.size[1] + x]
                    }
                }
            }
            s += '\n';
        }
    }

    console.log(s);
    return s;
};