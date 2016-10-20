import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigurationService } from '../config';
import { TranslateService } from '../i18n';
import { LogI18nService } from '../log';
import { UserContextService } from '../env';
import { ErrorsService } from '../error';
import { EventBusService, BroadcastMessage } from '../event';
import { SecurityAuthenticationToken } from './security-authentication-token';
import { SecurityAuthenticationService } from './security-authentication.service';
import { SecurityUserDetailsService } from './security-userdetails.service';

@Injectable()
export class SecurityAuthenticatorService {
    private className = this.constructor.name;

    constructor(
        private authenticator: SecurityAuthenticationService,
        private authoritiesLoader: SecurityUserDetailsService,
        private cfgService: ConfigurationService,
        private context: UserContextService,
        private router: Router,
        private i18n: TranslateService,
        private log: LogI18nService,
        private eventbus: EventBusService) {
    }

    login(token: SecurityAuthenticationToken) {
        this.authenticator.tryLogin(token)
            .map(response => { this.authenticator.onLogin(response); })
            .flatMap((loginResponse) => {
                return this.authoritiesLoader.tryLoadProfile(token)
                    .map(response => this.authoritiesLoader.onLoadProfile(response));
            })
            .subscribe(
            profileResponse => {
                if (!this.cfgService.conf.security || !this.cfgService.conf.security.authenticatedDefaultView) {
                    this.log.error('log.rang.conf.error',
                        { class: this.className, detail: 'security.authenticatedDefaultView' });
                } else {
                    this.context.reset();
                    this.context.principal = token.principal;
                    this.router.navigate([this.cfgService.conf.security.authenticatedDefaultView]);
                }
            },
            error => this.notifyError(error)
            );
    }

    logout() {
        this.authenticator.tryLogout()
            .map(response => this.authenticator.onLogout(response))
            .flatMap((logoutResponse) => {
                return this.authoritiesLoader.tryUnloadProfile()
                    .map(response => this.authoritiesLoader.onUnloadProfile(response));
            })
            .subscribe(
            profileResponse => {
                if (!this.cfgService.conf.security || !this.cfgService.conf.security.unauthenticatedView) {
                    this.log.error('log.rang.conf.error',
                        { class: this.className, detail: 'security.unauthenticatedView' });
                } else {
                    this.context.reset();
                    this.router.navigate([this.cfgService.conf.security.unauthenticatedView]);
                }
            },
            error => this.notifyError(error)
            );
    }

    private notifyError(error: any) {
        this.log.error(ErrorsService.extractMessage(error));

        // controlled error
        this.eventbus.dispatch(new BroadcastMessage({
            severity: 'error',
            summary: this.i18n.instant('security.error.login.message.summary'),
            detail: this.i18n.instant('security.error.login.message.detail')
        }));

        // uncontrolled error: angular doesn't update UI after exception is thrown
        // You shouldn't rely on your application still working properly after the ExceptionHandler was invoked
        // throw new Error(this.i18n.instant('security.error.login.message.detail'));
    }
}
