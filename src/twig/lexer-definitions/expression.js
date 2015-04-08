/**
 * Understands how Twig expressions are built in plain code
 */
export default function buildExpressions(code, index) {
    var expression,
        endIndex;

    if (code.substr(index, 2) === '{{') {
        index += 2;

        endIndex = code.indexOf('}}', index);

        // @TODO: use ExpressionLexer
        expression = code.substr(index, endIndex - index);

        return {
            expression,
            type: 'expression',
            end: endIndex + 2
        };
    }

    return null;
}