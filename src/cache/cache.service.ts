import { Injectable } from '@angular/core';
import * as CacheFactory from 'cachefactory';
import { ICache, CacheOptions } from 'cachefactory';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';

interface CacheDefinition {
    name: string;
    options: CacheOptions;
}

@Injectable()
export class CacheService {
    // private className = this.constructor.name;
    private className = 'CacheService';

    constructor(private cfgService: ConfigurationService, private log: LogI18nService, ...names: string[]) {

        const defaultOptions: CacheOptions = {
            disabled: true,
            onExpire: (key: any, value: any): void => {
                this.log.debug('log.cache.expired.entry', { class: this.className, key: key, value: value });
            }
        };

        if (cfgService.conf.hasOwnProperty('cache')) {
            let suffix: string = '-' + Math.random();
            for (let def of <CacheDefinition[]>cfgService.conf['cache']){
                if (names.length === 0 || (names.indexOf(def.name) !== -1)) {
                    let opts: CacheOptions = def.options ? def.options : defaultOptions;
                    this[def.name] = CacheFactory.createCache(def.name + suffix, opts);
                    this[def.name].enable();
                    this.log.info('log.cache.creation', { class: this.className, name: def.name + suffix });
                }
            }
        } else {
            this.log.error('log.cache.not.defined', { class: this.className });
        }
    }

    get(name: string): ICache {
        return this[name];
    }
}
