export const WHITESPACES = [ ' ', '\t', '\n' ];

/**
 * Find index of first character from array after specified index
 *
 * @param {String} str
 * @param {Number} index
 * @param {Array} characters
 * @param {Boolean} [opposite] if true - not whitespace
 * @returns {Number}
 */
export function indexOf(str, index, characters, opposite) {
    while (index < str.length) {
        index++;

        if ((opposite ? 1 : 0) - (characters.indexOf(str.charAt(index)) !== -1)) {
            return index;
        }
    }

    return -1;
}

/**
 * Find index of first whitespace character after specified index
 *
 * @param {String} str
 * @param {Number} index
 * @param {Boolean} [opposite] if true - not whitespace
 * @returns {Number}
 */
export function findWhitespace(str, index, opposite) {
    return indexOf(str, index, WHITESPACES, opposite);
}

/**
 * Find index of first character after specified index which is not whitespace
 *
 * @param {String} str
 * @param {Number} index
 * @returns {Number}
 */
export function findNotWhitespace(str, index) {
    return findWhitespace(str, index, true);
}