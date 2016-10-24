import { TestBed, inject } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';

import { ConfigurationService } from '../config';
import { TranslateService, LanguageConfigurationService } from '../i18n';

describe('i18nTest01', () => {
    let config = {
        i18n_en:
        {
            'test.i18n.message': 'This message should appear in English'
        },
        i18n_es:
        {
            'test.i18n.message': 'Este mensaje debería aparecer en castellano'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    provide: TranslateLoader,
                    useFactory: (cfgService: ConfigurationService) => {
                        return new LanguageConfigurationService(cfgService, 'i18n_');
                    },
                    deps: [ConfigurationService]
                })
            ],
            providers: [
                { provide: ConfigurationService, useFactory: () => new ConfigurationService(config) }
            ]
        });

        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('should translate messages', inject([TranslateService],
        (i18n: TranslateService) => {
            expect(i18n).not.toBeNull();
            expect(i18n).not.toBeUndefined();

            let key = 'test.i18n.message';

            i18n.use('en');
            expect(i18n.instant(key)).toEqual('This message should appear in English');

            i18n.use('es');
            expect(i18n.instant(key)).toEqual('Este mensaje debería aparecer en castellano');
        }
    ));
});
