/**
 * Understands how to show built structure
 */
export default class Engine {
    /**
     * @param {Lexer} lexer
     * @param {Parser} parser
     */
    constructor(lexer, parser) {
        this.lexer = lexer;
        this.parser = parser;
    }

    get definitions() {
        return {};
    }

    /**
     * Get initial result for showing
     *
     * @returns {*}
     */
    get initial() {
    }

    /**
     * Alias for parsing plain code to structure
     *
     * @param {String} code
     * @returns {CodeStructure}
     */
    parseToStructure(code) {
        this.parser.parse(this.lexer.parse(code));
    }

    /**
     * Parse structure to understandable result
     *
     * @param {CodeStructure} structure
     * @returns {*}
     */
    parse(structure) {
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
    }

    /**
     * Alias for `parse` method to parse plain code
     *
     * @param {String} code
     * @returns {*}
     */
    parseFromString(code) {
        return this.parse(this.parseToStructure(code));
    }
}
