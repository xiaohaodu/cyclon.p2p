/**
 * So we can test the set/clear Timeout/Intervals
 */
export class AsyncExecService {

    /**
     * Set a timeout
     */
    setTimeout(callback: Function, timeout: number): number {
        return setTimeout(callback, timeout);
    }

    /**
     * Set an interval
     */
    setInterval(callback: Function, interval: number): number {
        return setInterval(callback, interval);
    }

    /**
     * Clear a timeout
     */
    clearTimeout(timeoutId: number): void {
        clearTimeout(timeoutId);
    }

    /**
     * Clear an interval
     */
    clearInterval(intervalId: number): void {
        clearInterval(intervalId);
    }
}
