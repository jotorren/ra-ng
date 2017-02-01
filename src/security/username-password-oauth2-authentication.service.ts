import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { CryptoService } from './crypto.service';
import { SecurityAuthenticationService } from './security-authentication.service';
import { UsernamePasswordAuthenticationToken } from './username-password-authentication-token';

export interface OAuth2Response {
    access_token?: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

@Injectable()
export class UsernamePasswordOAuth2AuthenticationService extends SecurityAuthenticationService {
    // private className = this.constructor.name;
    private className = 'UsernamePasswordOAuth2AuthenticationService';
    private tokenConf: any;

    private preloaded = false;
 
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
        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token' })
                ));
            });
        }

        if (!this.tokenConf.oauth2 ||
            !this.tokenConf.oauth2.grantType ||
            !this.tokenConf.oauth2.clientCredentials) {
            this.log.error('log.rang.conf.error',
                { class: this.className, detail: 'security.token.oauth2.[grantType | clientCredentials]' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error',
                        { class: this.className, detail: 'security.token.oauth2.[grantType | clientCredentials]' })
                ));
            });
        }

        let body = 'grant_type=' + this.tokenConf.oauth2.grantType
            + '&username=' + token.username + '&password=' + token.password;
        if (token.domain) {
            body = body + '&scope=' + token.domain;
        }

        // let authHeader = getBasicAuthHeaderValue(this.tokenConf.oauth2.clientId, this.tokenConf.oauth2.clientSecret);
        // console.log(CryptoService.encrypt(authHeader));

        let authHeader = CryptoService.decrypt(this.tokenConf.oauth2.clientCredentials);
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authHeader
        });
        let options = new RequestOptions({ headers: headers });

        if (!this.tokenConf.endpoint) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.endpoint' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(
                    this.i18n.instant('log.rang.conf.error', { class: this.className, detail: 'security.token.endpoint' })
                ));
            });
        }

        let endpoint = this.tokenConf.endpoint;
        if (this.tokenConf.urlparams) {
            endpoint += '?' + body;
            body = null;
        }
        return this.http.post(endpoint, body, options);
    }

    onLogin(response: any): any {

        // {
        //     "access_token": "lTCGXgP0K6w2NTz9Zgi9UuBRgGc2dnWEwXsMUAmHz0V2aiKqLtoEFskhxWaGARgXHv3aDnzqfcxZ6IIn
        //                      VHt0R6yaszPmVhhGFKEPMs6Q2i3HJ8XA0KyoGd103zxlk0Gz5fKhHZOgO6n5qa0B0qKS2PYewn8bFkvT
        //                      04sPxY4DDzQFhjuO4sRahoPV3OazMpomUWBNCEKrFSTjfgIRvfvqiOpDFcfT3Mj0hphcbSS5MLZWL2zk
        //                      WWXC6AndXgbO7njk",
        //     "refresh_token":"c9pEaQvTXmJKm0CC5Aqu84HHvh2fDvxJ0LwAyf5Gn2IvwWxomK3V66WqAj0EiFBGDIwIQBm5TADAkoXl
        //                      buOSl2dEXBNs38k7Cl8G4aqFrJZXkBhpuB4oxGpCLAhndbSSX05cGfq1uNEAk3cRXKK7EHnLnYCJ2J5R
        //                      fHaQwKVss8YFBrbpYEdODZ0Y0rKzKn0vNW3GSkhqIh7HnypqrKyH3054Qz8omPD9KZD1uBlFFM2aQH88
        //                      qHMRV2X1zO2u0ViT",
        //     "expires_in": 3600,
        //     "token_type": "bearer"
        // }

        if (!this.tokenConf) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token' });
            return response;
        }

        if (!this.tokenConf.storage ||
            !this.tokenConf.storage.provider ||
            !this.tokenConf.storage.key) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.storage' });
        } else {
            let oauth2Response: OAuth2Response = <OAuth2Response>response.json();
            this.tokenConf.storage.provider.setItem(this.tokenConf.storage.key, JSON.stringify(oauth2Response));
            this.tokenConf.storage.provider.setItem(this.tokenConf.storage.key + '_ts', Date.now());
        }

        let profileConf = this.cfgService.conf.security.profile;
        if (profileConf && profileConf.oauth2 && profileConf.oauth2.fieldProfile) {
            if (!profileConf.storage ||
                !profileConf.storage.provider ||
                !profileConf.storage.key) {
                this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.profile.storage' });
            } else {
                let profile = response.json()[profileConf.oauth2.fieldProfile];
                if (profile) {
                    profileConf.storage.provider.setItem(profileConf.storage.key, profile);
                    this.preloaded = true;
                }
            }
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

        // Remove token from storage
        this.tokenConf.storage.provider.removeItem(this.tokenConf.storage.key);
        this.tokenConf.storage.provider.removeItem(this.tokenConf.storage.key + '_ts');

        // The profile could be set by this class (during onLogin()) without no DetailsService involved, 
        // so this class must be able to delete the profile, otherwise no one will perform the deletion
        if (this.preloaded){
            let profileConf = this.cfgService.conf.security.profile;
            if (profileConf && profileConf.storage && profileConf.storage.provider && profileConf.storage.key) {
                // Remove profile from storage
                profileConf.storage.provider.removeItem(profileConf.storage.key);
            }
        }

        return Observable.of('{"security": "token removed"}');
    }

    onLogout(response: any): any {
        return response;
    }
}
