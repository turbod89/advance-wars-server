const Player = function () {
    this.name = 'Player_'+Math.floor(Math.random()*100000);
};

Object.defineProperties(Player.prototype, {


    'doTurn': {
    'enumerable': true,
    'modificable': true,
    'writable': true,
    'value': async function ( turn ) {
        console.log('This is function is expected to be overwritten');
        return this;
    },
},
});

module.exports = Player;