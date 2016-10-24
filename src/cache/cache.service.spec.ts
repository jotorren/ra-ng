import { TestBed, inject } from '@angular/core/testing';
import { TranslateModule } from 'ng2-translate/ng2-translate';

import { ConfigurationService } from '../config';
import { TranslateService } from '../i18n';
import { LogI18nService } from '../log';

import { CacheService } from './cache.service';

describe('CacheTest01', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: ConfigurationService, useFactory: () => new ConfigurationService({}) },
                {
                    provide: LogI18nService,
                    useFactory: (i18n: TranslateService) => new LogI18nService('test', i18n),
                    deps: [TranslateService]
                },
            ]
        });

        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('should instantiate component', inject([ConfigurationService, LogI18nService],
        (cfgService: ConfigurationService, log: LogI18nService) => {

            expect(cfgService).not.toBeNull();
            expect(log).not.toBeNull();

            let cache: CacheService = new CacheService(cfgService, log, 'memory');
            expect(cache).not.toBeNull();
        }
    ));

});
