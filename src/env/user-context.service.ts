import { Injectable } from '@angular/core';

import { ConfigurationService } from '../config';
import { CacheService, Cache } from '../cache';

@Injectable()
export class UserContextService {
    principal: string;

    constructor(private cfgService: ConfigurationService, private cache: CacheService) {
    }

    public get profile(): any {
        let profileConf = this.cfgService.conf.security.profile;
        return profileConf.storage.provider.getItem(profileConf.storage.key);
    }

    public get memory(): Cache {
        return this.cache.get('memory');
    }

    public get session(): Cache {
        return this.cache.get('session');
    }

    public get application(): Cache {
        return this.cache.get('application');
    }

    reset() {
        this.principal = null;

        if (this.cache.get('memory')) {
            this.cache.get('memory').removeAll();
        }
        if (this.cache.get('session')) {
            this.cache.get('session').removeAll();
        }
    }
}
