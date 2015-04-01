import TwigExpressionLexer from '../../../../src/twig/expression/lexer';
import TwigExpressionParser from '../../../../src/twig/expression/parser';

var expect = require('expect.js'),
    lexer = new TwigExpressionLexer(),
    parser = new TwigExpressionParser();

describe('TwigExpression#Parser', () => {
    it('should parse simple variable to one block', () => {
        let result = parser.parse(lexer.parse('abc'));

        expect(result.children.length).to.be(1);
        expect(result.children[0].type).to.be('variable');
        expect(result.children[0].data.name).to.be('abc');
    });
});
