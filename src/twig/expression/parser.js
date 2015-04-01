import Parser from '../../parser';

const DEFINITIONS = {
    /**
     * Define how `variable` should be parsed
     */
    variable: function(result) {
        result.add('variable', {
            name: this.name
        });

        return true;
    }
};

// @TODO: Build real Twig expression parser
export default class TwigExpressionParser extends Parser {
    get definitions() {
        return DEFINITIONS;
    }
}
