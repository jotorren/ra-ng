import { ErrorHandler } from '@angular/core';
import { Appender } from 'log4javascript';

import { LogI18nService, AjaxAppenderBatch } from '../log';
import { ErrorsService } from './errors.service';

export class UncontrolledErrorsService extends ErrorHandler {

    constructor(private log: LogI18nService) {
        super(false); // rethrowError = false
    }

    handleError(error: any): void {
        this.log.error(ErrorsService.extractMessage(error));

        let appenders: Appender[] = this.log.getEffectiveAppenders();
        for (let appender of appenders) {
            if (appender instanceof AjaxAppenderBatch) {
                let batch = appender.getBatchSize() - appender.getQueueSize();
                for (let _i = 0; _i < batch; _i++) {
                    this.log.error('Ignore (filling batch)');
                }
                appender.sendAll();
            }
        }
    }
}
