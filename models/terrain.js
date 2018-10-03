const EntityFactory = require('./entityFactory');

const name = 'Terrain';
const attr = ['name', 'type' , 'cost', 'defense', 'visibility'];


EntityFactory.create(name,attr, function () {

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