import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { ErrorsService } from '../error';
import { CryptoService } from './crypto.service';
import { SecurityTokenRequestService } from './security-token-request.service';
import { OAuth2Response } from './username-password-oauth2-authentication.service';

@Injectable()
export class TokenOAuth2RequestService extends SecurityTokenRequestService {
    // private className = this.constructor.name;
    private className = 'TokenOAuth2RequestService';

    constructor(
        cfgService: ConfigurationService,
        private log: LogI18nService,
        private i18n: TranslateService,
        http: Http,
        defOpts?: RequestOptions) {
        super(cfgService, http, defOpts);
    }

    requestWithToken(req: Request, token: string): Observable<Response> {
        let errors = this.checkConfiguration();
        if (errors) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: errors });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(this.i18n.instant('security.error.token.oauth2.conf.message')));
            });
        }

        let jsonToken: OAuth2Response = <OAuth2Response>JSON.parse(token);
        if (!jsonToken) {
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(this.i18n.instant('security.error.token.oauth2.notoken.message')));
            });
        }

        let tokenConf = this.cfgService.conf.security.token;
        if (tokenConf.oauth2.checktoken) {
            switch (tokenConf.oauth2.checktoken.mode) {
                case 'local':
                    this.log.debug('log.security.token.oauth2.check.client', { class: this.className });
                    return this.checkTokenLocal(jsonToken, req);
                case 'remote':
                    this.log.debug('log.security.token.oauth2.check.server', { class: this.className });
                    return this.checkTokenRemote(jsonToken, req);
                case 'off':
                    this.log.debug('log.security.token.oauth2.check.disabled', { class: this.className });
                    break;
                default:
                    this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.oauth2.checktoken.mode' });
                    return new Observable<Response>((obs: any) => {
                        obs.error(new Error(this.i18n.instant('security.error.token.oauth2.conf.message')));
                    });
            }
        }

        req.headers.set(tokenConf.header.name, tokenConf.header.prefix + ' ' + jsonToken.access_token);
        return this.http.request(req);
    }

    private checkTokenLocal(jsonToken: OAuth2Response, req: Request): Observable<Response> {
        let tokenConf = this.cfgService.conf.security.token;

        let ts: number = +tokenConf.storage.provider.getItem(tokenConf.storage.key + '_ts');
        let now: number = Date.now();
        if ((now - ts) >= (jsonToken.expires_in * 1000)) {
            this.log.debug('log.security.token.oauth2.expired.client', { class: this.className });
            return this.refreshToken(jsonToken, req);
        }

        let expires_in: number = (jsonToken.expires_in - (now - ts) / 1000);
        this.log.debug('log.security.token.oauth2.expiresin.client', { class: this.className, secs: expires_in });

        req.headers.set(tokenConf.header.name, tokenConf.header.prefix + ' ' + jsonToken.access_token);
        return this.http.request(req);
    }


    private checkTokenRemote(jsonToken: OAuth2Response, req: Request): Observable<Response> {
        let tokenConf = this.cfgService.conf.security.token;

        if (!tokenConf.oauth2.checktoken.endpoint) {
            this.log.error('log.rang.conf.error', { class: this.className, detail: 'security.token.oauth2.checktoken.endpoint' });
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(this.i18n.instant('security.error.token.oauth2.conf.message')));
            });
        }

        let tokeninfo: string = tokenConf.oauth2.checktoken.endpoint + '?access_token=' + jsonToken.access_token;
        return this.http.get(tokeninfo)
            .flatMap((info) => {
                this.log.debug('log.security.token.oauth2.info', { class: this.className, info: JSON.stringify(info.json()) });
                if (info.json().audience !== tokenConf.oauth2.clientId) {
                    this.log.error('log.security.token.oauth2.client.error', { class: this.className });
                    return new Observable<Response>((obs: any) => {
                        obs.error(new Error(this.i18n.instant('security.error.token.oauth2.client.message')));
                    });
                }

                req.headers.set(tokenConf.header.name, tokenConf.header.prefix + ' ' + jsonToken.access_token);
                return this.http.request(req);
            })
            .catch((error) => {
                if (error instanceof Response) {
                    this.log.debug('log.security.token.oauth2.expired.server',
                        { class: this.className, response: JSON.stringify(error.json()) });
                    if (error.json().error === 'invalid_token') {
                        return this.refreshToken(jsonToken, req);
                    }
                }

                let message = (error.message || this.i18n.instant('security.error.token.oauth2.internal.message'));
                return new Observable<Response>((obs: any) => {
                    obs.error(new Error(message));
                });
            });
    }

    private refreshToken(jsonToken: OAuth2Response, req: Request): Observable<Response> {
        let tokenConf = this.cfgService.conf.security.token;

        if (tokenConf.oauth2.checktoken.refresh === 'on' && jsonToken.refresh_token) {
            let body = 'grant_type=refresh_token&refresh_token=' + jsonToken.refresh_token;
            this.log.debug('log.security.token.oauth2.refresh', { class: this.className, request: body });

            let authHeader = CryptoService.decrypt(tokenConf.oauth2.clientCredentials);
            let headers = new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authHeader
            });
            let options = new RequestOptions({ headers: headers });

            return this.http.post(tokenConf.endpoint, body, options)
                .flatMap((refresh) => {
                    let oauth2Response: OAuth2Response = <OAuth2Response>refresh.json();
                    tokenConf.storage.provider.setItem(tokenConf.storage.key, JSON.stringify(oauth2Response));
                    tokenConf.storage.provider.setItem(tokenConf.storage.key + '_ts', Date.now());
                    this.log.debug('log.security.token.oauth2.refreshed',
                        { class: this.className, response: JSON.stringify(oauth2Response) });

                    req.headers.set(tokenConf.header.name, tokenConf.header.prefix + ' ' + oauth2Response.access_token);
                    return this.http.request(req);
                })
                .catch((error) => {
                    return new Observable<Response>((obs: any) => {
                        obs.error(new Error(
                            this.i18n.instant('security.error.token.oauth2.refresh.message',
                                { detail: ErrorsService.extractMessage(error) })
                        ));
                    });
                });
        }

        return new Observable<Response>((obs: any) => {
            obs.error(new Error(this.i18n.instant('security.error.token.oauth2.expired.message')));
        });
    }
}
