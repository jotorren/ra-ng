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

gulp.task('cleanDist', cleanDist);

gulp.task('tsc', ['cleanDist'], tscTask);
gulp.task('tscDev', ['cleanDist'], tscDevTask);

gulp.task('build', ['tsc'], barrelTask);
gulp.task('buildDev', ['tscDev'], barrelTask);

gulp.task('webpack', webpackTask.bind(null, false));
gulp.task('webpack-min', webpackTask.bind(null, true));

function cleanDist() {
    return gulp
        .src('dist', { read: false })
        .pipe(clean());
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
    plugins.push(new webpack.IgnorePlugin(/@angular/));
    plugins.push(new webpack.IgnorePlugin(/cachefactory/));
    plugins.push(new webpack.IgnorePlugin(/crypto-js/));
    plugins.push(new webpack.IgnorePlugin(/lodash/));
    plugins.push(new webpack.IgnorePlugin(/log4javascript/));
    plugins.push(new webpack.IgnorePlugin(/ng2-translate/));
    plugins.push(new webpack.IgnorePlugin(/primeng/));
    plugins.push(new webpack.IgnorePlugin(/rxjs/));
    
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
            //devtool: 'inline-source-map',
            plugins: plugins
        }))
        .pipe(gulp.dest('./dist/bundles/'));
}