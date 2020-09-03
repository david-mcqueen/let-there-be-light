import { injectable, inject, Container, interfaces } from 'inversify';
import "reflect-metadata";
import { TYPES } from './types';
import Pin from './Pin';
import cron from 'node-cron';
import Channel from './Channel';
import { inversifyConfig } from './inversify.config';
import IStatus from './interfaces/IStatus';
import IChannel from './interfaces/IChannel';

class Controller {

    private static _controller: Controller;
    private readonly coolChannel: IChannel;
    private readonly warmChannel: IChannel;
    
    public static get instance(): Controller {

        if (!this._controller) {
            this._controller = new Controller(inversifyConfig);
        }

        return this._controller;
    }

    private constructor(container: Container){ 
        
        const channelConstructor = container.get<interfaces.Newable<IChannel>>(TYPES.IChannel)

        this.warmChannel = new channelConstructor(Pin.WARM_WHITE);
        this.coolChannel = new channelConstructor(Pin.COOL_WHITE);
    }

    private getChannel(pin: Pin): IChannel {
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
    private isWaking: boolean = false;
    
    public getStatus = (): IStatus => {

        return {
            ww: this.warmChannel.currentValuePct,
            cw: this.coolChannel.currentValuePct,
            weekendSchedule: this.scheduledTaskWeekend_time,
            weekdaySchedule: this.scheduledTaskWeekday_time,
            isSleeping: this.isSleeping,
            isWaking: this.isWaking,
            version: "0.1.1"
        }
    }

    public setPinValuePct = (pin: Pin, pct: number): Promise<any>  => {
        const pinChannel = this.getChannel(pin)
        return pinChannel.setValuePct(pct);
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
        if (this.isWaking){
            return;
        }
        this.isWaking = true;
        
        // console.log("wakeUp");

        const epochDelay = this.getWaitTimeMs(this.warmChannel.MaxValue);

        const intervalObj = setInterval(() => {

            if (this.warmChannel.currentValue >= this.warmChannel.MaxValue 
                && this.coolChannel.currentValue >= this.coolChannel.MaxValue){
                
                    this.isWaking = false;
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

        const epochDelay = this.getWaitTimeMs(this.warmChannel.MaxValue)

        // We don't want the white light on at all during sleep mode
        this.coolChannel.setValue(0);

        const intervalObj = setInterval(() => {

            if (this.warmChannel.currentValue >= this.warmChannel.MaxValue){
                this.isSleeping = false;
                // console.log(`[]`);
                clearInterval(intervalObj);
            }

            if (this.warmChannel.currentValue > 0){
                this.warmChannel.decrementBrightness();
            }
        }, epochDelay);
    }
}

export default Controller;