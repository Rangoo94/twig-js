module.exports = function(grunt) {
    'use strict';

    // jshint camelcase: false
    // jshint node: true

    // Load configuration
    var libraries = Object.keys(grunt.file.readJSON('package.json').devDependencies),
        ignoredLibraries = [
            'grunt',
            'grunt-cli',
            'grunt-template-jasmine-istanbul'
        ];

    // Load all Grunt tasks from NPM
    for (var i = 0; i < libraries.length; i++) {
        if (libraries[i].indexOf('grunt') === 0 && ignoredLibraries.indexOf(libraries[i]) === -1) {
            grunt.loadNpmTasks(libraries[i]);
        }
    }

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: [
                'Gruntfile.js',
                'dev/**/*.js',
                'test/**/*.js'
            ]
        },
        jscs: {
            src: [
                'Gruntfile.js',
                'dev/**/*.js',
                'test/**/*.js'
            ]
        },
        jasmine: {
            src: 'dev/**/*.js',
            options: {
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'coverage.json',
                    report: {
                        type: 'lcovonly',
                        options: {
                            dir: '.'
                        }
                    },
                    files: 'dev/**/*.js',
                    thresholds: {
                        lines: 0,
                        statements: 0,
                        branches: 0,
                        functions: 0
                    }
                },
                specs: 'test/**/*.js'
            }
        },
        coveralls: {
            options: {
                src: 'lcov.info'
            }
        }
    });

    grunt.registerTask('lint', [
        'jshint',
        'jscs'
    ]);

    grunt.registerTask('test', [
        'jasmine'
    ]);
};
