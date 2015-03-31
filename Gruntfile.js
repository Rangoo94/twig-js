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
                'src/**/*.js',
                'test/**/*.js'
            ]
        },
        jscs: {
            src: [
                'Gruntfile.js',
                'src/**/*.js',
                'test/**/*.js'
            ]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: 'babel/register'
                },
                src: [ 'test/spec/**/*.js' ]
            }
        }
    });

    grunt.registerTask('lint', [
        'jshint',
        'jscs'
    ]);

    grunt.registerTask('test', [
        'mochaTest:test'
    ]);
};
