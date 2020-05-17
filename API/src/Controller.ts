"use strict";

import Pin from './Pin';
import cron from 'node-cron';
import Channel from './Channel';

class Controller {

    private static _controller: Controller;
    
    public static get instance(): Controller {

        if (!this._controller) {
            this._controller = new Controller();
        }

        return this._controller;
    }

    private constructor(){ 
        this.warmChannel = new Channel(Pin.WARM_WHITE);
        this.coolChannel = new Channel(Pin.COOL_WHITE);
    }

    private readonly coolChannel: Channel;
    private readonly warmChannel: Channel;

    private getChannel(pin: Pin): Channel {
        if (pin === Pin.COOL_WHITE) {
            return this.coolChannel;
        }else {
            return this.warmChannel;
        }
    }

    private scheduledTask: cron.ScheduledTask | undefined;
    

    public setPinValue = (pin: Pin, pct: number) => {
        this.getChannel(pin).setValuePct(pct);
    }

    public startSleep = () => {
        return this.sleep();
    }

    public setAlarmSchedule = (cronExpression: string) => {
        if(this.scheduledTask){
            this.scheduledTask.stop();
            this.scheduledTask.destroy();
        }

        this.scheduledTask = cron.schedule(cronExpression, () => {
            this.wakeUp()
                .then(() => {
                    console.log(`wakeUp complete`);
                })
                .catch(() => {
                    console.log(`failed to wakeUp`);
                })
        });

        this.scheduledTask.start();
    }

    // Turns on the lights over a space of 30 mins
    private async wakeUp() {
        console.log("wakeUp");

        const mins = 30;
        const sec = mins * 60;
        const maxValue = 255;
        const midPoint = maxValue / 2;
        const epochDelay = sec / maxValue;

        console.log(`epochDelay: ${epochDelay}`);

        const wait = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

        while (this.warmChannel.currentValue < maxValue || this.coolChannel.currentValue < maxValue){

            this.warmChannel.incrementBrightness();

            if (this.warmChannel.currentValue > midPoint){
                // As we start at half way, increment twice so we get to the end at the same point
                this.coolChannel.incrementBrightness();
                this.coolChannel.incrementBrightness();
            }

            await wait(epochDelay);
        }

        console.log(`done`)
    }

    // Turns off the lights over a space of 30 mins
    private async sleep() {
        console.log("sleeping")
        const mins = 30;
        const sec = mins * 60;
        
        // To get from the current value to 0 over 30 mins
        const epochDelay = sec / this.warmChannel.currentValue;

        console.log(`epochDelay: ${epochDelay}`);
        // We don't want the white light on at all during sleep mode
        this.coolChannel.setValue(0);

        const wait = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

        while (this.warmChannel.currentValue > 0){
            this.warmChannel.decrementBrightness();
            await wait(epochDelay);
        }

        console.log(`done`);
    }
}


  export default Controller;