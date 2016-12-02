import { Injectable } from '@angular/core';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { SecurityAuthorizationService, SecuredObject } from './security-authorization.service';
import { ProfileManagerService } from './profile-manager.service';

@Injectable()
export class TokenAuthorizationService extends SecurityAuthorizationService {
    private className = this.constructor.name;

    constructor(
        private cfgService: ConfigurationService,
        private log: LogI18nService,
        private profileMgr: ProfileManagerService) {
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

        let userRoles: string[] = this.profileMgr.getUserRoles();
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

        let userRoles: string[] = this.profileMgr.getUserRoles();
        if (userRoles) {
            let found = true;
            for (let i = 0; i < roles.length && found; i++) {
                found = userRoles.indexOf(roles[i]) === -1;
            }
            return found;
        }
        return false;
    }

    hasAnyPerm(perms: string[], instance?: SecuredObject): boolean {
        if (undefined === perms || null === perms || perms.length === 0) {
            return true;
        }

        let userPerms = this.profileMgr.getUserPerms();
        if (userPerms) {
            let tocheck;
            if (instance) {
                tocheck = userPerms[instance.id];
            }
            if (!tocheck) {
                tocheck = userPerms['*'];
            }

            if (tocheck) {
                let found = false;
                for (let i = 0; i < perms.length && !found; i++) {
                    found = tocheck.indexOf(perms[i]) > -1;
                }
                return found;
            }
        }

        return false;
    }

    hasAllPerm(perms: string[], instance?: SecuredObject): boolean {
        if (undefined === perms || null === perms || perms.length === 0) {
            return true;
        }

        let userPerms = this.profileMgr.getUserPerms();
        if (userPerms) {
            let tocheck;
            if (instance) {
                tocheck = userPerms[instance.id];
            }
            if (!tocheck) {
                tocheck = userPerms['*'];
            }

            if (tocheck) {
                let found = true;
                for (let i = 0; i < perms.length && found; i++) {
                    found = tocheck.indexOf(perms[i]) === -1;
                }
                return found;
            }
        }

        return false;
    }
}
