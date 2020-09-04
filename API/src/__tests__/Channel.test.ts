import { inversifyConfig } from '../inversify.config';
import MockChannel from "../__mocks__/MockChannel";
import { interfaces } from 'inversify';
import IChannel from '../interfaces/IChannel';
import { TYPES } from '../types';
import Pin from '../Pin';

jest.mock('node-cron', () => {
    return {
      schedule: jest.fn(),
    };
  });

  describe('Test Decrement', () => {
    let channelConstructor: interfaces.Newable<IChannel>;
    let chnl: IChannel;

    beforeAll(() => {
        process.env.NODE_ENV="test";
        channelConstructor = inversifyConfig.get<interfaces.Newable<IChannel>>(TYPES.IChannel);
    });

    beforeEach(() => {
        chnl = new channelConstructor(Pin.WARM_WHITE);
    })

      test('can decrement brightness', () =>{

        chnl.setValue(chnl.MaxValue);
        const setValueSpy = jest.spyOn(chnl, 'setValue');
        chnl.decrementBrightness();

        expect(setValueSpy).toHaveBeenCalledTimes(1);
        expect(chnl.currentValue).toBe(chnl.MaxValue - 1);
      })

      test(`can't decremenet below 0`, () => {
        chnl.setValue(0);
        const setValueSpy = jest.spyOn(chnl, 'setValue');
        chnl.decrementBrightness();

        expect(setValueSpy).toHaveBeenCalledTimes(0);
        expect(chnl.currentValue).toBe(0);
      })
  })

  describe('Test Increment', () => {
    let channelConstructor: interfaces.Newable<IChannel>;
    let chnl: IChannel;

    beforeAll(() => {
        process.env.NODE_ENV="test";
        channelConstructor = inversifyConfig.get<interfaces.Newable<IChannel>>(TYPES.IChannel);
    });

    beforeEach(() => {
        chnl = new channelConstructor(Pin.WARM_WHITE);
    })

    test('can increment brightness', () =>{

        chnl.setValue(0);
        const setValueSpy = jest.spyOn(chnl, 'setValue');
        chnl.incrementBrightness();

        expect(setValueSpy).toHaveBeenCalledTimes(1);
        expect(chnl.currentValue).toBe(1);
    })

    test(`can't increment past MaxValue`, () => {
        chnl.setValue(chnl.MaxValue);
        const setValueSpy = jest.spyOn(chnl, 'setValue');
        chnl.incrementBrightness();

        expect(setValueSpy).toHaveBeenCalledTimes(0);
        expect(chnl.currentValue).toBe(chnl.MaxValue);
    })
})