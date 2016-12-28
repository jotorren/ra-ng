import { Appender, AlertAppender, AjaxAppender, BrowserConsoleAppender } from 'log4javascript';
import { UUID } from '../env';
import { AjaxAppenderImmediate } from './log-appender-ajax-immediate';
import { AjaxAppenderBatch } from './log-appender-ajax-batch';

export class LogAppenderFactory {
    static getAppender(type: string, ajax): Appender {
        switch (type) {
            case 'AlertAppender':
                return new AlertAppender();
            case 'AjaxAppenderImmediate':
                return new AjaxAppenderImmediate(ajax.endpoint, UUID.UUID(), ajax.withCredentials);
            case 'AjaxAppenderBatch':
                let ajaxAppender: AjaxAppender = new AjaxAppenderBatch(ajax.endpoint, UUID.UUID(), ajax.withCredentials);
                if (ajax.batchSize) {
                    ajaxAppender.setBatchSize(ajax.batchSize);
                }
                if (ajax.timerInterval) {
                    ajaxAppender.setTimerInterval(ajax.timerInterval);
                }
                return ajaxAppender;
            default:
                return new BrowserConsoleAppender();
        }
    }
}
