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
typings install file:./node_modules/ra-ng/dist/index.d.ts --name rang --save
```

# Table of Contents
* [Getting Started](#getting-started)
* [Programming Guide](#programming-guide)
* [Contributors](#contributors)
* [Support, Questions, or Feedback](#support-questions-or-feedback)
* [License](#license)

# Getting Started

Create, if one does not already exist, a project following the structure (see [ra-ng-quickstart](https://github.com/jotorren/ra-ng)):
```
my-project/
 ├──dist/
 ├──node_modules/                       
 ├──typings/                       
 ├──src/         
 |   ├──index.html
 |   ├──systemjs.config.js
 │   │
 │   ├──api/
 │   │
 │   ├──app/
 │   │   ├──core/
 │   │   │   ├──core.module.ts
 │   │   │   └──index.ts
 │   │   │ 
 │   │   ├──layout/
 │   │   │   ├──aside/
 │   │   │   │   └──aside.component.[css | html | ts]
 │   │   │   ├──footer/
 │   │   │   │   └──footer.component.[css | html | ts]
 │   │   │   ├──header/
 │   │   │   │   └──header.component.[css | html | ts]
 │   │   │   ├──sidebar/
 │   │   │   │   └──sidebar.component.[css | html | ts]
 │   │   │   ├──topnav/
 │   │   │   │   └──topnav.component.[css | html | ts]
 │   │   │   │
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
 │   ├──e2e/
 │   │
 │   └──resources/
 │       ├──css/
 │       ├──font-awesome-4.6.3/
 │       ├──img/
 │       └──js/
 │
 ├──index.html
 ├──karma.conf.js
 ├──karma-test-shim.js
 ├──package.json
 ├──protractor.config.js
 ├──systemjs.config.karma.js
 ├──tsconfig.json
 ├──tslint.json
 └──typings.json
 ```

Configure `package.json` as:
```
  "dependencies": {
    "ra-ng": "2.0.0-rc14",
    "@angular/common": "2.1.1",
    "@angular/compiler": "2.1.1",
    "@angular/core": "2.1.1",
    "@angular/forms": "2.1.1",
    "@angular/http": "2.1.1",
    "@angular/platform-browser": "2.1.1",
    "@angular/platform-browser-dynamic": "2.1.1",
    "@angular/router": "3.1.1",
    "@angular/upgrade": "2.1.1",
    "angular2-in-memory-web-api": "0.0.21",
    "angular2-jwt": "0.1.25",
    "bootstrap": "^3.3.7",
    "cachefactory": "1.5.1",
    "core-js": "^2.4.1",
    "crypto-js": "^3.1.7",
    "lodash": "^4.16.4",
    "log4javascript": "^1.4.15",
    "ng2-translate": "3.1.2",
    "primeng": "^1.0.0-beta.19",
    "primeui": "^4.1.15",
    "quill": "^1.1.2",
    "reflect-metadata": "^0.1.8",
    "rxjs": "5.0.0-beta.12",
    "systemjs": "^0.19.39",
    "zone.js": "^0.6.26"
  },
  "devDependencies": {
    "canonical-path": "^0.0.2",
    "concurrently": "^3.1.0",
    "http-server": "^0.9.0",
    "jasmine-core": "^2.5.2",
    "jasmine-node": "^1.14.5",
    "karma": "^1.3.0",
    "karma-chrome-launcher": "^2.0.0",
    "karma-cli": "^1.0.1",
    "karma-coverage": "^1.1.1",
    "karma-htmlfile-reporter": "^0.3.4",
    "karma-jasmine": "^1.0.2",
    "karma-jasmine-html-reporter": "^0.2.2",
    "karma-sourcemap-loader": "^0.3.7",
    "lite-server": "^2.2.2",
    "remap-istanbul": "^0.7.0",
    "typescript": "^2.0.3",
    "typings": "^1.4.0"
  }
```

Next, `typings.json` as:
```
{
  "globalDependencies": {
    "angular-protractor": "registry:dt/angular-protractor#1.5.0+20160425143459",
    "cachefactory": "registry:dt/cachefactory#1.4.0+20160521151552",
    "core-js": "registry:dt/core-js#0.0.0+20160602141332",
    "crypto-js": "registry:dt/crypto-js#3.1.4+20160708041433",
    "jasmine": "registry:dt/jasmine#2.2.0+20160621224255",
    "lodash": "registry:dt/lodash#4.14.0+20160919145112",
    "log4javascript": "registry:dt/log4javascript#0.0.0+20160602150953",
    "node": "registry:dt/node#6.0.0+20160621231320",
    "quill": "registry:dt/quill#1.0.3+20161008233243",
    "selenium-webdriver": "registry:dt/selenium-webdriver#2.44.0+20160317120654"
  },
  "dependencies": {
    "primeng": "file:./node_modules/primeng/primeng.d.ts",
    "rang": "file:./node_modules/ra-ng/dist/index.d.ts"
  }
}
```
And `tsconfig.json` as:
```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "removeComments": false,
    "noImplicitAny": false
  },
  "exclude": [
    "node_modules",
    "typings/main",
    "typings/main.d.ts"
  ]
}
```

Finally run:
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
```
// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ConfigurationLoaderService, LoggerFactory, Logger } from 'rang';
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