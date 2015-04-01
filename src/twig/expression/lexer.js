import Lexer from '../../lexer';

const DEFINITIONS = [
    function buildVariables(code) {
        return {
            type: 'variable',
            name: code,
            end: code.length
        };
    }
];

// @TODO: Build real Twig expression lexer instead of that whole string is variable name
export default class TwigExpressionLexer extends Lexer {
    get definitions() {
        return DEFINITIONS;
    }
}
