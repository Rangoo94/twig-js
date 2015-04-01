import TwigExpressionLexer from '../../../../src/twig/expression/lexer';

var expect = require('expect.js'),
    lexer = new TwigExpressionLexer();

describe('TwigExpression#Lexer', () => {
    it('should find out that it\'s a variable', () => {
        let result = lexer.parse('abc');

        expect(result.tokens.length).to.be(1);
        expect(result.tokens[0].type).to.be('variable');
        expect(result.tokens[0].name).to.be('abc');
    });

    xit('should find out that it has few operators', () => {
        let result = lexer.parse('abc + 10  / 2');

        expect(result.tokens.length).to.be(5);
        expect(result.tokens[0].type).to.be('variable');
        expect(result.tokens[1].type).to.be('operator');
        expect(result.tokens[2].type).to.be('number');
        expect(result.tokens[3].type).to.be('operator');
        expect(result.tokens[4].type).to.be('number');
    });
});
