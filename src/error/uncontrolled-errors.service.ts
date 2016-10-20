import { ErrorHandler } from '@angular/core';

import { LogI18nService } from '../log';

export class UncontrolledErrorsService extends ErrorHandler {

    constructor(private log: LogI18nService) {
        super(false); // rethrowError = false
    }

    handleError(error: any): void {
        let message: any;
        if (error instanceof Error) {
            message = (<Error>error).message;
        } else {
            message = error;
        }

        this.log.error(message);
    }
}
