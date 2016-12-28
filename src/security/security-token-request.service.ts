import { Http, Headers, Request, Response, RequestOptions, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';

export abstract class SecurityTokenRequestService {
    private config: any;

    constructor(
        protected cfgService: ConfigurationService,
        protected http: Http,
        protected defOpts?: RequestOptions) {
        if (cfgService.conf.security) {
            this.config = cfgService.conf.security.token;
        }
    }

    protected checkConfiguration(): string {
        let error: string;

        if (!this.cfgService.conf.security || !this.cfgService.conf.security.token) {
            error = 'security.token';
        } else if (!this.cfgService.conf.security.token.header ||
            !this.cfgService.conf.security.token.header.name ||
            !this.cfgService.conf.security.token.header.prefix) {
            error = 'security.token.header.[name | prefix]';
        }

        return error;
    }

    public abstract requestWithToken(req: Request, token: string): Observable<Response>;

    public setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
        if (!request.headers) {
            request.headers = new Headers();
        }
        headers.forEach((header: Object) => {
            let key: string = Object.keys(header)[0];
            let headerValue: string = (header as any)[key];
            (request.headers as Headers).set(key, headerValue);
        });
    }

    public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url === 'string') {
            return this.get(url, options); // Recursion: transform url from String to Request
        }
        // else if ( ! url instanceof Request ) {
        //   throw new Error('First argument must be a url string or Request instance.');
        // }

        // from this point url is always an instance of Request;
        let req: Request = url as Request;
        let token: string | Promise<string>;
        if (this.config) {
            // token = this.config.jwt.tokenGetter();
            token = this.config.storage.provider.getItem(this.config.storage.key);
            if (token instanceof Promise) {
                return Observable.fromPromise(token).mergeMap((jwtToken: string) => this.requestWithToken(req, jwtToken));
            } else {
                return this.requestWithToken(req, token);
            }
        } else {
            return this.requestWithToken(req, null);
        }
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Get, url: url }, options);
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: body, method: RequestMethod.Post, url: url }, options);
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: body, method: RequestMethod.Put, url: url }, options);
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Delete, url: url }, options);
    }

    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: body, method: RequestMethod.Patch, url: url }, options);
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Head, url: url }, options);
    }

    public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.requestHelper({ body: '', method: RequestMethod.Options, url: url }, options);
    }

    private mergeOptions(providedOpts: RequestOptionsArgs, defaultOpts?: RequestOptions) {
        let newOptions = defaultOpts || new RequestOptions();
        if (this.config && this.config.header.globals) {
            this.setGlobalHeaders(this.config.header.globals, providedOpts);
        }

        newOptions = newOptions.merge(new RequestOptions(providedOpts));

        return newOptions;
    }

    private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions?: RequestOptionsArgs): Observable<Response> {
        let options = new RequestOptions(requestArgs);
        if (additionalOptions) {
            options = options.merge(additionalOptions);
        }
        return this.request(new Request(this.mergeOptions(options, this.defOpts)));
    }
}
