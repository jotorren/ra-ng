[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/jotorren/ra-ng)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![Build Status](https://travis-ci.org/jotorren/ra-ng.svg?branch=master)](https://travis-ci.org/jotorren/ra-ng)
[![npm version](https://badge.fury.io/js/ra-ng.svg)](https://badge.fury.io/js/ra-ng)
[![Hex.pm](https://img.shields.io/hexpm/l/plug.svg)](https://github.com/jotorren/ra-ng/blob/master/LICENSE)

# ra-ng

Module that aims to agilize the development of an **Angular2** application with **PrimeNG**. It can be used with either compiler: 
**Just-in-time (JiT)** or **Ahead-of-Time (AoT)**.

### Quick start

```bash
# change directory to your project
cd myproj

# install the dependency with npm
npm install ra-ng --save
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
*(asap)*

## Logging
*(asap)*

## i18n literals
*(asap)*

## Errors management
*(asap)*

## Events
*(asap)*

## Data cache
*(asap)*

## Security services
*(asap)*

## User context
*(asap)*

## Navigation and routing
*(asap)*

## Forms validation
*(asap)*

## Stateful components
*(asap)*

## Model mapper
*(asap)*

# Distribution

After importing `ra-ng` node module, you will find a **Universal Module Definition** minified bundle generated with `webpack` (recommended
for production) and a folder containing: 
* `es2015` transpiled sources (**Rollup** can only **Tree Shake** `es2015` modules), 
* the library type definitions (`.d.ts`), 
* and the metadata files (`.metadata.json`) to use in an **AoT** compiled application.

```
dist/
 ├──bundles/
 │   ├──ra-ng.d.ts          * single self contained typescript definition file
 │   ├──ra-ng-umd.js        * single self contained javascript bundle file in Universal Module Definition format
 |   └──ra-ng.umd.min.js    * minified version of `ra-ng-umd.js` (whitespaces and comments stripped out, shorter variable names)
 ├──src/                    * folder containing all `es2015` sources alongside their type definitions and the AoT metadata files
 ├──index.d.ts              * exposes all definition files available in the `src` folder
 ├──index.js                * exposes all `es2015` sources available in the `src` folder
 ├──index.metadata.json     * exposes all metadata files available in the `src` folder
 ├──package.json
 └──README.md
```

Note that any `es2015` file, contains the corresponding `sourcemap` file inlined at the end of its
content. For example, if we look at `dist/index.js` code:

 ```ts
 /**
 * @module
 * @description
 * Entry point for all public APIs of the ra-ng package.
 */
export { RaNGModule,
CacheService,
ConfigurationLoaderService, ConfigurationService,
UserContextService, UUID,
ErrorsService, UncontrolledErrorsService,
BroadcastEvent, BroadcastMessage, BroadcastMessageType, ClearMessagesEventType,
EnterAnnouncedEventType, EventBusService, LeaveConfirmedEventType, MessagesComponent, UpdateAnnouncedEventType, ValidationEventType, contentHeaders, getBasicAuthHeaderValue, getHeaderValue, sendHttpRequest, sendHttpRequestParseResponse, LanguageComponent, LanguageConfigurationService, TranslatePipe,
TranslateService, AjaxAppenderBatch, AjaxAppenderImmediate, LogAppenderFactory,
Logger, LoggerFactory, LogI18nService, LogLayoutFactory, LogService, getKeyValue, isSubInterval, Mock, MockComponent, objectMapper, setKeyValue,
AsyncConfirmationService, BreadcrumbComponent, BreadcrumbedComponent, CanDeactivateGuard, ConfirmationDialogComponent, recoverState, removeState, SaveProperty, saveState, SpinnerComponent, SpinnerRxComponent, SpinnerService, BypassAuthenticationService, BypassAuthorizationService, BypassTokenRequestService,
BypassUserDetailsService, CryptoService, DenyAuthorizationService, ForbiddenComponent, JsonUserDetailsService, JwtHelper, JwtUserDetailsService, LoginComponent, LogoutComponent, ProfileManagerService, SecurityAuthenticationService, SecurityAuthenticationToken, SecurityAuthenticatorService, SecurityAuthorizationService, SecurityAuthorizatorService, SecurityTokenRequestService, SecurityUserDetailsService, TokenAuthorizationService, TokenBasicAuthRequestService, TokenJwtRequestService, TokenOAuth2RequestService, UsernamePasswordAuthenticationToken, UsernamePasswordBasicAuthenticationService, UsernamePasswordJwtAuthenticationService, UsernamePasswordOAuth2AuthenticationService, escapeRegExp, FormValidatorService, isArrayOfTypes, isUndefined, isValidField,
validateField, validateObject, ValidateOnBlurDirective } from './src/ra-ng';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILE9BQU8sRUFDSCxVQUFVLEVBQUUsZUFBZTtBQUMzQixZQUFZLEVBQVUsUUFBUTtBQUM5QiwwQkFBMEIsRUFBRSxvQkFBb0IsRUFBaUIsU0FBUztBQUMxRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsTUFBTTtBQUNoQyxhQUFhLEVBQUUseUJBQXlCLEVBQUUsUUFBUTtBQUNsRCxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsc0JBQXNCLEVBQUUsUUFBUTtBQUN4Rix1QkFBdUIsRUFBRSxlQUFlLEVBQUUsdUJBQXVCLEVBQ2pFLGlCQUFpQixFQUFFLHdCQUF3QixFQUFFLG1CQUFtQixFQUNoRSxjQUFjLEVBQUUsdUJBQXVCLEVBQUUsY0FBYyxFQUNuQyxlQUFlLEVBQUUsNEJBQTRCLEVBQ2hELGlCQUFpQixFQUFFLDRCQUE0QixFQUFFLGFBQWEsRUFBRSxPQUFPO0FBQ3hGLGdCQUFnQixFQUNoQixpQkFBaUIsRUFBRSxxQkFBcUIsRUFBd0Isa0JBQWtCLEVBQUUsTUFBTTtBQUMxRixNQUFNLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBRXhELFdBQVcsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFNBQVM7QUFDaEcsd0JBQXdCLEVBQUUsbUJBQW1CLEVBQUUscUJBQXFCLEVBQzVDLGtCQUFrQixFQUFFLDJCQUEyQixFQUFFLFlBQVksRUFDckYsV0FBVyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsY0FBYyxFQUMxRiwyQkFBMkIsRUFBRSwwQkFBMEIsRUFBRSx5QkFBeUIsRUFBRSxXQUFXO0FBQy9GLHdCQUF3QixFQUFFLGFBQWEsRUFBRSx3QkFBd0IsRUFBRSxrQkFBa0IsRUFDckYsc0JBQXNCLEVBQUUsU0FBUyxFQUFlLHFCQUFxQixFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQ3RGLHFCQUFxQixFQUFpQiw2QkFBNkIsRUFDbkYsMkJBQTJCLEVBQUUsNEJBQTRCLEVBQUUsNEJBQTRCLEVBQ3ZGLDJCQUEyQixFQUFFLDJCQUEyQixFQUFFLDBCQUEwQixFQUNwRix5QkFBeUIsRUFBRSw0QkFBNEIsRUFBRSxzQkFBc0IsRUFDL0UseUJBQXlCLEVBQUUsbUNBQW1DLEVBQUUsMENBQTBDLEVBQzFHLHdDQUF3QyxFQUFFLDJDQUEyQyxFQUNwRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsYUFBYTtBQUM3RyxhQUFhLEVBQUUsY0FBYyxFQUFFLHVCQUF1QixFQUN6RCxNQUFNLFNBQVMsQ0FBQyJ9 ```
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