import { indexOf, WHITESPACES } from '../../utils';
import LexerError from '../../lexer-error';

/**
 * Understands how nodes are built in plain code
 */
export default function buildNodes(code, index) {
    if (code.charAt(index) === '<') {
        if (code.charAt(index + 1) === '/') {
            let idx = code.indexOf('>', index + 1);

            return {
                type: 'node_closing',
                tag: code.substring(index + 2, idx).trim(),
                end: idx + 1
            };
        } else {
            let currentIdx = indexOf(code, index, WHITESPACES.concat([ '>' ])),
                closingIdx,
                attributes = {},
                attrIdx,
                attribute,
                tag;

            if (currentIdx === -1) {
                throw new LexerError('Incorrect node: not found closing', index, code);
            }

            tag = code.substring(index + 1, currentIdx).trim();

            closingIdx = code.indexOf('>', currentIdx);

            if (closingIdx === -1) {
                throw new LexerError('Incorrect node: not found closing', index, code);
            }

            attrIdx = indexOf(code, currentIdx, WHITESPACES.concat([ '>', '=' ]));

            while (attrIdx <= closingIdx) {
                attribute = {
                    name: code.substring(currentIdx, attrIdx).trim()
                };

                if (code.charAt(attrIdx) === '=') {
                    let startIdx,
                        endIdx;

                    if (code.charAt(attrIdx + 1) === '"') {
                        startIdx = attrIdx + 2;
                        endIdx = code.indexOf('"', startIdx);
                    } else if (code.charAt(attrIdx + 1) === '\'') {
                        startIdx = attrIdx + 2;
                        endIdx = code.indexOf('\'', startIdx);
                    } else {
                        startIdx = attrIdx + 1;
                        endIdx = indexOf(code, attrIdx, WHITESPACES.concat([ '>' ]));
                    }

                    attribute.value = code.substring(startIdx, endIdx);
                    attrIdx = endIdx + 1;
                } else {
                    attribute.value = null;
                    attrIdx++;
                }

                currentIdx = attrIdx;
                attrIdx = indexOf(code, attrIdx, WHITESPACES.concat([ '>', '=' ]));

                attributes[attribute.name] = attribute.value;
            }

            return {
                tag,
                type: 'node_opening',
                attributes: attributes,
                end: closingIdx + 1
            };
        }
    }

    return null;
}