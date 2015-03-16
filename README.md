# TwigJS

[![Travis](https://travis-ci.org/Rangoo94/twig-js.svg)](https://travis-ci.org/Rangoo94/twig-js)
[![Code Climate](https://codeclimate.com/github/Rangoo94/twig-js/badges/gpa.svg)](https://codeclimate.com/github/Rangoo94/twig-js)
[![Coverage Status](https://coveralls.io/repos/Rangoo94/twig-js/badge.svg)](https://coveralls.io/r/Rangoo94/twig-js)

This library allow to parse Twig templates in JS.

## Goal

When it will be finished, you'll get JS templates, which will allow to generate DOM structure, which will be dynamically changed when variable will be changed. The main difference to other TwigJS libraries is that it will not need to render again whole structure, instead of that it will only change needed parts.

## Development

To prepare development environment you need only to fire `npm install` and run `npm install -g grunt grunt-cli` to have Grunt installed globally.

### Workflow

- Create fork of this repository
- Make your changes
- Write unit tests for this code
- Check if code style is correct by `grunt lint` command
- Check if tests are working properly by `grunt test` command
- Create pull request to `master` branch