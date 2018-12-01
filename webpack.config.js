module.exports = [
  {
    entry: "./demo_app.js",
    output: {
      filename: "./dist/demo_app_compiled.js",
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-env"],
        },
      }],
    },
  },
];
