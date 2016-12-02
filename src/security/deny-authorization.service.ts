import { Injectable } from '@angular/core';

import { SecurityAuthorizationService, SecuredObject } from './security-authorization.service';

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

    hasAnyPerm(perms: string[], instance?: SecuredObject): boolean {
        return true;
    }

    hasAllPerm(perms: string[], instance?: SecuredObject): boolean {
        return true;
    }
}
