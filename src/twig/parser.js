(function() {
    'use strict';

    var Parser = require('../parser'),
        twigParser = new Parser();

    /**
     * Build rule to detect if token is specified block
     *
     * @param {string} name
     * @returns {Function}
     */
    function findBlock(name) {
        return function(token) {
            return token.type === 'block' && token.name === name;
        };
    }

    twigParser.blocks = {};
    twigParser.filters = {}; // @TODO: move to rendering engine
    twigParser.functions = {}; // @TODO: move to rendering engine


    /**
     * Add new block definition
     *
     * @param {string} name
     * @param {Function} func  understands how this block should be detected within tokens
     */
    twigParser.addBlock = function(name, func) {
        twigParser.blocks[name] = func;
    };

    /**
     * Add new filter available in engine
     *
     * @TODO: move to rendering engine
     * @param {string} name
     * @param {Function} func
     */
    twigParser.addFilter = function(name, func) {
        twigParser.filters[name] = func;
    };

    /**
     * Add new function available in engine
     *
     * @TODO: move to rendering engine
     * @param {string} name
     * @param {Function} func
     */
    twigParser.addFunction = function(name, func) {
        twigParser.functions[name] = func;
    };

    // Basic definitions

    /**
     * Define how `block` should be parsed
     * Search if there is available block and call its definition
     *
     * @throws {Error}  if it's unknown block
     */
    twigParser.addDefinition('block', function(result, i, tokens, parser) {
        if (!twigParser.blocks[this.name]) {
            throw new Error('Incorrect block: `' + this.name + '` definition not found');
        }

        return twigParser.blocks[this.name].call(this, result, i, tokens, parser);
    });

    // Block definitions

    /**
     * Define conditional block
     *
     * @throws {Error} if closing is not found
     */
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
