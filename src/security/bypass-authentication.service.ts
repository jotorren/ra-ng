import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SecurityAuthenticationService } from './security-authentication.service';
import { SecurityAuthenticationToken } from './security-authentication-token';

@Injectable()
export class BypassAuthenticationService extends SecurityAuthenticationService {

    tryLogin(token: SecurityAuthenticationToken): Observable<any> {
        return Observable.of('{"security": "bypass login"}');
    }
    onLogin(response: any): any {
        return response;
    }

    tryLogout(): Observable<any> {
        return Observable.of('{"security": "bypass logout"}');
    }
    onLogout(response: any): any {
        return response;
    }
}
