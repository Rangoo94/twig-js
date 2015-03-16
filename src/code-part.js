(function() {
    'use strict';

    function CodePart() {
        this.children = [];
    }

    CodePart.createBase = function() {
        return new CodePart();
    };

    CodePart.prototype = {
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
