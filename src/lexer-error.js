function LexerError(message, index, code) {
    var line = 0, column = null, tmpIndex = -1;

    code = code.split('\n');

    while (tmpIndex < index && line < code.length) {
        if (index < tmpIndex + code[line].length) {
            column = index - tmpIndex;
            line++;
            break;
        } else {
            tmpIndex += code[line].length + 1;
            line++;
        }
    }

    if (column === null) {
        line = column = 'unknown';
    }

    this.name = 'LexerError';
    this.message = message + ' at line ' + line + ', column: ' + column;
    this.stack = (new Error()).stack;
}

LexerError.prototype = Error.prototype;

export default LexerError;
