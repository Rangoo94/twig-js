export default class Definitions {
    constructor() {
        this.defs = {};
    }

    /**
     * Remove all definitions
     */
    clear() {
        this.defs = {};
    }

    /**
     * Reset enabled definitions to default
     */
    reset() {
        this.each(definition => {
            definition.enabled = definition.enabledByDefault;
        });
    }

    /**
     * Enable specified definition
     *
     * @param {String|Array} name
     * @param {Boolean} [state]
     */
    changeState(name, state) {
        if (typeof name === 'string') {
            name = [ name ];
        }

        for (var i = 0; i < name.length; i++) {
            this.defs[name[i]].enabled = state;
        }
    }

    /**
     * Enable specified definition
     *
     * @param {String|Array} name
     */
    enable(name) {
        this.changeState(name, true);
    }

    /**
     * Disable all definitions
     */
    disableAll() {
        this.each(definition => {
            definition.enabled = false;
        });
    }

    /**
     * Enable only specified definition
     *
     * @param {String|Array} name
     */
    enableOnly(name) {
        this.disableAll();
        this.enable(name);
    }

    /**
     * Disable specified definition
     *
     * @param {String|Array} name
     */
    disable(name) {
        this.changeState(name, false);
    }

    /**
     * Add new definition
     *
     * @param {String} name
     * @param {Function} func
     * @param {Boolean} [enabledByDefault]
     */
    add(name, func, enabledByDefault) {
        this.defs[name] = func;

        func.enabled = !!enabledByDefault;
        func.enabledByDefault = func.enabled;
        func.run = (...args) => {
            return func.apply(this, args);
        };
    }

    /**
     * Fire something for each definition
     *
     * @param {Function(definition, name, iterator)} func
     */
    each(func) {
        var stop = false,
            iterator;

        iterator = {
            stop: function() {
                stop = true;
            }
        };

        for (var name in this.defs) {
            if (this.defs.hasOwnProperty(name) && this.defs[name].enabled) {
                func.call(null, this.defs[name], name, iterator);

                if (stop) {
                    break;
                }
            }
        }
    }
}
