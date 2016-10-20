import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FormValidatorService } from './form-validator.service';

@Directive({
    selector: '[validateOnblur]',
    host: {
        '(focus)': 'onFocus($event)',
        '(blur)': 'onBlur($event)'
    }
})
export class ValidateOnBlurDirective {
    @Input('validateOnblur') validateOnblurForm: string;

    constructor(public formControl: NgControl, private validator: FormValidatorService) {
    }

    onFocus($event) {
        this.formControl.control.markAsUntouched(false);
    }

    onBlur($event) {
        this.validator.formName = this.validateOnblurForm;
        this.validator.validateControl(this.formControl, this.formControl.path);
        this.formControl.control.markAsTouched(true);
    }
}