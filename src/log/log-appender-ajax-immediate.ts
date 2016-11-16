import { AjaxAppender } from 'log4javascript';

export class AjaxAppenderImmediate extends AjaxAppender {

    constructor(url: string, sessionId: string, withCredentials?: boolean) {
        super(url, withCredentials);
        this.setSessionId(sessionId);
        this.setWaitForResponse(false);
        this.setSendAllOnUnload(true);
        this.setFailCallback((message: string) => { console.log(message); });
        this.setBatchSize(1);
        this.setTimed(false);
        // If timed is set to false then timerInterval has no effect.
    }
}
