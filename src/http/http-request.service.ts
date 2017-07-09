export interface HttpRequestOptions {
    method: string;
    url: string;
    headers?: any;
    params?: any;
}

export interface HttpErrorResponse {
    status: any;
    statusText: string;
}

export function sendHttpRequest(opts: HttpRequestOptions) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.responseText
                });
            }
        };

        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };

        if (opts.headers) {
            Object.keys(opts.headers).forEach(function (key) {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }

        let params = opts.params;
        // We'll need to stringify if we've been given an object
        // If we have a string, this is skipped.
        if (params && typeof params === 'object') {
            params = Object.keys(params).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }

        xhr.send(params);
    });
}

export function sendHttpRequestParseResponse(url: string, parser: (json: any) => any) {
        sendHttpRequest({
            method: 'GET',
            url: url
        })
        .then(function (datums: string) {
            parser(JSON.parse(datums));
        })
        .catch(function (err: HttpErrorResponse) {
            throw new URIError(err.statusText);
        });
}

export function fromUri2Url(uri: string): string {
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
        return uri;
    }

    return window.location.protocol + '//' + window.location.host + uri;
}
