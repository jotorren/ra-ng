import { Component, ViewChild, TemplateRef, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { Message } from 'primeng/primeng';

import { ConfigurationService } from '../config';
import { TranslateService } from '../i18n';
import { BroadcastEvent, ClearMessagesEventType } from '../event';

@Component({
    moduleId: module.id,
    selector: 'rang-messages',
    template: `
            <template [ngTemplateOutlet]="getUIComponent()"></template>

            <template #inline>
            <section id="messages">
                <p-panel [toggleable]="false">
                    <header>
                        <button type="button" (click)="clear()">{{ 'ui.messages.panel.title' | translate }}</button>
                    </header>
                    <p-messages [value]="infoMessages" [closable]="closable"></p-messages>
                    <p-messages [value]="warnMessages" [closable]="closable"></p-messages>
                    <p-messages [value]="errorMessages" [closable]="closable"></p-messages>
                </p-panel>
            </section>
            </template>

            <template #growl>
                <p-growl [value]="messages" sticky="sticky" life="life"></p-growl>
            </template>    
    `
})
export class MessagesComponent implements OnChanges {
    @ViewChild('inline') inlineTmpl: TemplateRef<any>;
    @ViewChild('growl') growlTmpl: TemplateRef<any>;

    @Input() messages: Message[] = [];
    @Input() closable: boolean = true; // inherited from p-messages
    @Input() sticky: boolean = false; // inherited from p-growl
    @Input() life: number = 3000; // inherited from p-growl
    @Output() onClear = new EventEmitter<BroadcastEvent>();

    shownMessages: Message[] = [];
    infoMessages: Message[] = [];
    warnMessages: Message[] = [];
    errorMessages: Message[] = [];

    constructor(public cfgService: ConfigurationService, public translate: TranslateService) {
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            if (changes.hasOwnProperty(propName) && 'messages' === propName) {
                let changedProp = changes[propName];
                let toVal: Message[] = changedProp.currentValue;

                if (JSON.stringify(toVal) !== JSON.stringify(this.shownMessages)) {
                    this.shownMessages = toVal.slice(0);

                    this.infoMessages = [];
                    this.warnMessages = [];
                    this.errorMessages = [];

                    for (let msg of toVal) {
                        switch (msg.severity) {
                            case 'info':
                                this.infoMessages.push(msg);
                                break;
                            case 'warn':
                                this.warnMessages.push(msg);
                                break;
                            case 'error':
                                this.errorMessages.push(msg);
                                break;
                        }
                    }

                    if (this.cfgService.conf.ui.messages !== 'inline' && !this.sticky && this.shownMessages.length > 0) {
                        setTimeout(() => { this.clear(); }, this.life);
                    }
                }
            }
        }
    }

    getUIComponent() {
        return this.cfgService.conf.ui.messages === 'inline' ? this.inlineTmpl : this.growlTmpl;
    }

    clear() {
        this.onClear.emit({
            type: ClearMessagesEventType,
            data: new Date(),
            source: 'MessagesComponent',
            target: null
        });
    }
}
