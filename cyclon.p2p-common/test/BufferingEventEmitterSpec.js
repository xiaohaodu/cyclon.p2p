'use strict';

const { BufferingEventEmitter } = require("../lib/BufferingEventEmitter");
const EVENT_TYPE = 'somethingHappened';

describe("BufferingEventEmitter", () => {

    describe(".on('event', handler)", () => {

        it("emits events to listeners", (done) => {
            let emitter = new BufferingEventEmitter();
            emitter.on(EVENT_TYPE, done);
            emitter.emit(EVENT_TYPE);
        });

        it("passes through event payloads", (done) => {
            let emitter = new BufferingEventEmitter();
            emitter.on(EVENT_TYPE, (first, second, third) => {
                expect(first).toEqual('aaa');
                expect(second).toEqual('bbb');
                expect(third).toEqual('ccc');
                done();
            });
            emitter.emit(EVENT_TYPE, 'aaa', 'bbb', 'ccc');
        });

        it("keeps emitting events", () => {
            let counter = 0;
            let emitter = new BufferingEventEmitter();
            emitter.on(EVENT_TYPE, () => {
                counter++;
            });
            emitter.emit(EVENT_TYPE);
            emitter.emit(EVENT_TYPE);
            expect(counter).toEqual(2);
        });

        it("buffers events received before handler is added", (done) => {
            let emitter = new BufferingEventEmitter();
            emitter.emit(EVENT_TYPE, 'aaa', 'bbb', 'ccc');
            emitter.on(EVENT_TYPE, (first, second, third) => {
                expect(first).toEqual('aaa');
                expect(second).toEqual('bbb');
                expect(third).toEqual('ccc');
                done();
            });
        });
    });


    describe(".once('event', handler)", () => {

        it("emits events to listeners", (done) => {
            let emitter = new BufferingEventEmitter();
            emitter.once(EVENT_TYPE, done);
            emitter.emit(EVENT_TYPE);
        });

        it("passes through event payloads", (done) => {
            let emitter = new BufferingEventEmitter();
            emitter.once(EVENT_TYPE, (first, second, third) => {
                expect(first).toEqual('aaa');
                expect(second).toEqual('bbb');
                expect(third).toEqual('ccc');
                done();
            });
            emitter.emit(EVENT_TYPE, 'aaa', 'bbb', 'ccc');
        });

        it("only emits the first event", () => {
            let counter = 0;
            let emitter = new BufferingEventEmitter();
            emitter.once(EVENT_TYPE, () => {
                counter++;
            });
            emitter.emit(EVENT_TYPE);
            emitter.emit(EVENT_TYPE);
            expect(counter).toEqual(1);
        });

        it("buffers events received before handler is added", (done) => {
            let emitter = new BufferingEventEmitter();
            emitter.emit(EVENT_TYPE, 'aaa', 'bbb', 'ccc');
            emitter.once(EVENT_TYPE, (first, second, third) => {
                expect(first).toEqual('aaa');
                expect(second).toEqual('bbb');
                expect(third).toEqual('ccc');
                done();
            });
        });
    });

    describe("the event buffer", () => {

        it("is limited in size, will expire oldest", () => {
            let emitter = new BufferingEventEmitter(console, 2);
            emitter.emit(EVENT_TYPE, 'first');
            emitter.emit(EVENT_TYPE, 'second');
            emitter.emit(EVENT_TYPE, 'third');
            const received = [];
            emitter.on(EVENT_TYPE, (val) => received.push(val));
            expect(received).toEqual(['second', 'third']);
        });
    });

    describe("listener removal", () => {

        let emitter;
        let somethingHappenedCounter;
        let otherSomethingHappenedCounter;
        let somethingHappenedCallback = () => {
            somethingHappenedCounter++;
        };
        let otherSomethingHappenedCallback = () => {
            otherSomethingHappenedCounter++;
        };

        beforeEach(() => {
            emitter = new BufferingEventEmitter();
            somethingHappenedCounter = 0;
            otherSomethingHappenedCounter = 0;
        });

        it("can remove a single listener", () => {
            emitter.on(EVENT_TYPE, somethingHappenedCallback);
            emitter.on(EVENT_TYPE, otherSomethingHappenedCallback);
            emitter.emit(EVENT_TYPE);
            emitter.removeListener(EVENT_TYPE, somethingHappenedCallback);
            emitter.emit(EVENT_TYPE);
            expect(somethingHappenedCounter).toEqual(1);
            expect(otherSomethingHappenedCounter).toEqual(2);
        });

        it("can remove all listeners", () => {
            emitter.on(EVENT_TYPE, somethingHappenedCallback);
            emitter.on(EVENT_TYPE, otherSomethingHappenedCallback);
            emitter.emit(EVENT_TYPE);
            emitter.removeAllListeners(EVENT_TYPE);
            emitter.emit(EVENT_TYPE);
            expect(somethingHappenedCounter).toEqual(1);
            expect(otherSomethingHappenedCounter).toEqual(1);
        });
    });
});