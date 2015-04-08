import Lexer from '../lexer';
import buildExpressions from './lexer-definitions/expression';
import buildBlocks from './lexer-definitions/block';
import buildNodes from './lexer-definitions/node';

export default class TwigLexer extends Lexer {
    prepareDefinitions() {
        this.definitions.add('expression', buildExpressions, true);
        this.definitions.add('block', buildBlocks, true);
        this.definitions.add('node', buildNodes, true);
    }
}
