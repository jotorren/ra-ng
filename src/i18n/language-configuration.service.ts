import { TranslateLoader } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Rx';

import { ConfigurationService } from '../config';

export class LanguageConfigurationService implements TranslateLoader {

    private translations = {};

    constructor(private cfgService: ConfigurationService, private prefix: string) {
        for (let key in cfgService.conf) {
            if (cfgService.conf.hasOwnProperty(key)) {
                if (key.startsWith(prefix)) {
                    this.translations[key] = cfgService.conf[key];
                    delete cfgService.conf[key];
                }
            }
        }
    }

    getTranslation(lang: string): Observable<any> {
        if (this.translations.hasOwnProperty(this.prefix + lang)) {
            return Observable.of(this.translations[this.prefix + lang]);
        } else {
            return Observable.empty();
        }
    }
}
