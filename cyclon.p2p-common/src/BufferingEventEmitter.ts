import {EventEmitter} from "events";
import {Logger} from './Logger';

export class BufferingEventEmitter {

    private readonly bufferedEvents: BufferedEvent[];
    private readonly eventEmitter: EventEmitter;
    private readonly logger: Logger;
    private readonly maxBufferSize: number;

    constructor(logger = console, maxBufferSize = 50) {
        this.bufferedEvents = [];
        this.eventEmitter = new EventEmitter();
        this.logger = logger;
        this.maxBufferSize = maxBufferSize;
    }

    once(eventType: string, callback: (...args: any[]) => void): void {
        const unhandledMessage = this.popUnhandledMessage(eventType);
        if (unhandledMessage != null) {
            callback(...unhandledMessage);
        } else {
            this.eventEmitter.once(eventType, callback);
        }
    }

    on(eventType: string, callback: (...args: any[]) => void): void {
        let unhandledMessage;
        while ((unhandledMessage = this.popUnhandledMessage(eventType)) != null) {
            callback(...unhandledMessage);
        }
        this.eventEmitter.on(eventType, callback);
    }

    private popUnhandledMessage(type: string) {
        const index = this.bufferedEvents.findIndex(function (message) {
            return message.type === type
        });
        if (index >= 0) {
            this.logger.debug("Releasing buffered message of type '" + type + "'");
            return this.bufferedEvents.splice(index, 1)[0].payload;
        } else {
            return null;
        }
    }

    emit(eventType: string, ...args: any) {
        if (this.eventEmitter.listenerCount(eventType) === 0) {
            this.logger.debug("No listener registered for '" + eventType + "', buffering");
            this.bufferEvent(eventType, args);
        } else {
            this.eventEmitter.emit(eventType, ...args);
        }
    }

    private bufferEvent(eventType: string, args: any[]) {
        if (this.bufferedEvents.length === this.maxBufferSize) {
            let expiredEvent: BufferedEvent = <BufferedEvent> this.bufferedEvents.shift();
            this.logger.debug(`Buffered event handler overflowing, expiring '${expiredEvent.type}' event`);
        }
        this.bufferedEvents.push({
            type: eventType,
            payload: args
        });
    }

    removeListener(eventType: string, callback: (...args: any[]) => void) {
        this.eventEmitter.removeListener(eventType, callback);
    }

    removeAllListeners(eventType?: string) {
        this.eventEmitter.removeAllListeners(eventType);
    }

    setMaxListeners(maxListeners: number) {
        this.eventEmitter.setMaxListeners(maxListeners);
    }
}

class BufferedEvent {
    type: string;
    payload: any;

    constructor(type: string, payload: any) {
        this.type = type;
        this.payload = payload;
    }
}
