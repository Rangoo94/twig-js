import Lexer from '../lexer';

const WHITESPACES = [ ' ', '\t', '\n' ];

// @TODO: Think about rewriting it to regular expressions

/**
 * Find index of first character from array after specified index
 *
 * @param {String} str
 * @param {Number} index
 * @param {Array} characters
 * @param {Boolean} [opposite] if true - not whitespace
 * @returns {Number}
 */
function indexOf(str, index, characters, opposite) {
    while (index < str.length) {
        index++;

        if ((opposite ? 1 : 0) - (characters.indexOf(str.charAt(index)) !== -1)) {
            return index;
        }
    }

    return -1;
}

/**
 * Find index of first whitespace character after specified index
 *
 * @param {String} str
 * @param {Number} index
 * @param {Boolean} [opposite] if true - not whitespace
 * @returns {Number}
 */
function findWhitespace(str, index, opposite) {
    return indexOf(str, index, WHITESPACES, opposite);
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

            expression = code.substring(index, endIndex).trim();

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
            if (code.charAt(index + 1) === '/') {
                let idx = code.indexOf('>', index + 1);

                return {
                    type: 'node_closing',
                    tag: code.substring(index + 2, idx).trim(),
                    end: idx + 1
                };
            } else {
                let currentIdx = indexOf(code, index, WHITESPACES.concat([ '>' ])),
                    closingIdx,
                    attributes = {},
                    attrIdx,
                    attribute,
                    tag;

                if (currentIdx === -1) {
                    throw new Error('Not found closing of node');
                }

                tag = code.substring(index + 1, currentIdx).trim();

                closingIdx = code.indexOf('>', currentIdx);

                if (closingIdx === -1) {
                    throw new Error('Not found closing of node');
                }

                attrIdx = indexOf(code, currentIdx, WHITESPACES.concat([ '>', '=' ]));

                while (attrIdx <= closingIdx) {
                    attribute = {
                        name: code.substring(currentIdx, attrIdx).trim()
                    };

                    if (code.charAt(attrIdx) === '=') {
                        let startIdx,
                            endIdx;

                        if (code.charAt(attrIdx + 1) === '"') {
                            startIdx = attrIdx + 2;
                            endIdx = code.indexOf('"', startIdx);
                        } else if (code.charAt(attrIdx + 1) === '\'') {
                            startIdx = attrIdx + 2;
                            endIdx = code.indexOf('\'', startIdx);
                        } else {
                            startIdx = attrIdx + 1;
                            endIdx = indexOf(code, attrIdx, WHITESPACES.concat([ '>' ]));
                        }

                        attribute.value = code.substring(startIdx, endIdx);
                        attrIdx = endIdx + 1;
                    } else {
                        attribute.value = null;
                        attrIdx++;
                    }

                    currentIdx = attrIdx;
                    attrIdx = indexOf(code, attrIdx, WHITESPACES.concat([ '>', '=' ]));

                    attributes[attribute.name] = attribute.value;
                }

                return {
                    type: 'node_opening',
                    tag: tag,
                    attributes: attributes,
                    end: closingIdx + 1
                };
            }
        }

        return null;
    }
];

export default class TwigLexer extends Lexer {
    get definitions() {
        return DEFINITIONS;
    }
}
