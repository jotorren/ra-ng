import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { getBasicAuthHeaderValue, fromUri2Url } from '../http';
import { CryptoService } from './crypto.service';
import { SecurityAuthenticationService } from './security-authentication.service';
import { UsernamePasswordAuthenticationToken } from './username-password-authentication-token';

@Injectable()
export class UsernamePasswordBasicAuthenticationService extends SecurityAuthenticationService {
    // private className = this.constructor.name;
    private className = 'UsernamePasswordBasicAuthenticationService';
    private tokenConf: any;
    private credentials: string;

    constructor(
        private cfgService: ConfigurationService,
        private http: Http,
        private log: LogI18nService,
        private i18n: TranslateService) {
        super();

        if (!cfgService.conf.security || !cfgService.conf.security.token) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
        } else {
            this.tokenConf = this.cfgService.conf.security.token;
        }
    }

    tryLogin(token: UsernamePasswordAuthenticationToken): Observable<any> {
        let authHeader: string = getBasicAuthHeaderValue(token.username, token.password);
        this.credentials = CryptoService.encrypt(authHeader);

        let headers = new Headers({
            'Authorization': authHeader
        });
        let options = new RequestOptions({ headers: headers });

        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token' })
                ));
            });
        }

        if (!this.tokenConf.endpoint) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.endpoint' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token.endpoint' })
                ));
            });
        }

        return this.http.get(fromUri2Url(this.tokenConf.endpoint), options);
    }

    onLogin(response: any): any {

        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
            return response;
        }

        if (!this.tokenConf.storage ||
            !this.tokenConf.storage.provider ||
            !this.tokenConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.storage' });
        } else {
            this.tokenConf.storage.provider.setItem(this.tokenConf.storage.key, this.credentials);
        }

        return response;
    }

    tryLogout(): Observable<any> {
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
            !this.tokenConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.storage' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token.storage' })
                ));
            });
        }

        // Remove token from localStorage
        this.tokenConf.storage.provider.removeItem(this.tokenConf.storage.key);
        return Observable.of('{"security": "credentials removed"}');
    }

    onLogout(response: any): any {
        return response;
    }
}
