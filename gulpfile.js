var gulp = require('gulp');
var clean = require('gulp-clean');
var merge = require('merge2');
var path = require('path');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['pub-d', 'pub', 'pub-min', 'pub-map2']);

gulp.task('default', function(callback) {
  runSequence('build', 'bundle', 'bundle:min', 'compile:def', 'build:map', callback);
});

gulp.task('clean', ['clean:dist', 'clean:bundles']);
gulp.task('clean:dist', cleanTask);
gulp.task('clean:bundles', cleanBundlesTask);

gulp.task('compile:ts', ['clean:dist'], tscTask);
gulp.task('compile:map', ['clean:dist'], tscDevTask);
gulp.task('compile:def', tscSingleDefTask);

gulp.task('build', ['compile:ts'], barrelTask);
gulp.task('build:map', ['compile:map'], barrelTask);

gulp.task('bundle', webpackTask.bind(null, false));
gulp.task('bundle:min', webpackTask.bind(null, true));

function cleanTask() {
    return merge([
        gulp.src('dist/index.*', { read: false }).pipe(clean()),
        gulp.src('dist/src', { read: false }).pipe(clean())
    ]);
}

function cleanBundlesTask() {
    return gulp.src('dist/bundles', { read: false }).pipe(clean());
}

function tscTask() {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(tsProject());
    
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts.pipe(gulp.dest('dist/src')),
        tsResult.js.pipe(gulp.dest('dist/src'))
    ]);
};

function tscDevTask() {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts.pipe(gulp.dest('dist/src')),
        tsResult.js
            // .pipe(sourcemaps.write('.'))
            .pipe(sourcemaps.write()) // inlined maps
            .pipe(gulp.dest('dist/src'))
    ]);
};

function tscSingleDefTask() {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({
            target: "es5",
            module: "amd",
            moduleResolution: "node",
            declaration: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            removeComments: false,
            noImplicitAny: false,
            outFile: "ra-ng.js"
        }));

    return tsResult.dts.pipe(gulp.dest('dist/bundles'));
};

function barrelTask() {
    return gulp.src(['dist/src/index.d.ts', 'dist/src/index.js'])
    .pipe(replace('./ra-ng', './src/ra-ng'))
    .pipe(gulp.dest(function(file){ return 'dist/'}));
}

function webpackTask(minify) {

    var plugins = [];    
    if (minify) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));
    }

    var mainFile = './dist/index.js';

    var fileName = 'ra-ng.umd';
    fileName += minify ? '.min' : '';
    fileName += '.js';

    return gulp.src('src/entry.js')
        .pipe(webpackStream({
            entry: {
                main: mainFile
            },
            output: {
                path: path.join(__dirname, "dist/bundles"),
                filename: fileName,
                library: ["raNG"],
                libraryTarget: "umd"
            },
            externals: [
                "@angular/common", "@angular/compiler", "@angular/core", "@angular/forms", 
                "@angular/http", "@angular/platform-browser", "@angular/platform-browser-dynamic", 
                "@angular/router",
                "cachefactory", "crypto-js", "lodash", "log4javascript", "ng2-translate/ng2-translate",
                "primeng/primeng", "rxjs/Rx"
            ],
            //devtool: 'inline-source-map',
            plugins: plugins
        }))
        .pipe(gulp.dest('./dist/bundles/'));
}