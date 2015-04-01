import TwigExpressionEngine from '../../../../src/twig/expression/engine';

var expect = require('expect.js'),
    engine = new TwigExpressionEngine();

describe('TwigExpression#Engine', () => {
    it('should parse simple variable to value', () => {
        expect(engine.parseFromString('abc')).to.be(void 0);

        expect(engine.parseFromString('abc', {
            abc: 10
        })).to.be(10);
    });
});
