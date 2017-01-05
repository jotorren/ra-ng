import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { JwtHelper } from './jwt-helper';
import { SecurityTokenRequestService } from './security-token-request.service';

@Injectable()
export class TokenJwtRequestService extends SecurityTokenRequestService {
    // private className = this.constructor.name;
    private className = 'TokenJwtRequestService';

    private jwtHelper: JwtHelper = new JwtHelper();

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
            this.log.error('log.rang.conf.error', {class: this.className, detail: errors});
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(this.i18n.instant('security.error.token.jwt.conf.message')));
            });
        }

        let noJwtError = false;
        if (this.cfgService.conf.security.token.jwt) {
            noJwtError = this.cfgService.conf.security.token.jwt.noJwtError;
        }

        if (this.jwtHelper.isTokenExpired(token)) {
            if (!noJwtError) {
                return new Observable<Response>((obs: any) => {
                    obs.error(new Error(this.i18n.instant('security.error.token.jwt.notoken.message')));
                });
            }
        } else {
            req.headers.set(this.cfgService.conf.security.token.header.name,
                this.cfgService.conf.security.token.header.prefix + ' ' + token);
        }

        return this.http.request(req);
    }
}
