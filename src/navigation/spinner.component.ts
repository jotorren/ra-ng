import { Component, Input, OnDestroy } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'rang-spinner',
    templateUrl: 'spinner.component.html',
    styleUrls: ['spinner.component.css']
})
export class SpinnerComponent implements OnDestroy {
    private timer;
    private isActive: boolean = false;

    @Input() public maxTime: number = 120000;

    @Input()
    public set isRunning(value: boolean) {
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

    ngOnDestroy(): any {
        this.cancelTimeout();
    }

    private cancelTimeout(): void {
        this.isActive = false;
        clearTimeout(this.timer);
        this.timer = undefined;
    }
}
