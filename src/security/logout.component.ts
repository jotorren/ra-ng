import { Component, ViewChild, TemplateRef } from '@angular/core';

import { ConfigurationService } from '../config';
import { SecurityAuthenticatorService } from './security-authenticator.service';

@Component({
    moduleId: module.id,
    selector: 'app-logout',
    templateUrl: 'logout.component.html'
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
