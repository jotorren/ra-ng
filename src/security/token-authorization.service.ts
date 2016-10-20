import { Injectable } from '@angular/core';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { SecurityAuthorizationService } from './security-authorization.service';

@Injectable()
export class TokenAuthorizationService extends SecurityAuthorizationService {
    private className = this.constructor.name;

    constructor(private cfgService: ConfigurationService, private log: LogI18nService) {
        super();
    }

    isSecurityActive(): boolean {
        if (!this.cfgService.conf.security) {
            return false;
        }

        if (!this.cfgService.conf.security.mode) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.mode' });
            return false;
        }

        return this.cfgService.conf.security.mode !== 'off';
    }

    isAuthenticated(): boolean {
        if (!this.cfgService.conf.security.token) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
            return false;
        } else {
            if (!this.cfgService.conf.security.token.storage ||
                !this.cfgService.conf.security.token.storage.provider ||
                !this.cfgService.conf.security.token.storage.key) {
                this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.storage' });
                return false;
            }
        }

        let tokenConf = this.cfgService.conf.security.token;
        let token = tokenConf.storage.provider.getItem(tokenConf.storage.key);
        return token !== undefined && token !== null;
    }

    hasAnyRole(roles: string[]): boolean {
        if (undefined === roles || null === roles || roles.length === 0) {
            return true;
        }

        let userRoles: string[] = this.getUserRoles();
        if (userRoles) {
            let found = false;
            for (let i = 0; i < roles.length && !found; i++) {
                found = userRoles.indexOf(roles[i]) > -1;
            }
            return found;
        }
        return false;
    }

    hasAllRole(roles: string[]): boolean {
        if (undefined === roles || null === roles || roles.length === 0) {
            return true;
        }

        let userRoles: string[] = this.getUserRoles();
        if (userRoles) {
            let found = true;
            for (let i = 0; i < roles.length && found; i++) {
                found = userRoles.indexOf(roles[i]) === -1;
            }
            return found;
        }
        return false;
    }

    getUserRoles(): string[] {
        let result: string[] = [];

        if (this.cfgService.conf.security) {
            let profileConf = this.cfgService.conf.security.profile;
            if (profileConf) {
                if (!profileConf.storage ||
                    !profileConf.storage.provider ||
                    !profileConf.storage.key) {
                    this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.storage' });
                } else {
                    let profile = profileConf.storage.provider.getItem(profileConf.storage.key);
                    if (profile) {
                        if (profileConf.rolesProperty) {
                            result = JSON.parse(profile)[profileConf.rolesProperty];
                        } else {
                            result = JSON.parse(profile);
                        }
                    }
                }
            }
        }

        return result;
    }
}
