import { Injectable } from '@angular/core';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { SecuredObject } from './security-authorization.service';

@Injectable()
export class ProfileManagerService {
    // private className = this.constructor.name;
    private className = 'ProfileManagerService';
    private profileConf: any;

    constructor(
        private cfgService: ConfigurationService,
        private log: LogI18nService,
        private i18n: TranslateService) {

        if (!cfgService.conf.security || !cfgService.conf.security.profile) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
        } else {
            this.profileConf = this.cfgService.conf.security.profile;
        }
    }

    setUserProfile(profile: any) {
        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.storage' });
            return;
        }

        if (profile) {
            this.profileConf.storage.provider.setItem(this.profileConf.storage.key, JSON.stringify(profile));
        }
    }

    getUserRoles(): string[] {
        let roles: string[] = [];

        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return roles;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.storage' });
            return roles;
        }

        let profile = JSON.parse(this.profileConf.storage.provider.getItem(this.profileConf.storage.key));
        if (profile) {
            if (this.profileConf.rolesProperty) {
                roles = profile[this.profileConf.rolesProperty];
            } else {
                roles = profile;
            }
        }

        return roles;
    }

    setUserRoles(roles: string[], append: boolean) {
        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.[storage | json]' });
            return;
        }

        if (roles) {
            let profile = JSON.parse(this.profileConf.storage.provider.getItem(this.profileConf.storage.key));
            if (profile && this.profileConf.rolesProperty) {
                if (!profile[this.profileConf.rolesProperty] || !append) {
                    profile[this.profileConf.rolesProperty] = [];
                }
                profile[this.profileConf.rolesProperty].push(...roles);
            } else {
                if (!profile || !append) {
                    profile = [];
                }
                profile.push(...roles);
            }
            this.profileConf.storage.provider.setItem(this.profileConf.storage.key, JSON.stringify(profile));
        }
    }

    getUserPerms(): { [id: string]: string[] } {
        let perms: { [id: string]: string[] } = {};

        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return perms;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.[storage | json]' });
            return perms;
        }

        if (!this.profileConf.permsProperty) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.permsProperty' });
            return;
        }

        let profile = JSON.parse(this.profileConf.storage.provider.getItem(this.profileConf.storage.key));
        if (profile) {
            perms = profile[this.profileConf.permsProperty];
        }

        return perms;
    }

    setUserPerms(perms: { [id: string]: string[] }) {
        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.[storage | json]' });
            return;
        }

        if (!this.profileConf.permsProperty) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.permsProperty' });
            return;
        }

        if (perms) {
            let profile = JSON.parse(this.profileConf.storage.provider.getItem(this.profileConf.storage.key));
            if (profile) {
                if (!profile[this.profileConf.permsProperty]) {
                    profile[this.profileConf.permsProperty] = {};
                }
                profile[this.profileConf.permsProperty] = perms;
                this.profileConf.storage.provider.setItem(this.profileConf.storage.key, JSON.stringify(profile));
            }
        }
    }

    setUserInstancePerms(perms: string[], instance?: SecuredObject) {
        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.[storage | json]' });
            return;
        }

        if (!this.profileConf.permsProperty) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.permsProperty' });
            return;
        }

        if (perms) {
            let profile = JSON.parse(this.profileConf.storage.provider.getItem(this.profileConf.storage.key));
            if (profile) {
                if (!profile[this.profileConf.permsProperty]) {
                    profile[this.profileConf.permsProperty] = {};
                }
                if (instance) {
                    profile[this.profileConf.permsProperty][instance.id] = perms;
                } else {
                    profile[this.profileConf.permsProperty]['*'] = perms;
                }
                this.profileConf.storage.provider.setItem(this.profileConf.storage.key, JSON.stringify(profile));
            }
        }
    }

    removeUserInstancePerms(instance: SecuredObject) {
        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.[storage | json]' });
            return;
        }

        if (!this.profileConf.permsProperty) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.permsProperty' });
            return;
        }

        if (instance) {
            let profile = JSON.parse(this.profileConf.storage.provider.getItem(this.profileConf.storage.key));
            if (profile && profile[this.profileConf.permsProperty]) {
                delete profile[this.profileConf.permsProperty][instance.id];
                this.profileConf.storage.provider.setItem(this.profileConf.storage.key, JSON.stringify(profile));
            }
        }
    }
}
