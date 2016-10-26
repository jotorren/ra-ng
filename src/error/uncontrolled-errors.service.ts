import { ErrorHandler } from '@angular/core';

import { LogI18nService } from '../log';
import { ErrorsService } from './errors.service';

export class UncontrolledErrorsService extends ErrorHandler {

    constructor(private log: LogI18nService) {
        super(false); // rethrowError = false
    }

    handleError(error: any): void {
        this.log.error(ErrorsService.extractMessage(error));
    }
}
