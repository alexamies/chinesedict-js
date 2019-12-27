// Karma configuration
// Generated on Tue Dec 24 2019 07:09:26 GMT-0800 (Pacific Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "karma-typescript"],

    // list of files / patterns to load in the browser
    files: [
      "src/AjaxDataLoader.ts",
      "src/DictionaryCollection.ts",
      "src/DictionaryEntry.ts",
      "src/DictionaryLoader.ts",
      "src/DictionaryLoaderHelper.ts",
      "src/DictionarySource.ts",
      "src/DictionaryView.ts",
      "src/DictionaryViewConfig.ts",
      "src/DictionaryViewLookup.ts",
      "src/IDataLoader.ts",
      "src/IDictionaryLoader.ts",
      "src/PlainJSBuilder.ts",
      "src/QueryResults.ts",
      "src/QueryResultsView.ts",
      "src/Storage.ts",
      "src/TextParser.ts",
      "src/Term.ts",
      "src/TextParser.ts",
      "src/WordSense.ts",
      "test/DictionaryCollection.spec.ts",
      "test/DictionaryEntry.spec.ts",
      "test/DictionaryLoaderHelper.spec.ts",
      "test/DictionaryLoader.spec.ts",
      "test/DictionarySource.spec.ts",
      "test/DictionaryView.spec.ts",
      "test/MockDictionaryLoader.ts",
      "test/MockDataLoader.ts",
      "test/Storage.spec.ts",
      "test/Term.spec.ts",
      "test/TextParser.spec.ts"
    ],

    karmaTypescriptConfig: {
      compilerOptions: {
        downlevelIteration: true,
        emitDecoratorMetadata: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        module: "commonjs",
        sourceMap: true,
        target: "ES6"
      },
      exclude: ["node_modules"]
    },

    // list of files / patterns to exclude
    exclude: [
    ],

    preprocessors: {
      "src/*.ts": ["karma-typescript"],
      "test/*.ts": ["karma-typescript"]
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["dots", "karma-typescript"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["ChromeHeadless"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
