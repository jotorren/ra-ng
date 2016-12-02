import { Injectable } from '@angular/core';

import { SecurityAuthorizationService, SecuredObject } from './security-authorization.service';

@Injectable()
export class BypassAuthorizationService extends SecurityAuthorizationService {
    constructor() {
        super();
    }

    isSecurityActive(): boolean {
        return false;
    }

    isAuthenticated(): boolean {
        return true;
    }

    hasAnyRole(roles: string[]): boolean {
        return true;
    }

    hasAllRole(roles: string[]): boolean {
        return true;
    }

    hasAnyPerm(perms: string[], instance?: SecuredObject): boolean {
        return true;
    }

    hasAllPerm(perms: string[], instance?: SecuredObject): boolean {
        return true;
    }
}
