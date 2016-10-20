import { Injectable } from '@angular/core';
// import { Observable, Observer, Subject } from 'rxjs/Rx';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class SpinnerService {
    // channel: Observable<boolean>;
    // private observer: Observer<boolean>;

    // constructor() {
    //     this.channel = new Observable<boolean>(
    //         observer => this.observer = observer
    //     ).share();
    // }

    // toggle(showHide: boolean) {
    //     if (this.observer) {
    //         this.observer.next(showHide);
    //     }
    // }

    channel: Subject<boolean>;

    constructor() {
        this.channel = new Subject<boolean>();
    }

    toggle(showHide: boolean) {
        if (this.channel) {
            this.channel.next(showHide);
        }
    }
}
