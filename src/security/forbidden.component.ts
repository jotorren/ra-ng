import { Component, OnInit, ViewChild, ContentChild, TemplateRef } from '@angular/core';

@Component({
  // there's no selector because we render this component
  // through the router-outlet
  template: `
        <template [ngTemplateOutlet]="getComponentTemplate()"></template>

        <template #default>  
          <br><br><h3>{{ 'ui.forbidden.message' | translate }}</h3><br><br>
        </template>
  `
})
export class ForbiddenComponent implements OnInit {

  @ViewChild('default') defaultTemplate: TemplateRef<any>;
  @ContentChild(TemplateRef) forbiddenTemplate: TemplateRef<any>;

  ngOnInit() {
  }

  getComponentTemplate() {
    return this.forbiddenTemplate ? this.forbiddenTemplate : this.defaultTemplate;
  }
}
