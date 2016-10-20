import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { SecurityAuthenticationToken } from './security-authentication-token';

@Injectable()
export abstract class SecurityUserDetailsService {

    abstract tryLoadProfile(token: SecurityAuthenticationToken): Observable<any>;
    abstract onLoadProfile(response: any): any;

    abstract tryUnloadProfile(): Observable<any>;
    abstract onUnloadProfile(response: any): any;
}
