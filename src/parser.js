import CodeStructure from './code-structure';

/**
 * It should parse everything to basic structure elements:
 * - if
 * - expression
 * - loop
 * - plain-text
 * - node (and other node connected things like attributes) - @TODO
 */

const DEFINITIONS = {
    'plain-text': function(result) {
        result.add('plain-text', this.text);
    }
};

/**
 * Understands how to create structure from tokens
 */
export default class Parser {
    get definitions() {
        return DEFINITIONS;
    }

    /**
     * Parse tokens to structure against known definitions
     *
     * @param {TokenContainer} tokens
     * @returns {CodeStructure}
     */
    parse(tokens) {
        var result = new CodeStructure(),
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
    }
}
