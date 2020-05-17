"use strict";

import exec from 'child_process';
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
            exec.exec('python ./Scripts/light-on.py', (err: any, stdout: any, stderr: any) => {
                if (err) {
                    console.log("something went wrong");
                    console.log(err);
                }else {
                    console.log(stderr);
                    console.log(stdout);
                }
            })
        });

        this.scheduledTask.start();
    }

    // Turns on the lights over a space of 30 mins
    private wakeUp() {

    }

    // Turns off the lights over a space of 30 mins
    private async sleep() {
        const mins = 30;
        const sec = mins * 60;
        
        // To get from the current value to 0 over 30 mins
        const epochDelay = sec / this.warmChannel.currentValue;

        // We don't want the white light on at all during sleep mode
        this.coolChannel.setValue(0);

        const wait = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

        while (this.warmChannel.currentValue > 0){
            this.warmChannel.decrementBrightness();
            await wait(epochDelay);
        }
    }
}


  export default Controller;