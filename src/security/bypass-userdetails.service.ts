import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SecurityUserDetailsService } from './security-userdetails.service';
import { SecurityAuthenticationToken } from './security-authentication-token';

@Injectable()
export class BypassUserDetailsService extends SecurityUserDetailsService {

    tryLoadProfile(token: SecurityAuthenticationToken): Observable<any> {
        return Observable.of('{"security": "bypass loadProfile"}');
    }
    onLoadProfile(response: any): any {
        return response;
    }

    tryUnloadProfile(): Observable<any> {
        return Observable.of('{"security": "bypass unloadProfile"}');
    }
    onUnloadProfile(response: any): any {
        return response;
    }
}
