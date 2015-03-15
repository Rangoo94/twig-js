(function() {
    'use strict';

    var expect = require('expect.js'),
        twigLexer = require('../../src/twig/lexer');

    describe('Twig', function() {
        describe('Lexer', function() {
            it('should find only one (plain-text) token', function() {
                var tokens = twigLexer.parse('lorem ipsum dolor sit amet').tokens;

                expect(tokens.length).to.be(1);
                expect(tokens[0].type).to.be('plain-text');
            });

            it('should find `if` & `endif` blocks, and two plain-text blocks', function() {
                var tokens = twigLexer.parse('lorem ipsum{% if x %} dolor sit amet{% endif %}').tokens;

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

            it('should throw error that closing of block hasn\'t been found', function() {
                expect(function() {
                    twigLexer.parse('lorem ipsum{% if x %} dolor sit amet{% endif  ');
                }).to.throwError();
            });
        });
    });
}());
