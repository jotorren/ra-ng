import {
    Component, OnDestroy, OnInit, ViewChild, ContentChild, TemplateRef,
    Input, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationService, Confirmation } from 'primeng/primeng';

@Component({
    selector: 'rang-confirm-dialog',
    template: `
        <template [ngTemplateOutlet]="getComponentTemplate()" [ngOutletContext]="{ parent: this }"></template>

        <template #default>
            <p-confirmDialog [header]="header" [icon]="icon" [message]="message" [acceptIcon]="acceptIcon"
                [acceptLabel]="acceptLabel" [acceptVisible]="acceptVisible" [rejectIcon]="rejectIcon" 
                [rejectLabel]="rejectLabel" [rejectVisible]="rejectVisible" [width]="width" [height]="height" 
                [closeOnEscape]="closeOnEscape" [rtl]="rtl" [closable]="closable" [responsive]="responsive" 
                [appendTo]="appendTo"></p-confirmDialog>
        </template>
    `
})
export class ConfirmationDialogComponent implements OnDestroy, OnInit {

    @Input() header: string;
    @Input() icon: string;
    @Input() message: string;
    @Input() acceptIcon: string = 'fa-check';
    @Input() acceptLabel: string = 'Yes';
    @Input() acceptVisible: boolean = true;
    @Input() rejectIcon: string = 'fa-close';
    @Input() rejectLabel: string = 'No';
    @Input() rejectVisible: boolean = true;
    @Input() width: any;
    @Input() height: any;
    @Input() closeOnEscape: boolean = true;
    @Input() rtl: boolean;
    @Input() closable: boolean = true;
    @Input() responsive: boolean = true;
    @Input() appendTo: any;

    @ViewChild('default') defaultTemplate: TemplateRef<any>;
    @ContentChild(TemplateRef) dialogTemplate: TemplateRef<any>;

    confirmation: Confirmation;
    visible: boolean;
    subscription: Subscription;

    constructor(private confirmationService: ConfirmationService) {
    }

    ngOnInit() {
        // Resources initialization
        this.subscription = this.confirmationService.requireConfirmation$.subscribe(confirmation => {
            this.confirmation = confirmation;
            this.header = this.confirmation.header || this.header;
            this.message = this.confirmation.message || this.message;

            if (this.confirmation.accept) {
                this.confirmation.acceptEvent = new EventEmitter<Event>();
                this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
            }

            if (this.confirmation.reject) {
                this.confirmation.rejectEvent = new EventEmitter<Event>();
                this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
            }

            this.visible = true;
        });
    }

    ngOnDestroy() {
        // Resources release
        this.subscription.unsubscribe();
    }

    getComponentTemplate() {
        return this.dialogTemplate ? this.dialogTemplate : this.defaultTemplate;
    }

    hide(event?: Event) {
        this.visible = false;

        if (event) {
            event.preventDefault();
        }
    }

    accept(event: Event) {
        if (this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit(event);
        }

        this.hide(event);
        this.confirmation = null;
    }

    reject(event: Event) {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit(event);
        }

        this.hide(event);
        this.confirmation = null;
    }
}
