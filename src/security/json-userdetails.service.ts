import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { UsernamePasswordAuthenticationToken } from './username-password-authentication-token';
import { SecurityUserDetailsService } from './security-userdetails.service';

@Injectable()
export class JsonUserDetailsService extends SecurityUserDetailsService {
    // private className = this.constructor.name;
    private className = 'JsonUserDetailsService';

    private credentials: UsernamePasswordAuthenticationToken;
    private profileConf: any;

    constructor(
        private cfgService: ConfigurationService,
        private http: Http,
        private log: LogI18nService,
        private i18n: TranslateService) {
        super();

        if (!cfgService.conf.security || !cfgService.conf.security.profile) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
        } else {
            this.profileConf = this.cfgService.conf.security.profile;
        }
    }

    tryLoadProfile(token: UsernamePasswordAuthenticationToken): Observable<any> {
        if (!this.profileConf.endpoint) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.endpoint' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.profile.endpoint' })
                ));
            });
        }

        this.credentials = token;
        return this.http.get(this.profileConf.endpoint);
    }

    onLoadProfile(response: any): any {
        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return response;
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key ||
            !this.profileConf.json.fieldUsername ||
            !this.profileConf.json.fieldProfile) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.[storage | json]' });
            return response;
        }

        let filter = {};
        filter[this.profileConf.json.fieldUsername] = this.credentials.username;
        let entry = _.find(response.json(), filter);
        if (entry) {
            let profile = entry[this.profileConf.json.fieldProfile];
            if (profile) {
                this.profileConf.storage.provider.setItem(this.profileConf.storage.key, profile);
            }
        }
        return response;
    }

    tryUnloadProfile(): Observable<any> {
        if (!this.profileConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.profile' })
                ));
            });
        }

        if (!this.profileConf.storage ||
            !this.profileConf.storage.provider ||
            !this.profileConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.storage' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.profile.storage' })
                ));
            });
        }

        this.profileConf.storage.provider.removeItem(this.profileConf.storage.key);

        return Observable.of('{"security": "profile removed"}');
    }

    onUnloadProfile(response: any): any {
        return response;
    }
}
