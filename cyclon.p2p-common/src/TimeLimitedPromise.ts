export function timeLimitedPromise<T>(action: Promise<T>, timeoutInMilliseconds: number, message?: string): Promise<T> {
    const timeoutWithCleanup = new TimeoutWithCleanup(timeoutInMilliseconds, message);
    return Promise.race([action, timeoutWithCleanup.promise])
        .then((result) => {
            timeoutWithCleanup.cancel();
            return result;
        }).catch((reason: any) => {
            timeoutWithCleanup.cancel();
            return Promise.reject(reason);
        }) as Promise<T>;
}

class TimeoutWithCleanup {

    private cancelled: boolean;
    private timeOut?: any;

    constructor(private readonly timeoutInMilliseconds: number, private readonly message?: string) {
        this.cancelled = false;
    }

    get promise(): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.timeOut = setTimeout(() => {
                clearTimeout(this.timeOut);
                if (!this.cancelled) {
                    reject(new TimeoutError(this.message || `Timed out after ${this.timeoutInMilliseconds} ms`));
                }
            }, this.timeoutInMilliseconds);
        });
    }

    cancel(): void {
        clearTimeout(this.timeOut);
        this.cancelled = true;
    }
}

export class TimeoutError extends Error {

    constructor(message: string) {
        super(message);
    }
}
