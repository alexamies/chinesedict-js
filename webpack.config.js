const path = require('path');
const webpack = require('webpack');

module.exports = [
  {
    entry: {
      polyfills: './polyfills.js',
      demo_app: './demo_app.js',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    mode: 'production',
    plugins: [
      new webpack.ProvidePlugin({
        join: ['dialog-polyfill', 'dialogPolyfill']
      })
    ]
  },
];
