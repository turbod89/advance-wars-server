const factory = function () {

    let instance = null;

    const EntityFactory = function () {


        /*
        *   Singleton
        * */
        if (instance !== null) {
            return instance;
        }

        instance = this;

        /*
        *   Private Variables
        * */
        const models = {};

        /*
        *   Methods
        * */

        Object.defineProperties(this, {
            'create': {
                'enumerable': true,
                'configurable': false,
                'writable': false,
                'value': function (name, attributes, constructor) {

                    models[name] = function () {

                        const args = arguments;

                        Object.defineProperties(
                            this,
                            attributes.reduce( function (o,curr) {
                                o[curr] = {
                                    'enumerable': true,
                                    'configurable': false,
                                    'writable': false,
                                    'value': args.length === 1 && typeof args[0] === 'object' && curr in args[0] ? args[0][curr] : null,
                                };

                                return o;
                            }, {})
                        );

                        constructor.apply(this, arguments);

                    };

                    return this;
                }
            },

            'entities': {
                'enumerable': true,
                'configurable': false,
                'get': function () {
                        return models;
                },
            },
        });

        /*
        *   Return (redundant)
        * */

        return this;
    };

    return new EntityFactory();
};

module.exports = factory();