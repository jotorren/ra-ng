import {setEnabled, Logger, getLogger, getRootLogger, Level, Layout, Appender } from 'log4javascript';

import { LogLayoutFactory } from './log-layout.factory';
import { LogAppenderFactory } from './log-appender.factory';

interface LoggerConfiguration {
    name: string;
    level?: string;
    layout?: {
        type: string,
        params?: any
    };
    additivity?: boolean;
    appenders?: string[];
}

export class LoggerFactory {
    static configure(conf: any): void {
        setEnabled(false);

        if (conf.hasOwnProperty('log')) {
            LoggerFactory.parseConfiguration(conf['log']);
        }
    }

    static getLogger(name?: string): Logger {
        if (!name || name === 'root') {
            return getRootLogger();
        } else {
            return getLogger(name);
        }
    }

    private static parseConfiguration(confs: LoggerConfiguration[]) {
        for (let conf of confs) {
            let logger: Logger;
            if (conf.name === 'root') {
                logger = getRootLogger();
            } else {
                logger = getLogger(conf.name);
            }

            if (conf.level) {
                logger.setLevel(Level[conf.level]);
            }

            if (conf.hasOwnProperty('additivity')) {
                logger.setAdditivity(conf.additivity);
            }

            let layout: Layout;
            if (conf.layout) {
                layout = LogLayoutFactory.getLayout(conf.layout.type, conf.layout.params);
            }

            if (conf.appenders) {
                for (let name of conf.appenders) {
                    let appender: Appender = LogAppenderFactory.getAppender(name);
                    if (conf.layout) {
                        appender.setLayout(layout);
                    }
                    logger.addAppender(appender);
                }
            }
        }
        setEnabled(true);
    }
}

