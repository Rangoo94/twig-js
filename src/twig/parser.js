import Parser from '../parser';

/**
 * Build rule to detect if token is specified block
 *
 * @param {String} name
 * @returns {Function}
 */
function findBlock(name) {
    return function(token) {
        return token.type === 'block' && token.name === name;
    };
}

const BLOCKS = {
    /**
     * Define conditional block
     *
     * @throws {Error} if closing is not found
     */
    'if': function(result, i, tokens, parser) {
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
    }
};

const DEFINITIONS = {
    /**
     * Define how `block` should be parsed
     * Search if there is available block and call its definition
     *
     * @throws {Error}  if it's unknown block
     */
    block: function(result, i, tokens, parser) {
        if (!BLOCKS[this.name]) {
            throw new Error('Incorrect block: `' + this.name + '` definition not found');
        }

        return BLOCKS[this.name].call(this, result, i, tokens, parser);
    }
};

var attachedDefinitions = false;

export default class TwigParser extends Parser {
    get definitions() {
        if (!attachedDefinitions) {
            attachedDefinitions = true;

            Object.keys(super.definitions).forEach((key) => {
                DEFINITIONS[key] = super.definitions[key];
            });
        }

        return DEFINITIONS;
    }
}
