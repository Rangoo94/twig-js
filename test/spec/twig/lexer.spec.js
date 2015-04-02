import TwigLexer from '../../../src/twig/lexer';

var expect = require('expect.js'),
    lexer = new TwigLexer();

function count(obj) {
    var len = 0;

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            len++;
        }
    }

    return len;
}

describe('Twig#Lexer', () => {
    it('should find only one (plain-text) token', () => {
        var tokens = lexer.parse('lorem ipsum dolor sit amet').tokens;

        expect(tokens.length).to.be(1);
        expect(tokens[0].type).to.be('plain-text');
    });

    it('should find `if` & `endif` blocks, and two plain-text blocks', () => {
        var tokens = lexer.parse('lorem ipsum{% if x %} dolor sit amet{% endif %}').tokens;

        expect(tokens.length).to.be(4);

        expect(tokens[0].text).to.be('lorem ipsum');

        expect(tokens[1].type).to.be('block');
        expect(tokens[1].name).to.be('if');
        expect(tokens[1].expression).to.be('x');

        expect(tokens[2].text).to.be(' dolor sit amet');

        expect(tokens[3].type).to.be('block');
        expect(tokens[3].name).to.be('endif');
        expect(tokens[3].expression).to.be(null);
    });

    it('should find basic node start and opening', () => {
        var tokens = lexer.parse('<b>lorem ipsum dolor</b>sit amet').tokens;

        expect(tokens.length).to.be(4);

        expect(tokens[0].type).to.be('node_opening');
        expect(tokens[0].tag).to.be('b');

        expect(tokens[1].type).to.be('plain-text');
        expect(tokens[1].text).to.be('lorem ipsum dolor');

        expect(tokens[2].type).to.be('node_closing');
        expect(tokens[2].tag).to.be('b');

        expect(tokens[3].type).to.be('plain-text');
        expect(tokens[3].text).to.be('sit amet');
    });

    it('should find basic node with one attribute', () => {
        var tokens = lexer.parse('<b style="font-style: italic">lorem ipsum dolor</b>').tokens;

        expect(tokens[0].type).to.be('node_opening');
        expect(tokens[0].tag).to.be('b');

        expect(count(tokens[0].attributes)).to.be(1);
        expect(tokens[0].attributes.style).to.be('font-style: italic');

        expect(tokens[1].type).to.be('plain-text');
        expect(tokens[1].text).to.be('lorem ipsum dolor');

        expect(tokens[2].type).to.be('node_closing');
        expect(tokens[2].tag).to.be('b');
    });

    it('should find basic node with attributes', () => {
        var tokens = lexer.parse('<b style="font-style: italic" class="something">lorem ipsum dolor</b>').tokens;

        expect(tokens[0].type).to.be('node_opening');
        expect(tokens[0].tag).to.be('b');

        expect(count(tokens[0].attributes)).to.be(2);

        expect(tokens[0].attributes.style).to.be('font-style: italic');
        expect(tokens[0].attributes.class).to.be('something');
    });

    it('should replace attribute value if it occurs twice', () => {
        var tokens = lexer.parse('<b class="unknown" style="font-style: italic" class="something">lorem ipsum dolor</b>').tokens;

        expect(tokens[0].type).to.be('node_opening');
        expect(tokens[0].tag).to.be('b');

        expect(count(tokens[0].attributes)).to.be(2);

        expect(tokens[0].attributes.style).to.be('font-style: italic');
        expect(tokens[0].attributes.class).to.be('something');
    });

    it('should find attribute without value', () => {
        var tokens = lexer.parse('<b style="font-style: italic" data-value>lorem ipsum dolor</b>').tokens;

        expect(tokens[0].type).to.be('node_opening');
        expect(tokens[0].tag).to.be('b');

        expect(count(tokens[0].attributes)).to.be(2);

        expect(tokens[0].attributes.style).to.be('font-style: italic');
        expect(tokens[0].attributes['data-value']).to.be(null);
    });

    it('should throw error that closing of block hasn\'t been found', () => {
        expect(() => {
            lexer.parse('lorem ipsum{% if x %} dolor sit amet{% endif  ');
        }).to.throwError();
    });

    it('should throw error that block name hasn\'t been found', () => {
        expect(() => {
            lexer.parse('lorem ipsum{%    %} dolor sit amet{% endif %}');
        }).to.throwError();
    });
});
