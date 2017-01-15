import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { TranslateService, LangChangeEvent } from '../i18n';
import { EventBusService, BroadcastEvent, EnterAnnouncedEventType, UpdateAnnouncedEventType, LeaveConfirmedEventType } from '../event';
import { BreadcrumbItem } from './breadcrumb.service';

export class BreadcrumbedComponent implements OnInit, OnDestroy {
  item: BreadcrumbItem;

  private translate$: Subscription;

  constructor(
    route: ActivatedRoute,
    protected label: string,
    protected translate: TranslateService,
    protected eventBus: EventBusService) {

    let uri: string;
    route.snapshot.url.forEach((elem) => {
      uri = uri ? uri + '/' + elem.path : elem.path;
    });

    this.item = { route: uri, label: this.translate.instant(label) };
  }

  ngOnInit() {
    this.translate$ = this.translate.onLangChange.subscribe(
      (params: LangChangeEvent) => {
        this.onLangChange(params);
      }
    );

    this.addItem();
  }

  ngOnDestroy() {
    this.translate$.unsubscribe();
    this.removeItem();
  }

  protected onLangChange(event: LangChangeEvent) {
    this.item.label = this.translate.instant(this.label);
    this.updateItem();
  }

  protected addItem() {
    let event = new BroadcastEvent(EnterAnnouncedEventType, this.item);
    this.eventBus.dispatch(event);
  }

  protected updateItem() {
    let event = new BroadcastEvent(UpdateAnnouncedEventType, this.item);
    this.eventBus.dispatch(event);
  }

  protected removeItem() {
    let event = new BroadcastEvent(LeaveConfirmedEventType, this.item);
    this.eventBus.dispatch(event);
  }
}
