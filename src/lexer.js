import TokenContainer from './token-container';

/**
 * Understands how to prepare tokens from plain code
 */
export default class Lexer {
    constructor() {
        this.definitions = this.setupDefinitions();
    }

    setupDefinitions() {
        return [];
    }

    /**
     * Parse code by known definitions to tokens
     *
     * @param {String} code
     * @returns {TokenContainer}
     */
    parse(code) {
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
}
