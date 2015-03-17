(function() {
    'use strict';

    var Engine = require('../engine'),
        twigLexer = require('../lexer'),
        twigParser = require('../parser'),
        twigEngine = new Engine(twigLexer, twigParser);


    twigEngine.setInitialResult(function() {
        return '';
    });

    module.exports = twigEngine;
}());
