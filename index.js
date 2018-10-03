const fs = require('fs');
const io = require("socket.io");

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

const port = normalizePort(process.env.HTTP_PORT || '3000');
const server = io.listen(port);

const { Unit, Terrain, Game, Map: GameMap, Player} = require('./models');

const folder = './data/';
const files = fs.readdirSync(folder);

const mapFiles = files.reduce ( (result,filename) => {

    if (/map\d+\.json/.test(filename)) {
        result.add(filename.replace(/(map\d+)\.json/g,'$1'));
    }

    return result;
},new Set());

const playersByClient = new Map();
const games = new Set();

server.on('connection', socket => {
    console.info(`Client connected [id=${socket.id}]`);

    playersByClient.set(socket, new Player());

    socket.on('disconnect', () => {
        playersByClient.delete(socket);
        console.info(`Client gone [id=${socket.id}]`);
    });

    socket.on('whoiam', () => {
        socket.emit('whoiam', playersByClient.get(socket).name);
    });

    socket.on('set name', new_name => {
        for (const [actual_socket, player] of playersByClient.entries()) {
            if (player.name === new_name && socket !== actual_socket) {
                socket.emit('onError', `Player name ${new_name} already exists`);
                return false;
            }
        }

        playersByClient.get(socket).name = new_name;
    });

    socket.on('set party', data => {
        const {name = null, map_name = null, } = data;
        if (!mapFiles.has(map_name)) {
            socket.emit('onError',`Map ${map_name} does not exists.`);
        } else if (([...games].map(game => game.name).some(game_name => game_name === name))) {
            socket.emit('onError',`Game with name '${name}' already exists.`);
        } else if (name === null) {
            socket.emit('onError',`Game name '${name}' is not valid.`);
        } else {
            const map = new GameMap(map_name);

            map.build({
                terrains: Terrain.types,
                units: Unit.types,
            });

            const game = new Game({
                players: [playersByClient.get(socket)],
                map,
            });

            game.name = name;
            game.owner = playersByClient.get(socket);
            game.map_name = map_name;

            games.add(game);
        }
    });

    socket.on('get map files', () => {
        socket.emit('get map files', [...mapFiles]);
    });

    socket.on('get parties', () => {
        socket.emit('get parties', [...games].map( game => ({
            name: game.name,
            owner: game.owner.name,
            players: game.players.map(player => player.name),
            map: game.map_name,
        })));
    });

    socket.on('get map', map_name => {
        if (mapFiles.has(map_name)) {
            socket.emit('get map', require('./data/'+map_name+'.json'));
        } else {
            socket.emit('onError',`Map ${map_name} does not exists.`);
        }
    });
});