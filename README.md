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
* [Getting Started](#getting-started)
* [Programming Guide](#programming-guide)
* [Contributors](#contributors)
* [Support, Questions, or Feedback](#support-questions-or-feedback)
* [License](#license)

# Getting Started

Clone [ra-ng-quickstart](https://github.com/jotorren/ra-ng-quickstart):
```
my-project/
 ├──dist/
 ├──doc/
 ├──e2e/
 ├──node_modules/                       
 ├──typings/                       
 ├──src/
 │   ├──api/
 │   ├──environments/
 │   ├──app/
 │   │   ├──core/
 │   │   │   ├──core.module.ts
 │   │   │   └──index.ts
 │   │   │ 
 │   │   ├──layout/
 │   │   │   ├──aside.component.  [css | html | ts]
 │   │   │   ├──footer.component. [css | html | ts]
 │   │   │   ├──header.component. [css | html | ts]
 │   │   │   ├──sidebar.component.[css | html | ts]
 │   │   │   ├──topnav.component. [css | html | ts]
 │   │   │   ├──index.ts
 │   │   │   └──layout.module.ts
 │   │   │
 │   │   ├──shared/
 │   │   │   ├──config/
 │   │   │   │   ├──cache.json
 │   │   │   │   ├──log.json
 │   │   │   │   └──config.ts
 │   │   │   │ 
 │   │   │   ├──i18n/
 │   │   │   │   ├──lang_en.json
 │   │   │   │   └──lang_es.json
 │   │   │   │
 │   │   │   ├──constants.ts
 │   │   │   ├──index.ts
 │   │   │   └──shared.module.ts
 │   │   │
 │   │   ├──app.component.css
 │   │   ├──app.component.html
 │   │   ├──app.component.ts
 │   │   ├──app.module.ts
 │   │   ├──app.routing.module.ts
 │   │   └──main.ts
 │   │
 │   ├──resources/
 │   │   ├──css/
 │   │   ├──font-awesome-4.6.3/
 │   │   ├──img/
 │   │   └──js/ 
 │   │
 |   ├──favicon.ico
 |   ├──index.html
 |   └──systemjs.config.js
 │   
 ├──karma.conf.js
 ├──karma-systemjs.js
 ├──karma-test-shim.js
 ├──liteserver.json
 ├──package.json
 ├──protractor.config.js
 ├──README.md
 ├──tsconfig.json
 ├──tslint.json
 └──typings.json
 ```

And then run:
```bash
# change directory to your project
cd my-project

# install the dependency with npm
npm install

# install typescript definitions
typings install
```

# Programming Guide

Adapt `main.ts` to use ra-ng bootstrap:
```ts
// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ConfigurationLoaderService, LoggerFactory, Logger } from 'ra-ng';
import { Config } from './shared';

// The app module
import { AppModule } from './app.module';

// enableProdMode();
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