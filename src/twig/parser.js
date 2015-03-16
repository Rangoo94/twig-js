(function() {
    'use strict';

    var Parser = require('../parser'),
        twigParser = new Parser();

    function findBlock(name) {
        return function(token) {
            return token.type === 'block' && token.name === name;
        };
    }

    twigParser.blocks = {};
    twigParser.filters = {};
    twigParser.functions = {};


    twigParser.addBlock = function(name, func) {
        twigParser.blocks[name] = func;
    };

    twigParser.addFilter = function(name, func) {
        twigParser.filters[name] = func;
    };

    twigParser.addFunction = function(name, func) {
        twigParser.functions[name] = func;
    };

    // Basic definitions

    twigParser.addDefinition('block', function(result, i, tokens, parser) {
        if (!twigParser.blocks[this.name]) {
            throw new Error('Incorrect block: `' + this.name + '` definition not found');
        }

        return twigParser.blocks[this.name].call(this, result, i, tokens, parser);
    });

    // Block definitions

    twigParser.addBlock('if', function(result, i, tokens, parser) {
        var currentNegations = [],
            currentToken = this,
            currentIndex;

        currentIndex = tokens.indexOf(findBlock('elseif'), i);

        while (currentIndex !== -1) {
            result.add('if', {
                truth: currentToken.expression,
                negations: currentNegations.slice()
            }, parser.parse(tokens.slice(i + 1, currentIndex)));

            i = currentIndex;

            currentNegations.push(currentToken.expression);

            currentToken = tokens.tokenAt(currentIndex);
            currentIndex = tokens.indexOf(findBlock('elseif'), currentIndex + 1);
        }

        i++;

        currentIndex = tokens.indexOf(findBlock('else'), i);

        if (currentIndex !== -1) {
            result.add('if', {
                truth: currentToken.expression,
                negations: currentNegations.slice()
            }, parser.parse(tokens.slice(i, currentIndex)));

            currentNegations.push(currentToken.expression);

            i = currentIndex + 1;

            currentIndex = tokens.indexOf(findBlock('endif'), i);

            if (currentIndex === -1) {
                throw new Error('Not found closing of `if` statement');
            }

            result.add('if', {
                truth: true,
                negations: currentNegations.slice()
            }, parser.parse(tokens.slice(i, currentIndex)));
        } else {
            currentIndex = tokens.indexOf(findBlock('endif'), i);

            if (currentIndex === -1) {
                throw new Error('Not found closing of `if` statement');
            }

            result.add('if', {
                truth: currentToken.expression,
                negations: currentNegations.slice()
            }, parser.parse(tokens.slice(i, currentIndex)));
        }

        tokens.go(currentIndex);
    });

    module.exports = twigParser;
}());
