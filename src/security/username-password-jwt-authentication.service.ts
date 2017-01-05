import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { SecurityAuthenticationService } from './security-authentication.service';
import { UsernamePasswordAuthenticationToken } from './username-password-authentication-token';

export interface JwtResponse {
    id_token: string;
}

@Injectable()
export class UsernamePasswordJwtAuthenticationService extends SecurityAuthenticationService {
    // private className = this.constructor.name;
    private className = 'UsernamePasswordJwtAuthenticationService';
    private tokenConf: any;

    constructor(
        private cfgService: ConfigurationService,
        private http: Http,
        private log: LogI18nService,
        private i18n: TranslateService) {
        super();

        if (!cfgService.conf.security || !cfgService.conf.security.token) {
            this.log.error('log.rang.conf.error', {class: this.className, detail: 'security'});
        } else {
            this.tokenConf = this.cfgService.conf.security.token;
        }
    }

    tryLogin(token: UsernamePasswordAuthenticationToken): Observable<any> {
        let body = 'username=' + token.username + '&password=' + token.password;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });

        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', {class: this.className, detail: 'security.token'});
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token' })
                ));
            });
        }

        if (!this.tokenConf.endpoint) {
            this.log.error('log.rang.conf.error', {class: this.className, detail: 'security.token.endpoint'});
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token.endpoint' })
                ));
            });
        }

        return this.http.post(this.tokenConf.endpoint, body, options);
    }

    onLogin(response: any): any {
        // let jwttoken = `{ "id_token": 
        //                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
        //                eyJ1c2VybmFtZSI6ImpvcmRpIiwiaWQiOjIsImV4dHJhIjoie1wicm9sZXNcIjogW1wiYWRtaW5cIl19IiwiaWF0I
        //                joxNDc0MDQyMDg2LCJleHAiOjE0NzQwNjAwODZ9.a1s2cLcw6bWan6yV_eo0q12fJ4thPnhJkg84DvPFQqw"}`;

        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', {class: this.className, detail: 'security.token'});
            return response;
        }

        if (!this.tokenConf.storage ||
            !this.tokenConf.storage.provider ||
            !this.tokenConf.storage.key) {
            this.log.error('log.rang.conf.error', {class: this.className, detail: 'security.token.storage'});
        } else {
            let jwtResponse: JwtResponse = <JwtResponse>response.json();
            this.tokenConf.storage.provider.setItem(this.tokenConf.storage.key, jwtResponse.id_token);
        }

        return response;
    }

    tryLogout(): Observable<any> {
        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', {class: this.className, detail: 'security.token'});
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token' })
                ));
            });
        }

        if (!this.tokenConf.storage ||
            !this.tokenConf.storage.provider ||
            !this.tokenConf.storage.key) {
            this.log.error('log.rang.conf.error', {class: this.className, detail: 'security.token.storage'});
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token.storage' })
                ));
            });
        }

        // Remove token from localStorage
        this.tokenConf.storage.provider.removeItem(this.tokenConf.storage.key);

        return Observable.of('{"security": "token removed"}');
    }

    onLogout(response: any): any {
        return response;
    }
}
