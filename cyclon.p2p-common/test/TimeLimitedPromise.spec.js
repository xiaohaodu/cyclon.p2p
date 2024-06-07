const {timeLimitedPromise, TimeoutError} = require('../lib/TimeLimitedPromise');

describe('the time limited promise', () => {

    describe('when the action completes in time', () => {

        let successHandler = jasmine.createSpy('success');
        let failureHandler = jasmine.createSpy('failure');
        let cleanupFunction = jasmine.createSpy('cleanup');

        beforeEach((done) => {
            const promise = new Promise((resolve) => {
                setTimeout(() => resolve("yeah!"), 10);
            });
            timeLimitedPromise(promise, 1000)
                .then(successHandler)
                .catch(failureHandler)
                .finally(done);
        });

        it('will resolve', () => {
            expect(successHandler).toHaveBeenCalledWith('yeah!');
        });

        it('will not call the failure handler', () => {
           expect(failureHandler).not.toHaveBeenCalled();
        });

        it('will not call the cleanup function', () => {
            expect(cleanupFunction).not.toHaveBeenCalled();
        });
    });

    describe('when the action times out', () => {

        let successHandler = jasmine.createSpy('success');
        let failureHandler = jasmine.createSpy('failure');
        const MESSAGE = "The thing timed out";

        beforeEach((done) => {
            failureHandler.calls.reset();
            successHandler.calls.reset();
            const promise = new Promise((resolve) => {
                setTimeout(() => resolve("nah!"), 1000);
            });

            timeLimitedPromise(promise, 10, MESSAGE)
                .then(successHandler)
                .catch(failureHandler)
                .finally(done);
        });

        it('will not resolve', () => {
            expect(successHandler).not.toHaveBeenCalled();
        });

        it('will call the failure handler', () => {
            expect(failureHandler).toHaveBeenCalledWith(new TimeoutError(MESSAGE));
        });

        it('will throw errors of a specific type', () => {
            expect(failureHandler.calls.mostRecent().args[0] instanceof TimeoutError).toEqual(true);
        });
    });
});