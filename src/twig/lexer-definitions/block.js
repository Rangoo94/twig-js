import { findWhitespace, findNotWhitespace } from '../../utils';
/**
 * Understands how Twig blocks are built in plain code
 */
export default function buildBlocks(code, index) {
    var expression,
        endIndex,
        name;

    if (code.substr(index, 2) === '{%') {
        index += 2;

        index = findNotWhitespace(code, index);

        if (index === -1 || code.substr(index, 2) === '%}') {
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

        expression = code.substring(index, endIndex).trim();

        return {
            name,
            type: 'block',
            expression: expression === '' ? null : expression,
            end: endIndex + 2
        };
    }

    return null;
}