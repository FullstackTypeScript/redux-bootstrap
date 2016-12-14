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
    tsify       = require("tsify"),
    istanbul    = require("istanbul"),
    sourcemaps  = require("gulp-sourcemaps"),
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
gulp.task("bundle", function() {

  var mainFilePath = "test/index.test.tsx";
  var outputFolder   = "temp/bundle";
  var outputFileName = "index.js";

  var bundler = browserify({
    debug: true
  });

  // TS compiler options are in tsconfig.json file
  return bundler.add(mainFilePath)
                .plugin(tsify)
                .bundle()
                .pipe(source(outputFileName))
                .pipe(buffer())
                .pipe(sourcemaps.init({ loadMaps: true }))
                .pipe(sourcemaps.write())
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

gulp.task("coverage", function (done) {

    // https://github.com/SitePen/remap-istanbul/issues/51#issuecomment-216466344

    var collector = new istanbul.Collector();
    var reporter = new istanbul.Reporter();

    reporter.add("html");
    reporter.addAll([ "lcov", "text" ]);

    var remappedJson = require("./coverage/coverage-remapped.json");
    var keys = Object.keys(remappedJson);
    var coverage = {};

    for (var i = 0; i < keys.length; i++) {
        if (keys[ i ].startsWith("src/")) {
            coverage[ keys[ i ] ] = remappedJson[ keys[ i ] ];
        }
    }

    collector.add(coverage);

    reporter.write(collector, true, function() {
        done();
    });

});

//******************************************************************************
//* TASK GROUPS
//******************************************************************************
gulp.task("default", function (cb) {
    runSequence(
        "lint", 
        [
            "build-es", 
            "build-lib",
            "build-dts"
        ],
        "bundle",
        "karma",
        "coverage",
        cb
    );
});
