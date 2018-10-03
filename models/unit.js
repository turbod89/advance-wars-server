const EntityFactory = require('./entityFactory');

const name = 'Unit';
const attr = ['name', 'type' ,'cost','move','vision','fuel','ammo','range','damage','environment'];

EntityFactory.create(name,attr, function () {
    this.id = this.type + '' + Math.floor(Math.random()*1000000);
    this.hp = 1;
});

const entitity = EntityFactory.entities[name];

const types = {};

Object.defineProperties(entitity, {
    'addType': {
        'enumerable': true,
        'configurable': false,
        'writable': false,
        'value': function (newTypeName, attributeValues) {

            if ( newTypeName in this || newTypeName in types) {
                console.error(`Name '${newTypeName}' is invalid name for a '${name}' new type because either it is a reserved word or it already exists.`);
                return this;
            }

            types[newTypeName] = function () {

                const args = [ attributeValues ];

                for (let i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }

                entitity.apply(this, args);
                return this;
            };


            Object.defineProperties(
                types[newTypeName],
                attr.reduce( function (o,curr) {
                    o[curr] = {
                        'enumerable': true,
                        'configurable': false,
                        'writable': false,
                        'value': typeof attributeValues === 'object' && curr in attributeValues? attributeValues[curr] : null,
                    };

                    return o;
                },{})
            );

            Object.defineProperties(
                types[newTypeName],
                {
                    'str': {
                        'enumerable': true,
                        'configurable': false,
                        'get': function () {
                            let s = `
${this.name} (${this.type})            
            `;
                        },
                    },
                }
            );

            return this;
        }
    },

    'types': {
        'enumerable': true,
        'configurable': false,
        'get': function () {
            return types;
        },
    },

});

module.exports = entitity;