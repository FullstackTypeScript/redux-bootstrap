"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

var gulp        = require("gulp"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    runSequence = require("run-sequence"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    karma       = require("karma");

//******************************************************************************
//* LINT ALL
//******************************************************************************
gulp.task("lint", function() {
    
    var config =  { formatter: "verbose", emitError: (process.env.CI) ? true : false };
    
    return gulp.src([
        "src/**/**.ts",
        "test/**/**.test.ts"
    ])
    .pipe(tslint(config))
    .pipe(tslint.report());
});

//******************************************************************************
//* BUILD SOURCE
//******************************************************************************
var tsLibProject = tsc.createProject("tsconfig.json");

gulp.task("build-lib", function() {
    return gulp.src([
        "src/**/*.ts",
        "src/**/*.tsx"
    ])
    .pipe(tsLibProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("lib/"));
});

var tsEsProject = tsc.createProject("tsconfig.json", { target: "es6", module : "es2015" });

gulp.task("build-es", function() {
    return gulp.src([
        "src/**/*.ts",
        "src/**/*.tsx"
    ])
    .pipe(tsEsProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("es/"));
});

var tsDtsProject = tsc.createProject("tsconfig.json", {
    declaration: true,
    noResolve: false
});

gulp.task("build-dts", function() {
    return gulp.src([
        "src/**/*.tsx",
        "src/**/*.ts"
    ])
    .pipe(tsDtsProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .dts.pipe(gulp.dest("dts"));

});

//******************************************************************************
//* BUILD TESTS
//******************************************************************************
var tstProject = tsc.createProject("tsconfig.json");

gulp.task("build-src", function() {
    return gulp.src([
        "src/**/*.ts",
        "src/**/*.tsx"
    ])
    .pipe(tstProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("temp/src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json");

gulp.task("build-test", function() {
    return gulp.src([
        "test/**/*.ts",
        "test/**/*.tsx"
    ])
    .pipe(tsTestProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("temp/test/"));
});

gulp.task("bundle", function() {

  var mainFilePath = "temp/test/index.test.js";
  var outputFolder   = "temp/bundle";
  var outputFileName = "index.js";

  var bundler = browserify({
    debug: true
  });

  // TS compiler options are in tsconfig.json file
  return bundler.add(mainFilePath)
                .bundle()
                .pipe(source(outputFileName))
                .pipe(buffer())
                .pipe(gulp.dest(outputFolder));
});

//******************************************************************************
//* RUN TEST
//******************************************************************************
gulp.task("karma", function (done) {
  new karma.Server({
    configFile: __dirname + "/karma.conf.js"
  }, function(code) {
        if (code === 1){
           console.log('Unit Test failures, exiting process');
           done('Unit Test Failures');
        } else {
            console.log('Unit Tests passed');
            done();
        }
    }).start();
});

//******************************************************************************
//* TASK GROUPS
//******************************************************************************
gulp.task("build", function(cb) {
  runSequence(
      "lint", 
      [
          "build-es", 
          "build-lib",
          "build-dts",
          "build-src",
          "build-test",
      ],
      "bundle",
      cb);
});

gulp.task("test", function(cb) {
  runSequence("karma", cb);
});

gulp.task("default", function (cb) {
  runSequence(
    "build",
    "test",
    cb);
});
