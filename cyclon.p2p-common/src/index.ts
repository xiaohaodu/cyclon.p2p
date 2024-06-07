'use strict';

import { AsyncExecService } from "./AsyncExecService";
import { InMemoryStorage } from "./InMemoryStorage";
import { Logger } from "./Logger";
import { ConsoleLogger } from "./ConsoleLogger";
import { GuidGenerator } from "./GuidGenerator";
import { ObfuscatingStorageWrapper } from "./ObfuscatingStorageWrapper";
import { UnreachableError } from "./UnreachableError";
import { BufferingEventEmitter } from "./BufferingEventEmitter";
import { timeLimitedPromise, TimeoutError } from './TimeLimitedPromise';

/**
 * Extract a random sample from an array of items using reservoir sampling
 */
export function randomSample(inputArray: any[], sampleSize: number) {
    const resultSet = [];

    for (let i = 0; i < inputArray.length; i++) {
        if (resultSet.length < sampleSize) {
            resultSet.push(inputArray[i]);
        }
        else {
            let insertAt = Math.floor(Math.random() * (i + 1));
            if (insertAt < resultSet.length) {
                resultSet[insertAt] = inputArray[i];
            }
        }
    }

    return resultSet;
}

/**
 * Convenience for checking the number of arguments to a function
 */
export function checkArguments(argumentsArray: IArguments, expectedCount: number) {
    if (argumentsArray.length !== expectedCount) {
        throw new Error("Invalid number of arguments provided for function! (expected " + expectedCount + ", got " + argumentsArray.length + ")");
    }
}

/**
 * Get the singleton console logger instance
 */
let loggerInstance: ConsoleLogger | null = null;
export function consoleLogger(): ConsoleLogger {
    if (loggerInstance === null) {
        loggerInstance = new ConsoleLogger();
    }
    return loggerInstance;
}

/**
 * Factory method for instances of the in-memory DOM storage API implementation
 */
export function newInMemoryStorage(): InMemoryStorage {
    return new InMemoryStorage();
}

/**
 * Get the singleton AsyncExecService instance
 */
let asyncExecServiceInstance: AsyncExecService | null = null;
export function asyncExecService(): AsyncExecService {
    if (asyncExecServiceInstance === null) {
        asyncExecServiceInstance = new AsyncExecService();
    }
    return asyncExecServiceInstance;
}

/**
 * Return the DOM storage object wrapped in an obfuscating decorator
 */
export function obfuscateStorage(storage: Storage): Storage {
    return new ObfuscatingStorageWrapper(storage);
}

/**
 * Shuffle an array in place
 * 
 * http://jsfromhell.com/array/shuffle [v1.0]
 */
export function shuffleArray(inputArray: any[]) {
    //noinspection StatementWithEmptyBodyJS
    for (let j:any, x:any, i:number = inputArray.length; 
        i; 
        j = Math.floor(Math.random() * i), 
        x = inputArray[--i], inputArray[i] = inputArray[j], inputArray[j] = x) {
    }
    return inputArray;
}

export { Logger, AsyncExecService, GuidGenerator as generateGuid, UnreachableError, BufferingEventEmitter, timeLimitedPromise, TimeoutError }