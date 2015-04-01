import Engine from '../../engine';
import TwigExpressionLexer from './lexer';
import TwigExpressionParser from './parser';

export default class TwigExpressionEngine extends Engine {
    constructor() {
        super(new TwigExpressionLexer(), new TwigExpressionParser());
    }

    parseFromString(template, data) {
        return super.parseFromString(template, data || {});
    }

    get initial() {
        return void 0;
    }

    get definitions() {
        return {
            'variable': function(result, data) {
                return data[this.data.name];
            }
        };
    }
}
