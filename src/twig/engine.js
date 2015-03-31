import Engine from '../engine';
import TwigLexer from './lexer';
import TwigParser from './parser';

export default class TwigEngine extends Engine {
    constructor() {
        super(new TwigLexer(), new TwigParser());
    }

    get initial() {
        return '';
    }

    get definitions() {
        return {};
    }
}
