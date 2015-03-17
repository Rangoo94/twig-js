(function() {
    'use strict';

    /**
     * Understands structure of template
     *
     * @constructor
     */
    function CodeStructure() {
        this.children = [];
    }

    /**
     * Create root code part
     *
     * @returns {CodeStructure}
     */
    CodeStructure.createBase = function() {
        return new CodeStructure();
    };

    CodeStructure.prototype = {
        /**
         * Add new element to this structure
         *
         * @param {string} type
         * @param {*} [data]
         * @param {CodeStructure} [codePart]
         */
        add: function(type, data, codePart) {
            this.children.push({
                type: type,
                data: data,
                children: codePart || null
            });
        }
    };

    module.exports = CodeStructure;
}());
