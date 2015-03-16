(function() {
    'use strict';

    var CodePart = require('./code-part');

    function Parser() {
        this.definitions = {
            'plain-text': function(result) {
                result.add('plain-text', this.text);
            }
        };
    }

    Parser.prototype = {
        parse: function(tokens) {
            var result = CodePart.createBase(),
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

        addDefinition: function(type, func) {
            this.definitions[type] = func;
        }
    };

    module.exports = Parser;
}());
