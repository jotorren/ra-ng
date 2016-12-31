var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var replace = require('gulp-replace');
var path = require('path');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', ['build']);

gulp.task('clean', cleanTask);
gulp.task('cleanBundles', cleanBundlesTask);

gulp.task('tsc', ['clean'], tscTask);
gulp.task('tscDev', ['clean'], tscDevTask);

gulp.task('build', ['tsc'], barrelTask);
gulp.task('buildDev', ['tscDev'], barrelTask);

gulp.task('webpack', webpackTask.bind(null, false));
gulp.task('webpack-min', webpackTask.bind(null, true));

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