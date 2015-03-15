(function() {
    'use strict';

    function TokenContainer(tokens) {
        this.tokens = tokens || [];
    }

    TokenContainer.prototype = {
        PLAIN_TEXT: 'plain-text',

        add: function(token) {
            this.tokens.push(token);
        },

        addPlainText: function(text) {
            if (text.length) {
                if (this.tokens.length && this.tokens[this.tokens.length - 1].type === TokenContainer.prototype.PLAIN_TEXT) {
                    this.tokens[this.tokens.length - 1].text += text;
                } else {
                    this.add({
                        type: TokenContainer.prototype.PLAIN_TEXT,
                        text: text
                    });
                }
            }
        }
    };

    module.exports = TokenContainer;
}());
