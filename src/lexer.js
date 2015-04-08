import TokenContainer from './token-container';
import Definitions from './definitions';

/**
 * Understands how to prepare tokens from plain code
 */
export default class Lexer {
    constructor() {
        this.definitions = new Definitions();
        this.prepareDefinitions();
    }

    /**
     * Prepare definitions here
     */
    prepareDefinitions() {
    }

    /**
     * Parse code by known definitions to tokens
     *
     * @param {String} code
     * @returns {TokenContainer}
     */
    parse(code) {
        var tokens = new TokenContainer();

        for (var i = 0; i < code.length; i++) {
            let found = false;

            this.definitions.each((definition, name, iterator) => {
                let result = definition.run(code, i, tokens);

                if (result !== null) {
                    tokens.add(result);
                    i = result.end - 1;
                    iterator.stop();
                    found = true;
                }
            });

            if (!found) {
                tokens.addPlainText(code.charAt(i));
            }
        }

        return tokens;
    }
}
