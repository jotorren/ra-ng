import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Rx';

import { TranslateService } from 'rang/i18n';
import { EventBusService, BroadcastEvent, ValidationEventType, BroadcastMessage } from 'rang/event';

@Injectable()
export class FormValidatorService {
    globalMessages = true;

    form: NgForm;
    formName: string;
    formFields: string[];
    formErrors: any = {};

    parameters: { [key: string]: (error: any) => any } = {
        'required' : (error): any => { return {}; },
        'minlength': (error): any => { return { min: error.requiredLength }; },
        'maxlength': (error): any => { return { max: error.requiredLength }; },
        'pattern'  : (error): any => { return { pattern: error.requiredPattern }; }
    };

    constructor(private translate: TranslateService, private eventbus: EventBusService) {
    }

    validate(current: NgForm) {
        if (current === this.form) { return; }
        this.form = current;
        if (this.form) {
            this.form.valueChanges.subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {
        // data contains the model, not the form
        if (!this.form) { return; }
        const form = this.form.form;

        for (let field of this.formFields) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            this.validateControl(form.get(field), field);
        }
    }

    validateControl(control, field) {
        if (control && control.dirty) {
            this.formErrors[field] = '';

            if (!control.valid && this.globalMessages) {
                this.notify(control, field);
            }

            let validationEvent = new BroadcastEvent(ValidationEventType, { field: field, errors: control.errors });
            this.eventbus.dispatch(validationEvent);
        }
    }

    notify(control, field) {
        let label = this.translate.instant('ui.' + this.formName + '.form.' + field + '.label');
        for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
                let elemMessageKey = 'ui.' + this.formName + '.form.' + field + '.validation.' + key;
                let elemMessage = this.translate.instant(elemMessageKey);
                if (elemMessage === elemMessageKey) {
                    if (this.formErrors[field]) {
                        this.formErrors[field] += ' ' + this.translate.instant('ui.validation.field.and') + ' ';
                    } else {
                        this.formErrors[field] = this.translate.instant('ui.validation.field', { field: label }) + ' ';
                    }
                    this.formErrors[field] +=
                        this.translate.instant('ui.validation.' + key, this.parameters[key](control.errors[key]));
                } else {
                    this.formErrors[field] = elemMessage;
                }
            }
        }

        this.eventbus.dispatch(new BroadcastMessage({
            severity: 'error',
            summary: this.translate.instant('ui.validation.title'),
            detail: this.formErrors[field]
        }));
    }

    listen(handler: (event) => any): Subscription {
        return this.eventbus.listenByFilter(handler, ValidationEventType);
    }

    reset() {
        this.globalMessages = true;

        this.form = undefined;
        this.formName = undefined;
        this.formFields = undefined;
        this.formErrors = {};
    }
}
