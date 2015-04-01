import Engine from '../engine';
import TwigLexer from './lexer';
import TwigParser from './parser';
import TwigExpressionEngine from './expression/engine';

export default class TwigEngine extends Engine {
    constructor() {
        this.expressionEngine = new TwigExpressionEngine();
        super(new TwigLexer(), new TwigParser());
    }

    parseFromString(template, data) {
        return super.parseFromString(template, data || {});
    }

    get initial() {
        return '';
    }

    get definitions() {
        return {
            'plain-text': function(result) {
                return result + this.data;
            },

            'if': function(result, data, idx, structure, engine) {
                let truth = true,
                    i = 0;

                if (this.data.truth !== true) {
                    truth = engine.expressionEngine.parseFromString(this.data.truth, data);
                }

                while (truth && i < this.data.negations.length) {
                    truth = !engine.expressionEngine.parseFromString(this.data.negations[i], data);
                    i++;
                }

                if (truth) {
                    return result + engine.parse(this.children, data);
                } else {
                    return result;
                }
            }
        };
    }
}
