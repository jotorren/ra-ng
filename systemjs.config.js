/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the dist folder
      app: 'dist',

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',

      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',

      'primeng': 'npm:primeng',
      'log4javascript': 'npm:log4javascript',
      'cachefactory': 'npm:cachefactory/dist',
      'ng2-translate': 'npm:ng2-translate/bundles',
      'angular2-jwt': 'npm:angular2-jwt',
      'crypto-js': 'npm:crypto-js',
      'lodash': 'npm:lodash'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './index.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      primeng: {
        defaultExtension: 'js'
      },
      log4javascript: {
        main: 'log4javascript.js',
        defaultExtension: 'js'
      },
      cachefactory: {
        main: 'cachefactory.js',
        defaultExtension: 'js'
      },
      'ng2-translate': {
        main: 'ng2-translate.umd.js',
        defaultExtension: 'js'
      },
      'angular2-jwt': {
        main: 'angular2-jwt.js',
        defaultExtension: 'js'
      },
      'crypto-js': {
        main: 'index.js',
        defaultExtension: 'js',
        format: 'cjs'
      },
      lodash: {
        main: 'lodash.js',
        defaultExtension: 'js'
      },
    }
  });
})(this);
