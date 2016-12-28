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

      // other libraries
      'ng2-translate/ng2-translate': 'npm:ng2-translate/bundles/ng2-translate.umd.js',

      'log4javascript': 'npm:log4javascript/log4javascript.js',
      'cachefactory': 'npm:cachefactory/dist/cachefactory.js',
      'crypto-js': 'npm:crypto-js/index.js',
      'lodash': 'npm:lodash/lodash.js',

      'rxjs': 'npm:rxjs',
      'primeng': 'npm:primeng'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      'app': { main: 'index.js', defaultExtension: 'js' },
      'rxjs': { defaultExtension: 'js' },
      'primeng': { defaultExtension: 'js' }
    }
  });
})(this);
