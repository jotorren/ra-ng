import { LoggingEvent } from 'log4javascript';
import { AjaxAppenderImmediate } from './log-appender-ajax-immediate';

export class AjaxAppenderBatch extends AjaxAppenderImmediate {
    private total = 0;

    constructor(url: string, sessionId: string, withCredentials?: boolean) {
        super(url, sessionId, withCredentials);
        this.setRequestSuccessCallback((request) => { console.log(request.responseText); });
        this.setBatchSize(50);
        this.setTimed(true);
        this.setTimerInterval(10000);
        /*
            If batching is used in conjunction with timed sending of log messages, 
            messages will still be sent in batches of size batchSize, regardless of 
            how many log messages are queued by the time the timed sending is invoked. 
            Incomplete batches will not be sent except when the page unloads, 
            if sendAllOnUnload is set to true.
        */
    }

    doAppend(loggingEvent: LoggingEvent): void {
        super.doAppend(loggingEvent);
        this.total++;
    }

    getQueueSize(): number {
        return this.total % this.getBatchSize();
    }
}
