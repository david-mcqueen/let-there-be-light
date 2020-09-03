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

describe('Test Controller', () => {

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

        controller.setPinValue(Pin.COOL_WHITE, 10)
        const status: IStatus = controller.getStatus();
        expect(status.cw).toBe(25);
    });
});