import { Component, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { SelectItem } from 'primeng/primeng';

import { ConfigurationService } from '../config';

@Component({
    moduleId: module.id,
    selector: 'rang-lang-selector',
    template: `
            <div class="lang-selector">
                <span>{{ 'ui.language.selector.label' | translate }}</span>
                <template [ngTemplateOutlet]="getUIComponent()"></template>
            </div>

            <template #std>
            <select (change)="translate.use($event.target.value)">
                <option *ngFor="let lang of availableLangs" 
                    [value]="lang.value" [selected]="lang.value === translate.currentLang">{{lang.label}}</option>
            </select>
            </template>

            <template #primeng>
            <p-dropdown [options]="availableLangs" [(ngModel)]="selectedLang" (onChange)="translate.use($event.value)"></p-dropdown>
            </template>    
    `
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
