import { Appender, AlertAppender, BrowserConsoleAppender } from 'log4javascript';

export class LogAppenderFactory {
    static getAppender(type: string): Appender {
        switch (type) {
            case 'AlertAppender':
                return new AlertAppender();
            default:
                return new BrowserConsoleAppender();
        }
    }
}
