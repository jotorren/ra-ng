import { SecurityAuthenticationToken } from './security-authentication-token';

export class UsernamePasswordAuthenticationToken extends SecurityAuthenticationToken {
    username: string;
    password: string;
    domain: string;

    constructor(username?: string, password?: string, domain?: string) {
        super(username);
        this.username = username;
        this.password = password;
        this.domain = domain;
    }
}
