import { Injectable } from '@angular/core';

import { SecurityAuthorizationService } from './security-authorization.service';

@Injectable()
export class DenyAuthorizationService extends SecurityAuthorizationService {
    constructor() {
        super();
    }

    isSecurityActive(): boolean {
        return true;
    }

    isAuthenticated(): boolean {
        return false;
    }

    hasAnyRole(roles: string[]): boolean {
        return false;
    }

    hasAllRole(roles: string[]): boolean {
        return false;
    }
}
