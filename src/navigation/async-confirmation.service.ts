import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { ConfirmationService } from 'primeng/primeng';

@Injectable()
export class AsyncConfirmationService {

    constructor(private confirmationService: ConfirmationService) {
    }

    confirm(message?: string): Observable<boolean> | Promise<boolean> {
        // return new Promise<boolean>(resolve => {
        //   return resolve(window.confirm('Discard changes?'));
        // });

        let confirmation: Subject<boolean> = new Subject<boolean>();
        this.confirmationService.confirm({
            message: message,
            accept: () => { confirmation.next(true); },
            reject: () => { confirmation.next(false); }
        });
        return confirmation.take(1);
    }
}
