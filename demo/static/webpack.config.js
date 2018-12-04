const path = require('path');
const webpack = require('webpack');

module.exports = [
  {
    entry: {
      polyfills: './polyfills.js',
      chinesedictdemo: './chinesedictdemo.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    mode: 'development',
    plugins: [
      new webpack.ProvidePlugin({
        join: ['dialog-polyfill', 'dialogPolyfill']
      })
    ]
  },
];
