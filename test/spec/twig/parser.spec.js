import TwigLexer from '../../../src/twig/lexer';
import TwigParser from '../../../src/twig/parser';

var expect = require('expect.js'),
    lexer = new TwigLexer(),
    parser = new TwigParser();

describe('Twig#Parser', () => {
    it('should parse only plain-text token', () => {
        var tokens = lexer.parse('lorem ipsum dolor sit amet'),
            structure = parser.parse(tokens);

        expect(structure.children.length).to.be(1);
        expect(structure.children[0].type).to.be('plain-text');
        expect(structure.children[0].data).to.be('lorem ipsum dolor sit amet');
    });

    it('should parse basic `if` structure', () => {
        var tokens = lexer.parse('{% if x %}lorem ipsum dolor sit amet{% endif %}'),
            structure;

        structure = parser.parse(tokens);

        expect(structure.children.length).to.be(1);
        expect(structure.children[0].type).to.be('if');
        expect(structure.children[0].children.children.length).to.be(1);
        expect(structure.children[0].children.children[0].type).to.be('plain-text');
        expect(structure.children[0].children.children[0].children).to.be(null);
    });

    it('should parse more advanced `if` (with `elseif`) structure', () => {
        var tokens = lexer.parse('{% if x %}lorem ipsum dolor sit amet{% elseif y %}abc{% endif %}'),
            structure;

        structure = parser.parse(tokens);

        expect(structure.children.length).to.be(2);
        expect(structure.children[0].type).to.be('if');
        expect(structure.children[1].type).to.be('if');
        expect(structure.children[0].children.children.length).to.be(1);
        expect(structure.children[0].children.children[0].type).to.be('plain-text');
        expect(structure.children[0].children.children[0].children).to.be(null);
        expect(structure.children[1].children.children.length).to.be(1);
        expect(structure.children[1].children.children[0].type).to.be('plain-text');
        expect(structure.children[1].children.children[0].children).to.be(null);
    });

    it('should parse full `if` (with `elseif` and `else`) structure', () => {
        var tokens = lexer.parse(
                '{% if  x %}lorem ipsum dolor sit amet{% elseif y %}abc{% else %}different{% endif %}'
            ),
            structure;

        structure = parser.parse(tokens);

        expect(structure.children.length).to.be(3);
        expect(structure.children[0].type).to.be('if');
        expect(structure.children[1].type).to.be('if');
        expect(structure.children[2].type).to.be('if');
        expect(structure.children[0].children.children.length).to.be(1);
        expect(structure.children[0].children.children[0].type).to.be('plain-text');
        expect(structure.children[0].children.children[0].children).to.be(null);
        expect(structure.children[1].children.children.length).to.be(1);
        expect(structure.children[1].children.children[0].type).to.be('plain-text');
        expect(structure.children[1].children.children[0].children).to.be(null);
        expect(structure.children[2].children.children.length).to.be(1);
        expect(structure.children[2].children.children[0].type).to.be('plain-text');
        expect(structure.children[2].children.children[0].children).to.be(null);
    });
});
