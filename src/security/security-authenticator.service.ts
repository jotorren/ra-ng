import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ConfigurationService } from '../config';
import { TranslateService } from '../i18n';
import { LogI18nService } from '../log';
import { UserContextService } from '../env';
import { ErrorsService } from '../error';
import { EventBusService, BroadcastMessage } from '../event';
import { SpinnerService } from '../navigation/spinner.service';
import { SecurityAuthenticationToken } from './security-authentication-token';
import { SecurityAuthenticationService } from './security-authentication.service';
import { SecurityUserDetailsService } from './security-userdetails.service';

@Injectable()
export class SecurityAuthenticatorService {
    // private className = this.constructor.name;
    private className = 'SecurityAuthenticatorService';

    constructor(
        private authenticator: SecurityAuthenticationService,
        private authoritiesLoader: SecurityUserDetailsService,
        private cfgService: ConfigurationService,
        private context: UserContextService,
        private router: Router,
        private i18n: TranslateService,
        private log: LogI18nService,
        private eventbus: EventBusService,
        private spinner: SpinnerService) {
    }

    login(token: SecurityAuthenticationToken) {
        this.spinner.toggle(true);
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
                this.spinner.toggle(false);
            },
            error => {
                this.notifyError(error);
                this.spinner.toggle(false);
            });
    }

    logout() {
        this.spinner.toggle(true);
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
                this.spinner.toggle(false);
            },
            error => {
                this.notifyError(error);
                this.spinner.toggle(false);
            });
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
