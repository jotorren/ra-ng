import { Component, OnInit, OnDestroy, OnChanges, SimpleChange, Input } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { MenuItem } from 'primeng/primeng';

// import { LogI18nService } from 'rang/log';
// import { ErrorsService } from 'rang/error';
// import { BreadcrumbService } from 'rang/navigation';

import { EventBusService, EnterAnnouncedEventType, UpdateAnnouncedEventType, LeaveConfirmedEventType } from 'rang/event';

@Component({
    moduleId: module.id,
    selector: 'app-breadcrumb',
    templateUrl: 'breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit, OnDestroy, OnChanges {
    @Input() baseUrl: string = '';
    @Input() home: MenuItem;

    @Input() style: any; // inherited from p-breadcrumb
    @Input() styleClass: string; // inherited from p-breadcrumb

    private breadcrumb: MenuItem[];

    private enterSubs: Subscription;
    private updateSubs: Subscription;
    private leaveSubs: Subscription;

    // constructor(private log: LogI18nService, private crumbService: BreadcrumbService) {
    // }

    constructor(private eventBus: EventBusService) {
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
}
