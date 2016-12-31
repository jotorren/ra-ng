import { Component, ViewChild, TemplateRef } from '@angular/core';

import { ConfigurationService } from '../config';
import { SecurityAuthenticatorService } from './security-authenticator.service';

@Component({
    selector: 'rang-logout',
    template: `
            <template [ngTemplateOutlet]="getUIComponent()"></template>

            <template #button>
                <button type="button" (click)="logout($event)" class="logout-button">{{ 'ui.logout.text' | translate }}</button>
            </template>

            <template #link>
                <a href="#" (click)="logout($event)" class="logout-link">{{ 'ui.logout.text' | translate }}</a>
            </template>

            <template #custom>
                <span (click)="logout($event)" class="logout-custom" title="{{ 'ui.logout.text' | translate }}" ></span>
            </template>
  `,
})
export class LogoutComponent {
    @ViewChild('button') buttonTmpl: TemplateRef<any>;
    @ViewChild('link') linkTmpl: TemplateRef<any>;
    @ViewChild('custom') customTmpl: TemplateRef<any>;

    constructor(private cfgService: ConfigurationService, private auth: SecurityAuthenticatorService) {
    }

    logout(event) {
        event.preventDefault();

        this.auth.logout();
    }

    getUIComponent() {
        let template: TemplateRef<any> = null;
        switch (this.cfgService.conf.ui.logout) {
            case 'button':
                template = this.buttonTmpl;
                break;
            case 'link':
                template = this.linkTmpl;
                break;
            default:
                template = this.customTmpl;
                break;
        }
        return template;
    }
}
