(function() {
    'use strict';

    var CodeStructure = require('./code-structure');

    /**
     * It should parse everything to basic structure elements:
     * - if
     * - expression
     * - loop
     * - plain-text
     * - node (and other node connected things like attributes) - @TODO
     */

    /**
     * Understands how to create structure from tokens
     *
     * @constructor
     */
    function Parser() {
        this.definitions = {
            'plain-text': function(result) {
                result.add('plain-text', this.text);
            }
        };
    }

    Parser.prototype = {
        /**
         * Parse tokens to structure against known definitions
         *
         * @param {TokenContainer} tokens
         * @returns {CodeStructure}
         */
        parse: function(tokens) {
            var result = CodeStructure.createBase(),
                token,
                i;

            tokens.go = function(n) {
                i = n;
            };

            for (i = 0; i < tokens.tokens.length; i++) {
                token = tokens.tokens[i];

                if (this.definitions[token.type]) {
                    this.definitions[token.type].call(token, result, i, tokens, this);
                } else {
                    throw new Error('There isn\'t any definition for `' + token.type + '` token');
                }
            }

            return result;
        },

        /**
         * Add new known definition of token
         *
         * @param {String} type
         * @param {Function} func
         */
        addDefinition: function(type, func) {
            this.definitions[type] = func;
        }
    };

    module.exports = Parser;
}());
