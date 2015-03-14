(function(root) {
    'use strict';

    var Twig = root.Twig;

    describe('Rendering code', function() {
        describe('Expressions', function() {
            it('should render without any expressions', function() {
                var template = Twig.parse('jokojoijo');

                expect(template.render()).toEqual('jokojoijo');
            });

            it('should render with simple expression', function() {
                var template = Twig.parse('jokoj{{ x }}oijo');

                expect(template.render({ x: 'abc' })).toEqual('jokojabcoijo');
            });
        });

        describe('Blocks', function() {
            it('should throw error because of unknown block', function() {
                expect(function() {
                    Twig.parse('jokoj{% manamana %}o');
                }).toThrow();

                expect(function() {
                    Twig.parse('jokokokokoj{% manamana %}o{% endmanamana %}');
                }).toThrow();
            });

            describe('Conditional block', function() {
                it('should render with conditional block', function() {
                    var template = Twig.parse('jokoj{% if x %}oij{% endif %}o');

                    expect(template.render({ x: 'abc' })).toEqual('jokojoijo');
                    expect(template.render({ x: false })).toEqual('jokojo');
                    expect(template.render()).toEqual('jokojo');
                });

                it('should render with nested conditional blocks', function() {
                    var template = Twig.parse('jokoj{% if x %}o{% if y %}i{% endif %}j{% endif %}o');

                    expect(template.render({ x: 'abc', y: false })).toEqual('jokojojo');
                    expect(template.render({ x: 'abc', y: 'abc' })).toEqual('jokojoijo');
                    expect(template.render({ x: 'abc' })).toEqual('jokojojo');
                    expect(template.render({ x: false })).toEqual('jokojo');
                    expect(template.render()).toEqual('jokojo');
                });

                it('should throw error because `if` block has been not closed', function() {
                    expect(function() {
                        Twig.parse('jokoj{% if x %}o{% if y %}i{% endif %}jo');
                    }).toThrow();

                    expect(function() {
                        Twig.parse('jokoj{% if x %o{% if y %}i{% endif %}jo{% endif %}');
                    }).toThrow();
                });
            });
        });
    });
}(this));
