(function() {
    'use strict';

    var Lexer = require('../lexer'),
        trim = require('../trim'),
        TwigLexer = new Lexer(),

        WHITESPACES = [ ' ', '\t', '\n' ],
        TOKENS;

    TOKENS = {
        NODE_START: 1,
        BLOCK: 2
    };

    function findWhitespace(str, index) {
        while (index < str.length && WHITESPACES.indexOf(str.charAt(index)) === -1) {
            index++;
        }

        if (str.length === index) {
            return -1;
        }

        return index;
    }

    function findNotWhitespace(str, index) {
        while (index < str.length && WHITESPACES.indexOf(str.charAt(index)) !== -1) {
            index++;
        }

        if (str.length === index) {
            return -1;
        }

        return index;
    }

    //TwigLexer.add(function(code, index) {
    //    if (code.charAt(index) === '<') {
    //
    //    }
    //
    //    return null;
    //});

    TwigLexer.add(function(code, index) {
        var expression,
            endIndex,
            name;

        if (code.substr(index, 2) === '{%') {
            index += 2;

            index = findNotWhitespace(code, index);

            if (index === -1) {
                throw new Error('Incorrect block: name not found'); // @TODO: add line and column
            }

            endIndex = findWhitespace(code, index);

            if (endIndex === -1) {
                throw new Error('Incorrect block: whitespace on end not found'); // @TODO: add line and column
            }

            name = code.substr(index, endIndex - index);

            index = endIndex + 1; // + whitespace, not needed

            endIndex = code.indexOf('%}', index); // @TODO: allow strings with this text meanwhile

            if (endIndex === -1) {
                throw new Error('Incorrect block: closing not found'); // @TODO: add line and column
            }

            expression = trim(code.substr(index, endIndex - index));

            return {
                type: 'block',
                name: name,
                expression: expression === '' ? null : expression,
                end: endIndex + 2
            };
        }

        return null;
    });

    TwigLexer.add(function(code, index) {
        var expression,
            endIndex;

        if (code.substr(index, 2) === '{{') {
            index += 2;

            endIndex = code.indexOf('}}', index);

            // @TODO: use ExpressionLexer
            expression = code.substr(index, endIndex - index);

            return {
                type: 'expression',
                expression: expression,
                end: endIndex + 2
            };
        }

        return null;
    });

    module.exports = TwigLexer;
}());
