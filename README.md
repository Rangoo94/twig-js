# UltiTwigJS

[![Travis](https://travis-ci.org/Rangoo94/ulti-twigjs.svg)](https://travis-ci.org/Rangoo94/ulti-twigjs.svg)

This library allow to parse Twig templates in JS. When it will be finished, you'll get generated DOM structure, which will be dynamically changed when variable will be changed. The main difference to other TwigJS libraries is that it will not need to render again whole structure, instead of that it will only change needed parts.

## Development

To prepare development environment you need only to fire `npm install` and run `npm install -g grunt grunt-cli` to have Grunt installed globally.

### Workflow

- Create fork of this repository
- Make your changes
- Write unit tests for this code
- Check if code style is correct by `grunt lint` command
- Check if tests are working properly by `grunt test` command
- Create pull request to `master` branch