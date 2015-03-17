(function() {
    'use strict';

    function Engine(lexer, parser) {
        this.definitions = {};
        this.lexer = lexer;
        this.parser = parser;
    }

    Engine.prototype = {
        setInitialResult: function(func) {
            this.getInitialResult = func;
        },

        getInitialResult: function() {
        },

        parseToStructure: function(code) {
            return this.parser.parse(this.lexer.parse(code));
        },

        parseFromString: function(code) {
            return this.parse(this.parseToStructure(code));
        },

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

        addDefinition: function(type, func) {
            this.definitions[type] = func;
        }
    };

    module.exports = Engine;
}());
