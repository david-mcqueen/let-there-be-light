import Controller from '../Controller';
import Pin from '../Pin';
import { stat } from 'fs';
import IStatus from '../interfaces/IStatus';
import { inversifyConfig } from '../inversify.config';
import IChannel from '../interfaces/IChannel';
import { TYPES } from '../types';
import { Container } from 'inversify';

jest.mock('node-cron', () => {
    return {
      schedule: jest.fn(),
    };
  });

describe('Test getWaitTimeMs', () => {

    // Test that the correct wait is returned for a given value
    test.each`

    maxValue        |   duration        |   expected
    ${255}          |   ${30}           |   ${7059}
    ${200}          |   ${30}           |   ${9000}
    ${100}          |   ${30}           |   ${18000}
    ${50}           |   ${30}           |   ${36000}
    ${10}           |   ${30}           |   ${180000}
    ${255}          |   ${15}           |   ${3529}
    ${200}          |   ${15}           |   ${4500}
    ${100}          |   ${15}           |   ${9000}
    ${10}           |   ${15}           |   ${90000}

    `('.getWaitTimeMs($maxValue, $duration) = $expected', ({maxValue, duration, expected}) => {
        const controller = Controller.instance;
        
        const waitTimeMs = controller.getWaitTimeMs(maxValue, duration);
        expect(waitTimeMs).toBe(expected);
    })
})

describe('Test IoC channels', () => {

    beforeAll(() => {
        process.env.NODE_ENV="test";
    });

    test('it has multiple instaces of the class', () => {
        const controller =  Controller.instance;

        controller.setPinValuePct(Pin.COOL_WHITE, 10)
        const status: IStatus = controller.getStatus();
        expect(status.cw).toBe(10);
    });
});


describe('Test sleep & Wake', () => {

    jest.useFakeTimers();

    let cnt: Controller;
    let cwSpy: jest.SpyInstance<Promise<any>, [Number]>;
    let wwSpy: jest.SpyInstance<void, []>;

    beforeAll(() => {
        process.env.NODE_ENV="test";
        cnt = Controller.instance;
    })

    beforeEach(() => {
        cwSpy = jest.spyOn(cnt.getChannel(Pin.COOL_WHITE), 'setValue' );
        wwSpy = jest.spyOn(cnt.getChannel(Pin.WARM_WHITE), 'decrementBrightness' );
    })

    afterEach(() => {
        jest.clearAllMocks();
        cwSpy.mockClear();
        wwSpy.mockClear();
    })

    test('sleep from max value', () => {
        cnt.setPinValuePct(Pin.COOL_WHITE, 100);
        cnt.setPinValuePct(Pin.WARM_WHITE, 100);

        cwSpy.mockClear();

        const pendingPromise = cnt.startSleep()
            .then(resolved => {
                expect(wwSpy).toHaveBeenCalledTimes(cnt.getChannel(Pin.WARM_WHITE).MaxValue);
                expect(cwSpy).toHaveBeenCalledTimes(1);
            })

        jest.runAllTimers();
        
        return pendingPromise;
    })

    test('sleep from mid value', () => {
        cnt.setPinValuePct(Pin.COOL_WHITE, 50);
        cnt.setPinValuePct(Pin.WARM_WHITE, 50);

        cwSpy.mockClear();

        const pendingPromise = cnt.startSleep()
            .then(resolved => {
                expect(wwSpy).toHaveBeenCalledTimes(cnt.getChannel(Pin.WARM_WHITE).MaxValue / 2);
                expect(setInterval).toHaveBeenCalledTimes(1);
                expect(cwSpy).toHaveBeenCalledTimes(1);
            })

        jest.runAllTimers();
        
        return pendingPromise;
    })

    test('wake from no value', () => {
        const cwSpy = jest.spyOn(cnt.getChannel(Pin.COOL_WHITE), 'incrementBrightness' );
        const wwSpy = jest.spyOn(cnt.getChannel(Pin.WARM_WHITE), 'incrementBrightness' );

        cnt.setPinValuePct(Pin.COOL_WHITE, 0);
        cnt.setPinValuePct(Pin.WARM_WHITE, 0);

        const pendingPromise = cnt.wakeUp()
            .then(resolved => {
                expect(wwSpy).toHaveBeenCalledTimes(cnt.getChannel(Pin.WARM_WHITE).MaxValue);
                expect(cwSpy).toHaveBeenCalledTimes(cnt.getChannel(Pin.COOL_WHITE).MaxValue);
            })

        jest.runAllTimers();
        
        return pendingPromise;
    })

})