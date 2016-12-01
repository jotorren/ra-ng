import { Component, ViewChild, ContentChild, TemplateRef } from '@angular/core';

import { ConfigurationService } from '../config';
import { UsernamePasswordAuthenticationToken } from './username-password-authentication-token';
import { SecurityAuthenticatorService } from './security-authenticator.service';

@Component({
  moduleId: module.id,
  selector: 'rang-login',
  template: `
    <template [ngTemplateOutlet]="getComponentTemplate()" [ngOutletContext]="{ parent: this }"></template>

    <template #default>
      <div class="login-window">
        <div class="login jumbotron center-block">
          <h2>{{ 'ui.login.title' | translate }}</h2>
          <form *ngIf="active" (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="form-group">
              <label for="username">{{ 'ui.login.label.user' | translate }}</label>
              <input type="text" class="form-control" id="username" placeholder="{{ 'ui.login.label.user' | translate }}" 
                required [(ngModel)]="credentials.username"
                name="username" #username="ngModel">
              <div [hidden]="username.valid || username.pristine" class="alert alert-danger">
                {{ 'ui.login.required.user' | translate }}
              </div>
            </div>
            <div class="form-group">
              <label for="password">{{ 'ui.login.label.pwd' | translate }}</label>
              <input type="password" class="form-control" id="password" placeholder="{{ 'ui.login.label.pwd' | translate }}" 
                required [(ngModel)]="credentials.password"
                name="password" #password="ngModel">
              <div [hidden]="password.valid || password.pristine" class="alert alert-danger">
                {{ 'ui.login.required.password' | translate }}
              </div>
            </div>
            <div class="form-group" *ngIf="domainVisible">
              <label for="domain">{{ 'ui.login.label.domain' | translate }}</label>
              <input type="text" class="form-control" id="domain" placeholder="{{ 'ui.login.label.domain' | translate }}" 
                [(ngModel)]="credentials.domain" name="domain" #domain="ngModel">
            </div>
            <button type="submit" class="btn btn-default" 
              [disabled]="!loginForm.form.valid">{{ 'ui.login.label.submit' | translate }}</button>
          </form>
        </div>
      </div>
    </template>
  `,
  styles: [`
          .login {
            width: 70%;
          }
          .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
          }
          .ng-invalid:not(form)  {
            border-left: 5px solid #a94442; /* red */
          }
  `]
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

  @ViewChild('default') defaultTemplate: TemplateRef<any>;
  @ContentChild(TemplateRef) loginTemplate: TemplateRef<any>;

  constructor(private cfgService: ConfigurationService, private auth: SecurityAuthenticatorService) {
    this.domainVisible = cfgService.conf.ui.loginUseDomain;
  }

  onSubmit() {
    this.submitted = true;

    // let credentials: string = JSON.stringify({ username, password });
    this.credentials.principal = this.credentials.username;
    this.auth.login(this.credentials);
  }

  getComponentTemplate() {
    return this.loginTemplate ? this.loginTemplate : this.defaultTemplate;
  }
}
