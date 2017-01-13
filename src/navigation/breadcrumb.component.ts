import { Component, OnInit, OnDestroy, OnChanges, SimpleChange, Input, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { MenuItem } from 'primeng/primeng';

import { EventBusService, EnterAnnouncedEventType, UpdateAnnouncedEventType, LeaveConfirmedEventType } from '../event';

@Component({
    selector: 'rang-breadcrumb',
    template: `
        <template [ngTemplateOutlet]="getComponentTemplate()" [ngOutletContext]="{ parent: this }"></template>

        <template #default>
            <p-breadcrumb [model]="breadcrumb" [style]="style" [styleClass]="styleClass"></p-breadcrumb>
        </template>
    `
})
export class BreadcrumbComponent implements OnInit, OnDestroy, OnChanges {
    @Input() baseUrl: string = '';
    @Input() home: MenuItem;

    @Input() style: any; // inherited from p-breadcrumb
    @Input() styleClass: string; // inherited from p-breadcrumb

    @ViewChild('default') defaultTemplate: TemplateRef<any>;
    @ContentChild(TemplateRef) bcTemplate: TemplateRef<any>;

    breadcrumb: MenuItem[];

    private enterSubs: Subscription;
    private updateSubs: Subscription;
    private leaveSubs: Subscription;

    // constructor(private log: LogI18nService, private crumbService: BreadcrumbService) {
    // }

    constructor(private eventBus: EventBusService, private router: Router) {
    }

    ngOnInit() {

        this.breadcrumb = [];
        if (this.home) {
            this.breadcrumb.push(this.home);
        }

        // this.enterSubs = this.crumbService.enterAnnounced$.subscribe(
        //     data => { this.breadcrumb.push({ routerLink: [this.baseUrl + data.route], label: data.label }); },
        //     error => { this.log.error(ErrorsService.extractMessage(error)); }
        // );

        this.enterSubs = this.eventBus.listenByFilter(
            event => {
                this.breadcrumb.push({ routerLink: [this.baseUrl + event.data.route], label: event.data.label });
            },
            EnterAnnouncedEventType
        );

        this.updateSubs = this.eventBus.listenByFilter(
            event => {
                this.breadcrumb.forEach((value) => {
                    if (value.routerLink && value.routerLink[0] === this.baseUrl + event.data.route) {
                        value.label = event.data.label;
                    }
                });
            },
            UpdateAnnouncedEventType
        );

        // this.leaveSubs = this.crumbService.leaveConfirmed$.subscribe(
        //     data => {
        //         this.breadcrumb = this.breadcrumb.filter((value) => {
        //             return !value.routerLink || (value.routerLink[0] !== this.baseUrl + data.route);
        //         });
        //     },
        //     error => { this.log.error(ErrorsService.extractMessage(error)); }
        // );

        this.leaveSubs = this.eventBus.listenByFilter(
            event => {
                this.breadcrumb = this.breadcrumb.filter((value) => {
                    return !value.routerLink || (value.routerLink[0] !== this.baseUrl + event.data.route);
                });
            },
            LeaveConfirmedEventType
        );
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (this.breadcrumb && changes.hasOwnProperty('home')) {
            this.breadcrumb[0] = changes['home'].currentValue;
        }
    }

    ngOnDestroy() {
        this.enterSubs.unsubscribe();
        this.updateSubs.unsubscribe();
        this.leaveSubs.unsubscribe();
    }

    getComponentTemplate() {
        return this.bcTemplate ? this.bcTemplate : this.defaultTemplate;
    }

    itemClick(event: Event, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        if (!item.url || item.routerLink) {
            event.preventDefault();
        }

        if (item.routerLink) {
            this.router.navigate(item.routerLink);
        }
    }
}
