import { Observable } from 'rxjs/Rx';
import { sendHttpRequest } from '../http';
import { ErrorsService } from '../error';

export interface FetchResponse {
    serviceName: string;
    config: any;
}

export class ConfigurationLoaderService {
    static bootstrap(cfgUrl: string, conf: any): Observable<string[]> {

        let environment: Observable<any> = Observable.of('{}');
        if (cfgUrl) {
            environment = Observable.fromPromise(sendHttpRequest({
                method: 'GET',
                url: cfgUrl
            }));
        }

        return environment
            .catch((error) => {
                console.log(ErrorsService.extractMessage(error));
                return Observable.of('{}');
            })
            .map((resp) => {
                // load environment properties
                let envconf = JSON.parse(<string>resp);
                ConfigurationLoaderService.mapObject(envconf, conf);
                console.log(JSON.stringify(conf));
                // console.log(conf);
            })
            .flatMap((resp) => {
                if (conf.hasOwnProperty('import')) {
                    return ConfigurationLoaderService.fetch(conf['import'], conf);
                } else {
                    return Observable.of([]);
                }
            });
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

    private static mapObject(fromObject, toObject): void {
        if (fromObject) {
            for (let prop in fromObject) {
                if (fromObject.hasOwnProperty(prop)) {
                    if (fromObject[prop] instanceof Array) {
                        if (!toObject[prop]) { toObject[prop] = []; }
                        ConfigurationLoaderService.mapArray(fromObject[prop], toObject[prop]);
                    } else if (fromObject[prop] instanceof Object) {
                        if (!toObject[prop]) { toObject[prop] = {}; }
                        ConfigurationLoaderService.mapObject(fromObject[prop], toObject[prop]);
                    } else {
                        toObject[prop] = fromObject[prop];
                    }
                }
            }
        }
    }

    private static mapArray(fromArray, toArray): void {
        if (fromArray) {
            for (let item of fromArray) {
                toArray.push(item);
            }
        }
    }
}
