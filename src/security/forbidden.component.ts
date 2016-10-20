import { Component, OnInit } from '@angular/core';

@Component({
  // there's no selector because we render this component
  // through the router-outlet
  template: `
    <br><br><h3>{{ 'ui.forbidden.message' | translate }}</h3><br><br>
  `
})
export class ForbiddenComponent implements OnInit {

  ngOnInit() {
  }
}
