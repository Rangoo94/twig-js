(function() {
    'use strict';

    var TokenContainer = require('./token-container');

    function Lexer() {
        this.definitions = [];
    }

    Lexer.prototype = {
        add: function(generator) {
            this.definitions.push(generator);
        },

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
