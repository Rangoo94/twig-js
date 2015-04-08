import { findWhitespace, findNotWhitespace } from '../../utils';
import LexerError from '../../lexer-error';

/**
 * Understands how Twig blocks are built in plain code
 */
export default function buildBlocks(code, index) {
    var expression,
        startIndex = index,
        endIndex,
        name;

    if (code.substr(index, 2) === '{%') {
        index += 2;

        index = findNotWhitespace(code, index);

        if (index === -1 || code.substr(index, 2) === '%}') {
            throw new LexerError('Incorrect block: name not found', startIndex, code);
        }

        endIndex = findWhitespace(code, index);

        if (endIndex === -1) {
            throw new LexerError('Incorrect block: whitespace on end not found', startIndex, code);
        }

        name = code.substr(index, endIndex - index);

        index = endIndex + 1; // + whitespace, not needed

        endIndex = code.indexOf('%}', index); // @TODO: allow strings with this text meanwhile

        if (endIndex === -1) {
            throw new LexerError('Incorrect block: closing not found', startIndex, code);
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