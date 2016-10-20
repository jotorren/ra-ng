import { Component } from '@angular/core';

import { ConfigurationService } from '../config';
import { UsernamePasswordAuthenticationToken } from './username-password-authentication-token';
import { SecurityAuthenticatorService } from './security-authenticator.service';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent {

  domainVisible: boolean = false;

  credentials = new UsernamePasswordAuthenticationToken();

  submitted = false;

  // Reset the form with a new credentials AND restore 'pristine' class state
  // by toggling 'active' flag which causes the form
  // to be removed/re-added in a tick via NgIf
  // TODO: Workaround until NgForm has a reset method (#6822)
  active = true;

  constructor(private cfgService: ConfigurationService, private auth: SecurityAuthenticatorService) {
    this.domainVisible = cfgService.conf.ui.loginUseDomain;
  }

  onSubmit() {
    this.submitted = true;

    // let credentials: string = JSON.stringify({ username, password });
    this.credentials.principal = this.credentials.username;
    this.auth.login(this.credentials);
  }
}
