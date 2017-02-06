import { Injectable } from '@angular/core';
import { Http, Request, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';
import { SecurityTokenRequestService } from './security-token-request.service';

@Injectable()
export class BypassTokenRequestService extends SecurityTokenRequestService {

    constructor(
        cfgService: ConfigurationService,
        http: Http,
        defOpts?: RequestOptions) {
        super(cfgService, http, defOpts);
    }

    requestWithToken(req: Request, token: string): Observable<Response> {
        return this.http.request(req).catch((error) => { error.request = req; return Observable.throw(error); });
    }
}
