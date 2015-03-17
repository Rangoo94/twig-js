(function() {
    'use strict';

    var TokenContainer = require('./token-container');

    /**
     * Understands how to prepare tokens from plain code
     *
     * @constructor
     */
    function Lexer() {
        this.definitions = [];
    }

    Lexer.prototype = {
        /**
         * Add new known definition of tokens
         *
         * @param {Function} generator  it should return null if it's not its part, or Object { ..., end: endIndex }
         */
        add: function(generator) {
            this.definitions.push(generator);
        },

        /**
         * Parse code by known definitions to tokens
         *
         * @param {String} code
         * @returns {TokenContainer}
         */
        parse: function(code) {
            var tokens = new TokenContainer(),
                result;

            for (var i = 0; i < code.length; i++) {
                for (var def = 0; def < this.definitions.length; def++) {
                    result = this.definitions[def].call(this, code, i, tokens);

                    if (result !== null) {
                        tokens.add(result);
                        i = result.end - 1;
                        break;
                    }
                }

                if (def === this.definitions.length) {
                    tokens.addPlainText(code.charAt(i));
                }
            }

            return tokens;
        }
    };

    module.exports = Lexer;
}());
