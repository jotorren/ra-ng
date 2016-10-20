import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router, Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { EventBusService, BroadcastMessage } from '../event';
import { SecurityAuthorizationService } from './security-authorization.service';

@Injectable()
export class SecurityAuthorizatorService implements CanActivate, CanActivateChild, CanLoad {
    private className = this.constructor.name;

    constructor(
        private cfgService: ConfigurationService,
        private securityService: SecurityAuthorizationService,
        private router: Router,
        private log: LogI18nService,
        private eventbus: EventBusService,
        private i18n: TranslateService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkActivation(route.data || {});
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkActivation(route.data || {});
    }

    canLoad(route: Route): boolean {
        return this.checkActivation(route.data || {});
    }

    private checkActivation(data: any): boolean {

        if (!this.securityService.isSecurityActive()) {
            return true;
        }

        this.log.debug('log.security.check.user.credentials', { class: this.className, roles: data['roles'] || '[]' });

        if (!this.securityService.isAuthenticated()) {
            if (this.cfgService.conf.security.globalMessages) {
                this.eventbus.dispatch(new BroadcastMessage({
                    severity: 'error',
                    summary: this.i18n.instant('security.error.not.authenticated.message.summary'),
                    detail: this.i18n.instant('security.error.not.authenticated.message.detail')
                }));
            }

            if (!this.cfgService.conf.security || !this.cfgService.conf.security.unauthenticatedView) {
                this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.unauthenticatedView' });
            } else {
                this.router.navigate([this.cfgService.conf.security.unauthenticatedView]);
            }

            return false;
        }

        if (!this.securityService.hasAnyRole(data['roles'])) {
            this.log.info('log.security.error.forbidden', { class: this.className, roles: data['roles'] });

            if (this.cfgService.conf.security.globalMessages) {
                this.eventbus.dispatch(new BroadcastMessage({
                    severity: 'error',
                    summary: this.i18n.instant('security.error.forbidden.message.summary'),
                    detail: this.i18n.instant('security.error.forbidden.message.detail')
                }));
            }

            if (!this.cfgService.conf.security || !this.cfgService.conf.security.unauthorizedView) {
                this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.unauthorizedView' });
            } else {
                this.router.navigate([this.cfgService.conf.security.unauthorizedView]);
            }

            return false;
        }

        return true;
    }
}
