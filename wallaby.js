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

    delays: {
      edit: 300,
      run: 150
    },

    testFramework: 'mocha@2.1.0'
  };
};