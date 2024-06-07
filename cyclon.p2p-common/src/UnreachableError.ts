"use strict";

/**
 * Used to indicate that a node is unreachable
 */
export class UnreachableError extends Error {
    
    readonly name: string;

    constructor(message: string) {
        super(message);
        this.name = "UnreachableError";
    }
}
