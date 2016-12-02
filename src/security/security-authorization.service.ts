export interface SecuredObject{
    id: string;
}

export abstract class SecurityAuthorizationService {
    abstract isSecurityActive(): boolean;
    abstract isAuthenticated(): boolean;
    abstract hasAnyRole(roles: string[]): boolean;
    abstract hasAllRole(roles: string[]): boolean;
    abstract hasAnyPerm(perms: string[], instance?: SecuredObject): boolean;
    abstract hasAllPerm(perms: string[], instance?: SecuredObject): boolean;
}
