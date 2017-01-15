import { Directive, Input, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FormValidatorService } from './form-validator.service';

@Directive({
    selector: '[validateOnblur]'
})
export class ValidateOnBlurDirective {
    @Input() validateOnblur: string;

    constructor(public formControl: NgControl, private validator: FormValidatorService) {
    }

    @HostListener('focus') onFocus() {
        this.formControl.control.markAsUntouched(false);
    }

    @HostListener('blur') onBlur() {
        this.validator.formName = this.validateOnblur;
        this.validator.validateControl(this.formControl, this.formControl.path);
        this.formControl.control.markAsTouched(true);
    }
}
