import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { LogI18nService } from '../log';
import { TranslateService } from '../i18n';
import { CryptoService } from './crypto.service';
import { SecurityTokenRequestService } from './security-token-request.service';

@Injectable()
export class TokenBasicAuthRequestService extends SecurityTokenRequestService {
    private className = this.constructor.name;

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
                obs.error(new Error(this.i18n.instant('security.error.token.basicauth.conf.message')));
            });
        }

        let authHeader: string = CryptoService.decrypt(token);

        if (!authHeader) {
            return new Observable<Response>((obs: any) => {
                obs.error(new Error(this.i18n.instant('security.error.token.basicauth.notoken.message')));
            });
        }

        req.headers.set(this.cfgService.conf.security.token.header.name, authHeader);

        return this.http.request(req);
    }
}
