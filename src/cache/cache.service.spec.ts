import { TestBed, inject } from '@angular/core/testing';
import { TranslateModule } from 'ng2-translate/ng2-translate';

import { ConfigurationService } from '../config';
import { TranslateService } from '../i18n';
import { LogI18nService } from '../log';

import { CacheService } from './cache.service';
import { Cache } from './impl/cache';

describe('CacheTest01', () => {
    let config = {
        log: [
            {
                'name': 'test',
                'level': 'DEBUG',
                'layout': { 'type': 'PatternLayout', 'params': { 'pattern': '%d{HH:mm:ss} %-5p - %m%n' } },
                'additivity': false,
                'appenders': ['BrowserConsoleAppender']
            }
        ],
        cache: [
            {
                name: 'memory',
                options: {
                    'maxAge': 3600000,
                    'deleteOnExpire': 'aggressive',
                    'recycleFreq': 60000,
                    'storageMode': 'memory'
                }
            }
        ]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: ConfigurationService, useFactory: () => new ConfigurationService(config) },
                {
                    provide: LogI18nService,
                    useFactory: (i18n: TranslateService) => new LogI18nService('test', i18n),
                    deps: [TranslateService]
                }
            ]
        });

        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('should instantiate/use a memory cache', inject([ConfigurationService, LogI18nService],
        (cfgService: ConfigurationService, log: LogI18nService) => {

            expect(cfgService).not.toBeNull();
            expect(cfgService).not.toBeUndefined();
            expect(log).not.toBeNull();
            expect(log).not.toBeUndefined();

            let raCache: CacheService;
            let cache: Cache;

            raCache = new CacheService(cfgService, log, 'memory');
            expect(raCache).not.toBeNull();
            expect(raCache).not.toBeUndefined();

            cache = <Cache>raCache.get('memory');
            expect(cache).not.toBeNull();
            expect(cache).not.toBeUndefined();

            let object = { name: 'an object instance' };
            let key = 'cache.spec.test01.key';
            cache.put(key, object);

            let retrieved = cache.get(key);
            expect(retrieved).not.toBeNull();
            expect(retrieved.hasOwnProperty('name')).toEqual(true);
            expect(retrieved['name']).toEqual(object.name);
        }
    ));
});
