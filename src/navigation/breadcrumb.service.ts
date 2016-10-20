// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/Rx';

export interface BreadcrumbItem {
    route: string;
    label: string;
}

// @Injectable()
// export class BreadcrumbService {

//     // Observable string sources
//     private enterAnnouncedSource = new Subject<BreadcrumbItem>();
//     private leaveConfirmedSource = new Subject<BreadcrumbItem>();

//     // Observable string streams
//     enterAnnounced$ = this.enterAnnouncedSource.asObservable();
//     leaveConfirmed$ = this.leaveConfirmedSource.asObservable();

//     // Service message commands
//     enter(item: BreadcrumbItem) {
//         this.enterAnnouncedSource.next(item);
//     }

//     leave(item: BreadcrumbItem) {
//         this.leaveConfirmedSource.next(item);
//     }
// }
