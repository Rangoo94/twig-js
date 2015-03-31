module.exports = () => {
  return {
    files: [
      'src/**/*.js'
    ],

    tests: [
      'test/spec/**/*.js'
    ],

    env: {
      type: 'node'
    },

    preprocessors: {
      '**/*.js': file => require('babel').transform(file.content, { sourceMap: true })
    },

    testFramework: 'mocha@2.1.0'
  };
};