import Lexer from '../lexer';
import buildExpressions from './lexer-definitions/expression';
import buildBlocks from './lexer-definitions/block';
import buildNodes from './lexer-definitions/node';

export default class TwigLexer extends Lexer {
    prepareDefinitions() {
        this.definitions.add('expression', buildExpressions);
        this.definitions.add('block', buildBlocks);
        this.definitions.add('node', buildNodes);
    }
}
