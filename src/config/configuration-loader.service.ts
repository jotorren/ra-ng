import { Observable } from 'rxjs/Rx';
import { sendHttpRequest } from '../http';

export interface FetchResponse {
    serviceName: string;
    config: any;
}

export class ConfigurationLoaderService {
    static bootstrap(conf: any): Observable<string[]> {
        if (conf.hasOwnProperty('import')) {
            return ConfigurationLoaderService.fetch(conf['import'], conf);
        } else {
            return Observable.of([]);
        }
    }

    static fetch(urls: string[], conf: any): Observable<string[]> {
        let batch = [];
        urls.forEach((url) => {
            batch.push(Observable.fromPromise(sendHttpRequest({
                method: 'GET',
                url: url
            })));
        });

        return Observable.forkJoin(batch, function (...responses) {
            let names: string[] = [];

            if (responses) {
                for (let item of responses) {
                    let resp = <FetchResponse>JSON.parse(<string>item);
                    conf[resp.serviceName] = resp.config;
                    names.push(resp.serviceName);
                }
            }

            return names;
        });
    }
}
