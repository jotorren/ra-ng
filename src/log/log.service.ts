import { Logger, Appender, Level } from 'log4javascript';

import { LoggerFactory } from '../log';

export class LogService {
    private logger: Logger;

    constructor(public name: string) {
        this.logger = LoggerFactory.getLogger(name);
    }

    addAppender(appender: Appender): void {
        this.logger.addAppender(appender);
    }

    removeAppender(appender: Appender): void {
        this.logger.removeAppender(appender);
    }

    removeAllAppenders(): void {
        this.logger.removeAllAppenders();
    }

    getEffectiveAppenders(): Appender[] {
        return this.logger.getEffectiveAppenders();
    }

    setLevel(level: Level): void {
        this.logger.setLevel(level);
    }

    getLevel(): Level {
        return this.logger.getLevel();
    }

    getEffectiveLevel(): Level {
        return this.logger.getEffectiveLevel();
    }

    setAdditivity(additivity: boolean): void {
        this.logger.setAdditivity(additivity);
    }

    getAdditivity(): boolean {
        return this.logger.getAdditivity();
    }

    log(level: Level, params: any[]): void {
        this.logger.log(level, params);
    }

    trace(...messages: any[]): void {
        this.logger.trace(messages);
    }

    debug(...messages: any[]): void {
        this.logger.debug(messages);
    }

    info(...messages: any[]): void {
        this.logger.info(messages);
    }

    warn(...messages: any[]): void {
        this.logger.warn(messages);
    }

    error(...messages: any[]): void {
        this.logger.error(messages);
    }

    fatal(...messages: any[]): void {
        this.logger.fatal(messages);
    }

    isEnabledFor(level: Level, exception: Error): boolean {
        return this.logger.isEnabledFor(level, exception);
    }

    isTraceEnabled(): boolean {
        return this.logger.isTraceEnabled();
    }

    isDebugEnabled(): boolean {
        return this.logger.isDebugEnabled();
    }

    isInfoEnabled(): boolean {
        return this.logger.isInfoEnabled();
    }

    isWarnEnabled(): boolean {
        return this.logger.isWarnEnabled();
    }

    isErrorEnabled(): boolean {
        return this.logger.isErrorEnabled();
    }

    isFatalEnabled(): boolean {
        return this.logger.isFatalEnabled();
    }

    group(name: string, initiallyExpanded?: boolean): void {
        this.logger.group(name, initiallyExpanded);
    }

    groupEnd(): void {
        this.logger.groupEnd();
    }

    time(name: string, level?: Level): void {
        this.logger.time(name, level);
    }

    timeEnd(name: string): void {
        this.logger.timeEnd(name);
    }

    assert(expr: any): void {
        this.logger.assert(expr);
    }
}
