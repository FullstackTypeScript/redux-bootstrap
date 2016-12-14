module.exports = function (config) {
  "use strict";

  config.set({
    singleRun: true,
    basePath: "",
    frameworks: ["mocha", "chai"],
    browsers: [
        "PhantomJS"
    ],
    reporters: ["mocha", "coverage", "karma-remap-istanbul"],
    coverageReporter: {
      dir : "coverage"
    },
    remapIstanbulReporter: {
      reports: {
        json: 'coverage/coverage-remapped.json'
      }
    },
    plugins : [
        "karma-mocha-reporter",
        "karma-coverage",
        "karma-mocha",
        "karma-chai",
        "karma-phantomjs-launcher",
        "karma-remap-istanbul"
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
