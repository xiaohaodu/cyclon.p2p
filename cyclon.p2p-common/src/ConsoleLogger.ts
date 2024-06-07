/**
 * Configurable console logger, default level is INFO
 */
import {Logger} from "./Logger";

export class ConsoleLogger implements Logger {

    private level: LoggerLevel = LoggerLevel.INFO;

    error(...args:any) {
        if (this.loggingLevel(LoggerLevel.ERROR)) {
            console.error.apply(this, args);
        }
    }

    warn(...args:any) {
        if (this.loggingLevel(LoggerLevel.WARN)) {
            console.warn.apply(this, args);
        }
    }

    info(...args:any) {
        if (this.loggingLevel(LoggerLevel.INFO)) {
            console.info.apply(this, args);
        }
    }

    log(...args:any) {
        if (this.loggingLevel(LoggerLevel.INFO)) {
            console.log.apply(this, args);
        }
    }

    debug(...args:any) {
        if (this.loggingLevel(LoggerLevel.DEBUG)) {
            console.log.apply(this, args);
        }
    }

    setLevelToInfo() {
        this.setLevel(LoggerLevel.INFO);
    }

    setLevelToDebug() {
        this.setLevel(LoggerLevel.DEBUG);
    }

    setLevelToWarning() {
        this.setLevel(LoggerLevel.WARN);
    }

    setLevelToError() {
        this.setLevel(LoggerLevel.ERROR);
    }

    setLevel(newLevel: LoggerLevel) {
        this.level = newLevel;
    }

    loggingLevel(logLevel: LoggerLevel) {
        return logLevel >= this.level;
    }
}

enum LoggerLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}
