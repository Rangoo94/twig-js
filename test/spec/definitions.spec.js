import Definitions from '../../src/definitions';

var expect = require('expect.js');

describe('Definitions', () => {
    it('should create `Definitions` object', () => {
        expect(typeof new Definitions()).to.be('object');
    });

    it('should add definition', () => {
        var definitions = new Definitions();

        expect(Object.keys(definitions.defs).length).to.be(0);

        definitions.add('example', function() {});

        expect(Object.keys(definitions.defs).toString()).to.be('example');

        definitions.add('example2', function() {});

        expect(Object.keys(definitions.defs).toString()).to.be('example,example2');
    });

    it('should overwrite definition', () => {
        var definitions = new Definitions();

        definitions.add('example', function() {});
        definitions.add('example2', function() {});

        expect(Object.keys(definitions.defs).toString()).to.be('example,example2');
        
        definitions.add('example2', function() {});

        expect(Object.keys(definitions.defs).toString()).to.be('example,example2');
    });
});
