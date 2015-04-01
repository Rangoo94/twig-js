import TwigEngine from '../../../src/twig/engine';

var expect = require('expect.js');

const BASIC_TEMPLATE = '{% if x %}xyz{% else %}abc{% endif %}';

describe('Twig#Engine', () => {
    it('should render specified template', () => {
        let engine = new TwigEngine();

        expect(engine.parseFromString(BASIC_TEMPLATE)).to.be('abc');

        expect(engine.parseFromString(BASIC_TEMPLATE, {
            x: true
        })).to.be('xyz');
    });
});
