(function(root) {
    'use strict';

    // Helpers

    function trim(str) {
        return ltrim(rtrim(str));
    }

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


    // Understands code structure
    function Code(code, engine) {
        this.length = code.length;

        this.indexOf = function(str, startIndex) {
            return code.indexOf(str, startIndex);
        };

        this.findPart = function(startIndex, type, rule) {
            var result = startIndex;

            if (!rule) {
                rule = function() {
                    return true;
                };
            }

            do {
                result = code.indexOf(engine.parts[type].start, result);
            } while (result !== -1 && !rule(result, this));

            return result;
        };

        this.findAnyPart = function(startIndex, end) {
            var parts = [],
                result = {
                    text: '',
                    index: 0,
                    type: null,
                    end: false
                },
                idx,
                partIdx;

            for (idx in engine.parts) {
                if (engine.parts.hasOwnProperty(idx)) {
                    parts.push({
                        name: idx,
                        start: engine.parts[idx].start
                    });
                }
            }

            for (idx = startIndex || 0; idx < this.length; idx++) {
                result.index = idx;

                if (end !== void 0 && this.substr(idx, end.length) === end) {
                    result.index = idx + end.length;
                    result.end = true;
                    return result;
                }

                for (partIdx = 0; partIdx < parts.length; partIdx++) {
                    if (this.substr(idx, parts[partIdx].start.length) === parts[partIdx].start) {
                        result.type = parts[partIdx].name;
                        return result;
                    }
                }

                result.text += this.charAt(idx);
            }

            result.end = true;
            return result;
        };

        this.charAt = function(index) {
            return code.charAt(index);
        };

        this.substr = function(start, length) {
            return code.substr(start, length);
        };
    }


    // Basic template engine

    // Understands template structure
    function TemplateContainer() {
        var childrens = [];

        this.end = 0;

        this.get = function() {
            return childrens;
        };

        this.add = function(child) {
            childrens.push(child);
        };

        this.remove = function(child) {
            for (var i = 0; i < childrens.length; i++) {
                if (childrens[i] === child) {
                    childrens.splice(i, 1);
                    return;
                }
            }
        };

        this.render = function(options) {
            var result = '';

            for (var i = 0; i < childrens.length; i++) {
                result += childrens[i].render(options);
            }

            return result;
        };
    }

    // Basic engine

    // Understands how template engine is parsing code
    function Engine() {
        this.parts = [];
        this.filters = {};
        this.functions = {};

        this.parseExpression = function(/* expression, data */) {
            return null;
        };
    }

    Engine.prototype.addDefinition = function(name, start, definition) {
        this.parts.push({
            name: name,
            start: start,
            definition: definition
        });
    };

    Engine.prototype.setExpressionFunction = function(func) {
        this.parseExpression = func;
    };

    Engine.prototype.addFilter = function(name, func) {
        this.filters[name] = func;
    };

    Engine.prototype.addFunction = function(name, func) {
        this.functions[name] = func;
    };

    Engine.prototype.parse = function(code, end, index) {
        var template = new TemplateContainer(),
            current,
            el,
            i;

        code = new Code(code, this);

        index = index || 0;

        for (i = index; i < code.length; i++) {
            current = code.findAnyPart(i, end);

            if (current.text.length) {
                template.add(new TextNode(current.text));
            }

            if (current.type) {
                el = new this.parts[current.type].definition(current.index, code, this);

                template.add(el);
                i = el.end;
            } else {
                i = current.index;
            }

            if (current.end) {
                break;
            }
        }

        template.end = i;

        return template;
    };

    function TextNode(str) {
        this.render = function() {
            return str;
        };
    }


    // Twig engine

    var TwigEngine = new Engine(),
        TWIG_BLOCKS = {};

    TwigEngine.addBlock = function(name, closing, func) {
        TWIG_BLOCKS[name] = {
            closing: closing,
            render: func
        };
    };

    function TwigNode(/* index, code, engine */) {
    }

    function TwigExpression(index, code, engine) {
        var expr;

        index += 2;

        this.end = code.indexOf('}}', index);

        if (this.end === -1) {
            throw new Error('Closing of expression (starting at ' + index + ' index) not found.');
        }

        expr = trim(code.substr(index, this.end - index));

        this.end++;

        this.render = function(options) {
            return engine.parseExpression(expr, options);
        };
    }

    function TwigBlock(index, code, engine) {
        var endIdx,
            blockName;

        index += 2;

        this.end = code.indexOf('%}', index);

        if (this.end === -1) {
            throw new Error('Closing of Twig expression (starting at ' + index + ' index) not found.');
        }

        this.expression = trim(code.substr(index, this.end - index));
        endIdx = this.expression.indexOf(' ');

        if (endIdx === -1) {
            blockName = this.expression;
            this.expression = null;
        } else {
            blockName = this.expression.substr(0, endIdx);
            this.expression = this.expression.substr(endIdx + 1);
        }

        if (!TWIG_BLOCKS[blockName]) {
            throw new Error('Twig block `' + blockName + '` (starting at ' + index + ' index) not found.');
        }

        if (TWIG_BLOCKS[blockName].closing) {
            this.childrens = engine.parse(code, TWIG_BLOCKS[blockName].closing, this.end + 2);
            this.end = this.childrens.end - 1;
        } else {
            this.end++;
        }

        this.render = function(options) {
            return TWIG_BLOCKS[blockName].render.call(this, options, engine);
        };
    }

    TwigEngine.setExpressionFunction(function(expression, data) {
        // Flat variables with filters and functions to static values
        // Static values
        // Ternary
        // Math and concatenation
        return data ? (data[expression] === void 0 ? '' : data[expression]) : '';
    });

    // Define blocks
    TwigEngine.addBlock('if', '{% endif %}', function(options, engine) {
        if (!engine.parseExpression(this.expression, options)) {
            return '';
        }

        return this.childrens.render(options);
    });

    // Define basic functions
    TwigEngine.addFunction('do_nothing', function(val) {
        return val;
    });

    // Define basic filters
    TwigEngine.addFilter('default', function(val, defaults) {
        return val === '' || val == null ? defaults : val;
    });

    // Basic definitions for Twig
    TwigEngine.addDefinition('node', '<', TwigNode);
    TwigEngine.addDefinition('expression', '{{', TwigExpression);
    TwigEngine.addDefinition('block', '{%', TwigBlock);

    // Expose Twig engine
    if (typeof module !== 'undefined') {
        module.exports = TwigEngine;
    } else {
        root.Twig = TwigEngine;
    }
}(this));
