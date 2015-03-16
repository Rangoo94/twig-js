(function() {
    'use strict';

    function TokenContainer(tokens) {
        this.tokens = tokens || [];
    }

    function prepareTypeChecker(expected) {
        return function(token) {
            return expected === token.type;
        };
    }

    TokenContainer.prototype = {
        add: function(token) {
            this.tokens.push(token);
        },

        addPlainText: function(text) {
            if (text.length) {
                if (this.tokens.length && this.tokens[this.tokens.length - 1].type === 'plain-text') {
                    this.tokens[this.tokens.length - 1].text += text;
                } else {
                    this.add({
                        type: 'plain-text',
                        text: text
                    });
                }
            }
        },

        each: function(func) {
            for (var i = 0; i < this.tokens; i++) {
                func(this.tokens[i], i, this.tokens);
            }
        },

        slice: function(start, end) {
            return new TokenContainer(this.tokens.slice(start, end));
        },

        sliceTo: function(start, end) {
            var container = this.indexOf(end, start);

            if (container === -1) {
                return null;
            }

            return this.slice(start, container);
        },

        indexOf: function(el, start) {
            if (typeof el === 'string') {
                el = prepareTypeChecker(el);
            } else if (typeof el !== 'function') {
                return this.tokens.indexOf(el, start);
            }

            start = start || 0;

            while (start < this.tokens.length) {
                if (el(this.tokens[start])) {
                    return start;
                }

                start++;
            }

            return -1;
        },

        tokenAt: function(index) {
            return this.tokens[index];
        }
    };

    module.exports = TokenContainer;
}());
