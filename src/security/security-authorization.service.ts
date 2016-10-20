export abstract class SecurityAuthorizationService {
    abstract isSecurityActive(): boolean;
    abstract isAuthenticated(): boolean;
    abstract hasAnyRole(roles: string[]): boolean;
    abstract hasAllRole(roles: string[]): boolean;
}
