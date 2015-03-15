(function() {
    'use strict';

    function ltrim(str) {
        var start = 0;

        while ([ ' ', '\n', '\t' ].indexOf(str.charAt(start)) !== -1) {
            start++;
        }

        if (start > str.length) {
            return '';
        } else {
            return str.substr(start);
        }
    }

    function rtrim(str) {
        var end = str.length - 1;

        while ([ ' ', '\n', '\t' ].indexOf(str.charAt(end)) !== -1) {
            end--;
        }

        if (end < 0) {
            return '';
        } else {
            return str.substr(0, end + 1);
        }
    }

    module.exports = function trim(str) {
        return ltrim(rtrim(str));
    };
}());
