(function() {
    'use strict';

    /**
     * Understands how to show built structure
     *
     * @param {Lexer} lexer
     * @param {Parser} parser
     * @constructor
     */
    function Engine(lexer, parser) {
        this.definitions = {};
        this.lexer = lexer;
        this.parser = parser;
    }

    Engine.prototype = {
        /**
         * Set initial result for showing
         *
         * @param {Function} func  which returns initial result (to initialize new objects instead of same instance)
         */
        setInitialResult: function(func) {
            this.getInitialResult = func;
        },

        /**
         * Get initial result for showing
         *
         * @returns {*}
         */
        getInitialResult: function() {
        },

        /**
         * Alias for parsing plain code to structure
         *
         * @param {String} code
         * @returns {CodeStructure}
         */
        parseToStructure: function(code) {
            return this.parser.parse(this.lexer.parse(code));
        },

        /**
         * Alias for `parse` method to parse plain code
         *
         * @param {String} code
         * @returns {*}
         */
        parseFromString: function(code) {
            return this.parse(this.parseToStructure(code));
        },

        /**
         * Parse structure to understandable result
         *
         * @param {CodeStructure} structure
         * @returns {*}
         */
        parse: function(structure) {
            var result = this.getInitialResult(),
                token,
                i;

            for (i = 0; i < structure.children.length; i++) {
                token = structure.children[i];

                if (this.definitions[token.type]) {
                    result = this.definitions[token.type].call(token, result, i, structure, this);
                } else {
                    throw new Error('There isn\'t any definition for `' + token.type + '` token');
                }
            }

            return result;
        },

        /**
         * Add new definition how to parse specified token in structure
         *
         * @param {String} type
         * @param {Function} func
         */
        addDefinition: function(type, func) {
            this.definitions[type] = func;
        }
    };

    module.exports = Engine;
}());
