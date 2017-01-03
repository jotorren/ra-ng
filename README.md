[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/jotorren/ra-ng)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![Build Status](https://travis-ci.org/jotorren/ra-ng.svg?branch=master)](https://travis-ci.org/jotorren/ra-ng)
[![npm version](https://badge.fury.io/js/ra-ng.svg)](https://badge.fury.io/js/ra-ng)
[![Hex.pm](https://img.shields.io/hexpm/l/plug.svg)](https://github.com/jotorren/ra-ng/blob/master/LICENSE)

# ra-ng

Module that aims to agilize the development of an Angular2 application with PrimeNG.

### Quick start

```bash
# change directory to your project
cd myproj

# install the dependency with npm
npm install ra-ng --save

# install typescript definitions
typings install file:./node_modules/ra-ng/dist/index.d.ts --name ra-ng --save
```

# Table of Contents
* [Dependencies](#dependencies)
* [Programming Guide](#programming-guide)
    * [Configuration files](#configuration-files)
    * [Logging](#logging)
    * [i18n literals](#i18n-literals)
    * [Errors management](#errors-management)
    * [Events](#events)
    * [Data cache](#data-cache)
    * [Security services](#security-services)
    * [User context](#user-context)
    * [Navigation and routing](#navigation-and-routing)
    * [Forms validation](#forms-validation)
    * [Stateful components](#stateful-components)
    * [Model mapper](#model-mapper)
* [Bootstrap](#bootstrap)
* [Distribution](#distribution)
* [Contributors](#contributors)
* [Support, Questions, or Feedback](#support-questions-or-feedback)
* [License](#license)

# Dependencies
Required 3rd party libraries:

* [`@angular`](https://github.com/angular/angular)
* [`rxjs`](https://github.com/ReactiveX/RxJS)
* [`log4javascript`](http://log4javascript.org/)
* [`ng2-translate`](https://github.com/ocombe/ng2-translate)
* [`cachefactory`](https://github.com/jmdobry/CacheFactory)
* [`primeng`](http://www.primefaces.org/primeng)
* [`crypto-js`](https://github.com/brix/crypto-js). Used internally by basic/oauth2 security authentication and token based requests
* [`lodash`](https://github.com/lodash/lodash). Used internally by `JsonUserDetailsService` only

# Programming Guide

## Configuration files

## Logging

## i18n literals

## Errors management

## Events

## Data cache

## Security services

## User context

## Navigation and routing

## Forms validation

## Stateful components

## Model mapper

# Bootstrap

Adapt `main.ts` to use ra-ng bootstrap:
```ts
// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ConfigurationLoaderService, LoggerFactory, Logger } from 'ra-ng';
import { Config } from './shared';

// The app module
import { AppModule } from './app.module';

ConfigurationLoaderService.bootstrap(Config).subscribe(
  (loaded) => {
    LoggerFactory.configure(Config);
    const LOG: Logger = LoggerFactory.getLogger('root');

    LOG.info('Imported JSON configuration for modules: ' + loaded);

    // Compile and launch the module
    platformBrowserDynamic().bootstrapModule(AppModule);
  },
  (err) => {
    console.error('Error loading configuration before launching Angular 2 bootstrap: ', err);
  });
  ```

# Distribution

We offer two ways of importing `ra-ng` classes: using Universal Module Definition minified bundle generated with `webpack` (recommended
for production), or using its exploded version (better for development stage).

```
dist/
 ├──bundles/
 │   ├──ra-ng.d.ts          * single self contained typescript definition file
 │   ├──ra-ng-umd.js        * single self contained javascript bundle file in Universal Module Definition format
 |   └──ra-ng.umd.min.js    * minified version of `ra-ng-umd.js` (whitespaces and comments stripped out, shorter variable names)
 ├──src/                    * folder containing all compiled javascript files alongside their declaration files
 ├──index.d.ts              * exposes all definition files available in the `src` folder
 └──index.js                * exposes all compiled javascript files available in the `src` folder
```

Note that any compiled javascript file, contains the corresponding `sourcemap` file inlined at the end of its
content. For example, if we look at `dist/index.js` code:

 ```ts
 "use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
/**
 * @module
 * @description
 * Entry point for all public APIs of the ra-ng package.
 */
__export(require("./src/ra-ng"));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7R0FJRztBQUNILDZCQUF3QiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAbW9kdWxlXHJcbiAqIEBkZXNjcmlwdGlvblxyXG4gKiBFbnRyeSBwb2ludCBmb3IgYWxsIHB1YmxpYyBBUElzIG9mIHRoZSByYS1uZyBwYWNrYWdlLlxyXG4gKi9cclxuZXhwb3J0ICogZnJvbSAnLi9yYS1uZyc7XHJcbiJdfQ==
 ```

# Contributors

| Name               | GitHub                                  | Twitter                                   |
| ------------------ | --------------------------------------- | ----------------------------------------- |
| **Jordi Torrente** | [jotorren](https://github.com/jotorren) | [@esrafiki](https://twitter.com/esrafiki) |

I'll accept pretty much everything so feel free to open a Pull-Request

# Support, Questions, or Feedback

> Contact us anytime for anything about this repo 

[![Join the chat at https://gitter.im/ra-ng/general](https://badges.gitter.im/ra-ng/general.svg)](https://gitter.im/ra-ng/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# License

Code licensed under an [Apache License](https://github.com/jotorren/ra-ng/blob/master/LICENSE). Documentation licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/).

**[Back to top](#table-of-contents)**