import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { JwtHelper } from './jwt-helper';
import { SecurityAuthenticationToken } from './security-authentication-token';
import { SecurityUserDetailsService } from './security-userdetails.service';

@Injectable()
export class JwtUserDetailsService extends SecurityUserDetailsService {
    // private className = this.constructor.name;
    private className = 'JwtUserDetailsService';

    private jwtHelper: JwtHelper = new JwtHelper();
    private tokenConf: any;
    private profileConf: any;

    constructor(private cfgService: ConfigurationService, private log: LogI18nService, private i18n: TranslateService) {
        super();

        if (!cfgService.conf.security) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security' });
        } else {
            if (!cfgService.conf.security.token) {
                this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
            } else {
                this.tokenConf = this.cfgService.conf.security.token;
            }

            if (!cfgService.conf.security.profile) {
                this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile' });
            } else {
                this.profileConf = this.cfgService.conf.security.profile;
            }
        }
    }

    tryLoadProfile(token: SecurityAuthenticationToken): Observable<any> {
        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token' })
                ));
            });
        }

        if (!this.tokenConf.storage ||
            !this.tokenConf.storage.provider ||
            !this.tokenConf.storage.key ||
            !this.tokenConf.jwt.claimProfile) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.[storage | jwt]' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token.[storage | jwt]' })
                ));
            });
        }

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

        let strtoken: string = this.tokenConf.storage.provider.getItem(this.tokenConf.storage.key);
        if (strtoken) {
            let jwttoken = this.jwtHelper.decodeToken(strtoken);
            let claim = jwttoken[this.tokenConf.jwt.claimProfile];
            if (claim) {
                this.profileConf.storage.provider.setItem(this.profileConf.storage.key, claim);
            }
        }

        return Observable.of('{"security": "profile saved"}');
    }

    onLoadProfile(response: any): any {
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
