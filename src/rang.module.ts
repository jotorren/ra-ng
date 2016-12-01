import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate/ng2-translate';

// import { HttpModule, Http, RequestOptions } from '@angular/http';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';

import {
  MessagesModule, GrowlModule, PanelModule, DropdownModule, ToggleButtonModule, BreadcrumbModule,
  ConfirmDialogModule
} from 'primeng/primeng';

import { MockComponent } from './models/mock.component';
import { LoginComponent } from './security/login.component';
import { LogoutComponent } from './security/logout.component';
import { ForbiddenComponent } from './security/forbidden.component';
import { MessagesComponent } from './event/messages.component';
import { LanguageComponent } from './i18n/language.component';
import { SpinnerComponent } from './navigation/spinner.component';
import { SpinnerRxComponent } from './navigation/spinner-rx.component';
import { BreadcrumbComponent } from './navigation/breadcrumb.component';
import { BreadcrumbedComponent } from './navigation/breadcrumbed.component';
import { ConfirmationDialogComponent } from './navigation/confirmation-dialog.component';
import { ValidateOnBlurDirective } from './validation/validate-on-blur.directive';

import { SecurityAuthenticatorService } from './security/security-authenticator.service';
import { SecurityAuthorizatorService } from './security/security-authorizator.service';

import { SecurityAuthenticationService } from './security/security-authentication.service';
import { SecurityUserDetailsService } from './security/security-userdetails.service';
import { SecurityAuthorizationService } from './security/security-authorization.service';
import { SecurityTokenRequestService } from './security/security-token-request.service';

import { BypassAuthenticationService } from './security/bypass-authentication.service';
import { BypassUserDetailsService } from './security/bypass-userdetails.service';
import { BypassAuthorizationService } from './security/bypass-authorization.service';
import { BypassTokenRequestService } from './security/bypass-token-request.service';

import { UsernamePasswordBasicAuthenticationService } from './security/username-password-basic-authentication.service';
import { TokenBasicAuthRequestService } from './security/token-basicauth-request.service';

import { UsernamePasswordJwtAuthenticationService } from './security/username-password-jwt-authentication.service';
import { JwtUserDetailsService } from './security/jwt-userdetails.service';
import { TokenJwtRequestService } from './security/token-jwt-request.service';

import { UsernamePasswordOAuth2AuthenticationService } from './security/username-password-oauth2-authentication.service';
import { TokenOAuth2RequestService } from './security/token-oauth2-request.service';

import { JsonUserDetailsService } from './security/json-userdetails.service';
import { TokenAuthorizationService } from './security/token-authorization.service';

@NgModule({
  imports: [
    CommonModule, HttpModule, FormsModule, TranslateModule,
    MessagesModule, GrowlModule, PanelModule, DropdownModule, ToggleButtonModule, BreadcrumbModule,
    ConfirmDialogModule
  ],
  declarations: [
    MockComponent, LoginComponent, LogoutComponent, ForbiddenComponent, MessagesComponent, LanguageComponent,
    SpinnerComponent, SpinnerRxComponent, BreadcrumbComponent, BreadcrumbedComponent, ConfirmationDialogComponent,
    ValidateOnBlurDirective
  ],
  exports: [
    CommonModule, HttpModule, FormsModule, TranslateModule,
    MessagesModule, GrowlModule, PanelModule, DropdownModule, ToggleButtonModule, BreadcrumbModule,
    ConfirmDialogModule,
    MockComponent, LoginComponent, LogoutComponent, ForbiddenComponent, MessagesComponent, LanguageComponent,
    SpinnerComponent, SpinnerRxComponent, BreadcrumbComponent, BreadcrumbedComponent, ConfirmationDialogComponent,
    ValidateOnBlurDirective
  ]

  // More precisely, Angular accumulates all imported providers before appending the items listed in @NgModule.providers. 
  // This sequence ensures that whatever we add explicitly to the AppModule providers takes precedence over the providers 
  // of imported modules.
  // providers: [
  //   {
  //     provide: AuthHttp,
  //     useFactory: (http: Http, options: RequestOptions, prov: ConfigProvider) =>
  //       new AuthHttp(new AuthConfig(prov.conf.security.token.jwt), http, options),
  //     deps: [Http, RequestOptions, ConfigProvider]
  //   }
  // ]
})
export class RaNGModule {
  static forRoot(mode: string): ModuleWithProviders {
    switch (mode) {
      case 'security-off':
        return {
          ngModule: RaNGModule,
          providers: [
            SecurityAuthenticatorService,
            SecurityAuthorizatorService,
            { provide: SecurityAuthenticationService, useClass: BypassAuthenticationService },
            { provide: SecurityUserDetailsService, useClass: BypassUserDetailsService },
            { provide: SecurityAuthorizationService, useClass: BypassAuthorizationService },
            { provide: SecurityTokenRequestService, useClass: BypassTokenRequestService }
          ]
        };
      case 'security-basic-no-authz':
        return {
          ngModule: RaNGModule,
          providers: [
            SecurityAuthenticatorService,
            SecurityAuthorizatorService,
            { provide: SecurityAuthenticationService, useClass: UsernamePasswordBasicAuthenticationService },
            { provide: SecurityUserDetailsService, useClass: BypassUserDetailsService },
            { provide: SecurityAuthorizationService, useClass: TokenAuthorizationService },
            { provide: SecurityTokenRequestService, useClass: TokenBasicAuthRequestService }
          ]
        };
      case 'security-jwt-no-authz':
        return {
          ngModule: RaNGModule,
          providers: [
            SecurityAuthenticatorService,
            SecurityAuthorizatorService,
            { provide: SecurityAuthenticationService, useClass: UsernamePasswordJwtAuthenticationService },
            { provide: SecurityUserDetailsService, useClass: BypassUserDetailsService },
            { provide: SecurityAuthorizationService, useClass: TokenAuthorizationService },
            { provide: SecurityTokenRequestService, useClass: TokenJwtRequestService }
          ]
        };
      case 'security-oauth2-no-authz':
        return {
          ngModule: RaNGModule,
          providers: [
            SecurityAuthenticatorService,
            SecurityAuthorizatorService,
            { provide: SecurityAuthenticationService, useClass: UsernamePasswordOAuth2AuthenticationService },
            { provide: SecurityUserDetailsService, useClass: BypassUserDetailsService },
            { provide: SecurityAuthorizationService, useClass: TokenAuthorizationService },
            { provide: SecurityTokenRequestService, useClass: TokenOAuth2RequestService }
          ]
        };
      case 'security-basic':
        return {
          ngModule: RaNGModule,
          providers: [
            SecurityAuthenticatorService,
            SecurityAuthorizatorService,
            { provide: SecurityAuthenticationService, useClass: UsernamePasswordBasicAuthenticationService },
            { provide: SecurityUserDetailsService, useClass: JsonUserDetailsService },
            { provide: SecurityAuthorizationService, useClass: TokenAuthorizationService },
            { provide: SecurityTokenRequestService, useClass: TokenBasicAuthRequestService }
          ]
        };
      case 'security-jwt':
        return {
          ngModule: RaNGModule,
          providers: [
            SecurityAuthenticatorService,
            SecurityAuthorizatorService,
            { provide: SecurityAuthenticationService, useClass: UsernamePasswordJwtAuthenticationService },
            { provide: SecurityUserDetailsService, useClass: JwtUserDetailsService },
            { provide: SecurityAuthorizationService, useClass: TokenAuthorizationService },
            { provide: SecurityTokenRequestService, useClass: TokenJwtRequestService }
          ]
        };
      case 'security-oauth2':
        return {
          ngModule: RaNGModule,
          providers: [
            SecurityAuthenticatorService,
            SecurityAuthorizatorService,
            { provide: SecurityAuthenticationService, useClass: UsernamePasswordOAuth2AuthenticationService },
            { provide: SecurityUserDetailsService, useClass: JsonUserDetailsService },
            { provide: SecurityAuthorizationService, useClass: TokenAuthorizationService },
            { provide: SecurityTokenRequestService, useClass: TokenOAuth2RequestService }
          ]
        };
      default:
        return {
          ngModule: RaNGModule,
          providers: []
        };
    }
  }
}
