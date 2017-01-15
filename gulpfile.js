var gulp = require('gulp');
var clean = require('gulp-clean');
var merge = require('merge2');
var ngc = require('gulp-ngc');
var path = require('path');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');

var tsProject = ts.createProject('tsconfig.json');
var tsProjectDef = ts.createProject('tsconfig.json', { module: 'amd', outFile: 'ra-ng.js' });
var aotProject = ngc('tsconfig-aot.json');

gulp.task('default', function (callback) {
    runSequence('build', 'clean:bundles', 'bundle', 'bundle:min', 'compile:def', 'build:aot', callback);
});

gulp.task('clean', ['clean:dist', 'clean:bundles', 'clean:aot']);
gulp.task('clean:dist', cleanTask);
gulp.task('clean:bundles', cleanBundlesTask);
gulp.task('clean:aot', cleanAotTask);

gulp.task('compile:ts', ['clean:dist'], tscTask);
gulp.task('compile:map', ['clean:dist'], tscSourceMapTask);
gulp.task('compile:def', tscDefinitionTask);
gulp.task('compile:aot', ['clean:aot'], () => {
    return ngc('tsconfig-aot.json');
});

gulp.task('build', ['compile:ts'], barrelTask);
gulp.task('build:map', ['compile:map'], barrelTask);
gulp.task('build:aot', ['compile:aot'], barrelTask);

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

function cleanAotTask() {
    return merge([
        gulp.src('aot', { read: false }).pipe(clean()),
        gulp.src('dist/src', { read: false }).pipe(clean())
    ]);
}

function tscTask() {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('dist/src'));
};

function tscSourceMapTask() {
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

function tscDefinitionTask() {
    var tsResult = gulp.src("src/**/*.ts")
        .pipe(tsProjectDef());

    return tsResult.dts.pipe(gulp.dest('dist/bundles'));
};

function barrelTask() {
    return gulp.src(['dist/src/index.d.ts', 'dist/src/index.js', 'dist/src/index.metadata.json'])
        .pipe(replace('./ra-ng', './src/ra-ng'))
        .pipe(gulp.dest(function (file) { return 'dist/' }));
}

function webpackTask(minify) {

    var plugins = [];
    if (minify) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
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