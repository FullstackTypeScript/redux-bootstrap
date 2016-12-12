module.exports = function (config) {
  "use strict";

  config.set({
    singleRun: true,
    basePath: "",
    frameworks: ["mocha", "chai"],
    browsers: [
        "PhantomJS"
    ],
    reporters: ["mocha", "coverage"],
    coverageReporter: {
      dir : "coverage/",
      type : "lcovonly",
      check: {
        global: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
          excludes: [
            "node_modules/**/*.js"
          ]
        },
        each: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
          excludes: [
            "node_modules/**/*.js"
          ]
        }
      }
    },
    plugins : [
        "karma-mocha-reporter",
        "karma-coverage",
        "karma-mocha",
        "karma-chai",
        "karma-phantomjs-launcher"
    ],
    preprocessors: {
      "temp/bundle/index.js" :  ["coverage"]
    },
    files : [
        { pattern: "node_modules/html5-history-api/history.js", included: true },
        { pattern: "temp/bundle/index.js", included: true }
    ],
    port: 9876,
    colors: true,
    autoWatch: false,
    logLevel: config.LOG_INFO
  });
};
