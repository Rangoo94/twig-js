(function() {
    'use strict';

    /**
     * Understands how tokens should be grouped
     *
     * @param {Object[]} tokens
     * @constructor
     */
    function TokenContainer(tokens) {
        this.tokens = tokens || [];
    }

    TokenContainer.prototype = {
        /**
         * Add token to container
         *
         * @param {Object} token
         */
        add: function(token) {
            this.tokens.push(token);
        },

        /**
         * Prepare and add plain-text token to container
         *
         * @param {String} text
         */
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

        /**
         * Slice part of container to new one
         *
         * @param {Number} start
         * @param {Number} [end]
         * @returns {TokenContainer}
         */
        slice: function(start, end) {
            return new TokenContainer(this.tokens.slice(start, end));
        },

        /**
         * Find index of token which pass selected rules
         *
         * @param {Function} rule
         * @param {Number} [start]
         * @returns {Number} Index when token has been found or -1 if not found
         */
        indexOf: function(rule, start) {
            start = start || 0;

            while (start < this.tokens.length) {
                if (rule(this.tokens[start])) {
                    return start;
                }

                start++;
            }

            return -1;
        },

        /**
         * Find token at specified index
         *
         * @param {Number} index
         * @returns {Object}
         */
        tokenAt: function(index) {
            return this.tokens[index];
        }
    };

    module.exports = TokenContainer;
}());
