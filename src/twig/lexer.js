import Lexer from '../lexer';

const WHITESPACES = [ ' ', '\t', '\n' ];

/**
 * Find index of first whitespace character after specified index
 *
 * @param {String} str
 * @param {Number} index
 * @param {Boolean} [opposite] if true - not whitespace
 * @returns {Number}
 */
function findWhitespace(str, index, opposite) {
    while (index < str.length) {
        index++;

        if ((opposite ? 1 : 0) - (WHITESPACES.indexOf(str.charAt(index)) !== -1)) {
            return index;
        }
    }

    return -1;
}

/**
 * Find index of first character after specified index which is not whitespace
 *
 * @param {String} str
 * @param {Number} index
 * @returns {Number}
 */
function findNotWhitespace(str, index) {
    return findWhitespace(str, index, true);
}

const DEFINITIONS = [
    /**
     * Understands how Twig expressions are built in plain code
     */
    function buildExpressions(code, index) {
        var expression,
            endIndex;

        if (code.substr(index, 2) === '{{') {
            index += 2;

            endIndex = code.indexOf('}}', index);

            // @TODO: use ExpressionLexer
            expression = code.substr(index, endIndex - index);

            return {
                type: 'expression',
                expression: expression,
                end: endIndex + 2
            };
        }

        return null;
    },

    /**
     * Understands how Twig blocks are built in plain code
     */
    function buildBlocks(code, index) {
        var expression,
            endIndex,
            name;

        if (code.substr(index, 2) === '{%') {
            index += 2;

            index = findNotWhitespace(code, index);

            if (index === -1 || code.substr(index, 2) === '%}') {
                throw new Error('Incorrect block: name not found'); // @TODO: add line and column
            }

            endIndex = findWhitespace(code, index);

            if (endIndex === -1) {
                throw new Error('Incorrect block: whitespace on end not found'); // @TODO: add line and column
            }

            name = code.substr(index, endIndex - index);

            index = endIndex + 1; // + whitespace, not needed

            endIndex = code.indexOf('%}', index); // @TODO: allow strings with this text meanwhile

            if (endIndex === -1) {
                throw new Error('Incorrect block: closing not found'); // @TODO: add line and column
            }

            expression = code.substr(index, endIndex - index).trim();

            return {
                type: 'block',
                name: name,
                expression: expression === '' ? null : expression,
                end: endIndex + 2
            };
        }

        return null;
    },

    /**
     * Understands how nodes are built in plain code
     */
    function buildNodes(code, index) {
        if (code.charAt(index) === '<') {
            return null;
        }

        return null;
    }
];

export default class TwigLexer extends Lexer {
    get definitions() {
        return DEFINITIONS;
    }
}
