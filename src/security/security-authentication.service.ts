import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SecurityAuthenticationToken } from './security-authentication-token';

@Injectable()
export abstract class SecurityAuthenticationService {

    abstract tryLogin(token: SecurityAuthenticationToken): Observable<any>;
    abstract onLogin(response: any): any;

    abstract tryLogout(): Observable<any>;
    abstract onLogout(response: any): any;
}
