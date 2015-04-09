import Lexer from '../../lexer';

function buildVariables(code) {
    return {
        type: 'variable',
        name: code,
        end: code.length
    };
}

// @TODO: Build real Twig expression lexer instead of that whole string is variable name
export default class TwigExpressionLexer extends Lexer {
    prepareDefinitions() {
        this.definitions.clear();
        this.definitions.add('variable', buildVariables, true);
    }
}
