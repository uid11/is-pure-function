'use strict';

module.exports = {
  context: __dirname + '/src',
  entry: './is-pure-function',
  output: {
    path: __dirname + '/build',
    filename: 'build.js',
    library: 'isPureFunction'
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 200
  },
  devtool: 'source-map'
};