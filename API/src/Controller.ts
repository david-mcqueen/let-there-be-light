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

    private scheduledTaskWeekday: cron.ScheduledTask | undefined;
    private scheduledTaskWeekday_time: string = "";
    private scheduledTaskWeekend: cron.ScheduledTask | undefined;
    private scheduledTaskWeekend_time: string = "";
    private isSleeping: boolean = false;
    
    public getStatus = () => {

        return {
            ww: this.warmChannel.currentValuePct,
            cw: this.coolChannel.currentValuePct,
            weekendSchedule: this.scheduledTaskWeekend_time,
            weekdaySchedule: this.scheduledTaskWeekday_time,
            isSleeping: this.isSleeping,
            version: "0.1.1"
        }
    }

    public setPinValue = (pin: Pin, pct: number): Promise<any>  => {
        return this.getChannel(pin).setValuePct(pct);
    }

    public startSleep = () => {
        return this.sleep();
    }

    public stopSleep = () => {
        this.isSleeping = false;
    }

    public setAlarmSchedule = (time: string, part: string) => {

        const datePart = part === "WEEKEND" ? "6-7" : "1-5";

        const timeParts = time.split(":");
        let cronExpression = `* ${timeParts[1]} ${timeParts[0]} * * ${datePart}`;

        const newSchedule = cron.schedule(cronExpression, () => {
            this.wakeUp()
                .then(() => {
                    console.log(`wakeUp complete`);
                })
                .catch(() => {
                    console.log(`failed to wakeUp`);
                })
        });

        if (part === "WEEKEND"){
            if(this.scheduledTaskWeekend){
                this.scheduledTaskWeekend.stop();
                this.scheduledTaskWeekend.destroy();
            }

            this.scheduledTaskWeekend = newSchedule;
            this.scheduledTaskWeekend.start();
            this.scheduledTaskWeekend_time = time;
            
        }else if (part === "WEEKDAY") {
            if(this.scheduledTaskWeekday){
                this.scheduledTaskWeekday.stop();
                this.scheduledTaskWeekday.destroy();
            }

            this.scheduledTaskWeekday = newSchedule;
            this.scheduledTaskWeekday.start();  
            this.scheduledTaskWeekday_time = time;
        }
    }

    public getWaitTimeMs(maxValue: number, durationMins: number = 30): number {
        const sec = durationMins * 60;
        const epochDelay = sec / maxValue;

        // console.log(`epochDelay: ${epochDelay}`);

        return Math.round(epochDelay * 1000);
    }

    private async wakeUp() {
        // console.log("wakeUp");

        const epochDelay = this.getWaitTimeMs(this.warmChannel.MaxValue);

        const intervalObj = setInterval(() => {

            if (this.warmChannel.currentValue >= this.warmChannel.MaxValue 
                && this.coolChannel.currentValue >= this.coolChannel.MaxValue){
                clearInterval(intervalObj);
            }

            // Warm Channel
            if (this.warmChannel.currentValue < this.warmChannel.MaxValue){
                this.warmChannel.incrementBrightness();
            }

            // Cool Channel
            if (this.coolChannel.currentValue < this.coolChannel.MaxValue){
                if (this.warmChannel.currentValue > (this.warmChannel.currentValue / 2)){
                    // As we start at half way, increment twice so we get to the end at the same point
                    this.coolChannel.incrementBrightness();
                    this.coolChannel.incrementBrightness();
                }
            }

        }, epochDelay);

        // console.log(`done`)
    }

    // Turns off the lights over a space of 30 mins
    private async sleep() {
        if (this.isSleeping){
            return;
        }

        this.isSleeping = true;

        const mins = 30;
        const sec = mins * 60;
        
        // We don't want the white light on at all during sleep mode
        this.coolChannel.setValue(0);
        
        // To get from the current value to 0 over 30 mins
        const epochDelay = sec / this.warmChannel.MaxValue;

        console.log(`epochDelay: ${epochDelay}`);

        const wait = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

        while (this.warmChannel.currentValue > 0 && this.isSleeping){
            this.warmChannel.decrementBrightness();
            await wait(epochDelay);
        }

        this.isSleeping = false;

        console.log(`done`);
    }
}

export default Controller;