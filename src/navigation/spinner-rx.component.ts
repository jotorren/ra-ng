import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { SpinnerService } from './spinner.service';

@Component({
    moduleId: module.id,
    selector: 'rang-spinner-rx',
    templateUrl: 'spinner.component.html',
    styleUrls: ['spinner.component.css']
})
export class SpinnerRxComponent implements OnInit, OnDestroy {
    private timer;
    private isActive: boolean = false;
    private subscription: Subscription;

    @Input() public maxTime: number = 120000;

    constructor(private manager: SpinnerService) {
    }

    ngOnInit(): any {
        this.subscription = this.manager.channel.subscribe((showHide: boolean) => this.showOrHideIndicator(showHide));
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
        this.subscription.unsubscribe();
    }

    private showOrHideIndicator(value: boolean) {
        if (!value) {
            this.cancelTimeout();
            return;
        }

        if (this.timer) {
            return;
        }

        this.isActive = true;
        this.timer = setTimeout(() => { this.cancelTimeout(); }, this.maxTime);
    }

    private cancelTimeout(): void {
        this.isActive = false;
        clearTimeout(this.timer);
        this.timer = undefined;
    }
}
