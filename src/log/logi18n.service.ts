import { TranslateService } from 'ng2-translate/ng2-translate';
import { Logger, Appender, Level } from 'log4javascript';

import { LoggerFactory } from './logger.factory';

export class LogI18nService {
    private logger: Logger;

    constructor(public name: string, private i18n: TranslateService ) {
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

    // start i18n changes
    log(level: Level, key: string |string[], params?: Object): void {
        this.logger.log(level, this.i18n.instant(key, params));
    }

    trace(key: string |string[], params?: Object): void {
        this.logger.trace(this.i18n.instant(key, params));
    }

    debug(key: string |string[], params?: Object): void {
        this.logger.debug(this.i18n.instant(key, params));
    }

    info(key: string |string[], params?: Object): void {
        this.logger.info(this.i18n.instant(key, params));
    }

    warn(key: string |string[], params?: Object): void {
        this.logger.warn(this.i18n.instant(key, params));
    }

    error(key: string |string[], params?: Object): void {
        this.logger.error(this.i18n.instant(key, params));
    }

    fatal(key: string |string[], params?: Object): void {
        this.logger.fatal(this.i18n.instant(key, params));
    }
    // end

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
