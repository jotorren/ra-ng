import { Component, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { SelectItem } from 'primeng/primeng';

import { ConfigurationService } from '../config';

@Component({
    moduleId: module.id,
    selector: 'app-lang-selector',
    templateUrl: 'language.component.html'
})
export class LanguageComponent {
    @ViewChild('std') stdTmpl: TemplateRef<any>;
    @ViewChild('primeng') primengTmpl: TemplateRef<any>;

    availableLangs: SelectItem[] = null;
    selectedLang: string = null;

    constructor(public cfgService: ConfigurationService, public translate: TranslateService) {
        this.availableLangs = cfgService.conf.availableLangs;
        this.selectedLang = cfgService.conf.appLang;
    }

    getUIComponent() {
        return  this.cfgService.conf.ui.langselector === 'std' ? this.stdTmpl : this.primengTmpl;
    }
}
