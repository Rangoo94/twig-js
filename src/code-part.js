(function() {
    'use strict';

    /**
     * Understands structure of template
     *
     * @constructor
     */
    function CodePart() {
        this.children = [];
    }

    /**
     * Create root code part
     *
     * @returns {CodePart}
     */
    CodePart.createBase = function() {
        return new CodePart();
    };

    CodePart.prototype = {
        /**
         * Add new element to this structure
         *
         * @param {string} type
         * @param {*} [data]
         * @param {CodePart} [codePart]
         */
        add: function(type, data, codePart) {
            this.children.push({
                type: type,
                data: data,
                children: codePart || null
            });
        }
    };

    module.exports = CodePart;
}());
