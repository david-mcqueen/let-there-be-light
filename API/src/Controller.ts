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

    public getChannel(pin: Pin): IChannel {
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
            version: "0.2.1"
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

    public async wakeUp(): Promise<void> {
        if (this.isWaking){
            return;
        }
        this.isWaking = true;
        
        // console.log("wakeUp");

        const epochDelay = this.getWaitTimeMs(this.warmChannel.MaxValue);

        const warm = this.warmChannel;
        const cool = this.coolChannel;

        return new Promise<void> ((resolve, reject) => {
            const intervalObj = setInterval(() => {
    
                if (warm.currentValue >= warm.MaxValue 
                    && cool.currentValue >= cool.MaxValue){
                    
                        this.isWaking = false;
                        clearInterval(intervalObj);
                        resolve();
                }

                if (warm.currentValue < warm.MaxValue){
                    warm.incrementBrightness();
                    cool.incrementBrightness();
                }
    
            }, epochDelay);
        });

        // console.log(`done`)
    }

    // Turns off the lights over a space of 30 mins
    private async sleep(): Promise<void> {
        if (this.isSleeping){
            return;
        }

        this.isSleeping = true;

        const epochDelay = this.getWaitTimeMs(this.warmChannel.currentValue)

        // We don't want the white light on at all during sleep mode
        this.coolChannel.setValue(0);

        const warm = this.warmChannel;

        return new Promise<void> ((resolve, reject) => {
            const intervalObj = setInterval(() => {

                if (warm.currentValue <= 0){
                    this.isSleeping = false;
                    // console.log(`[]`);
                    clearInterval(intervalObj);
                    resolve();
                }

                if (warm.currentValue > 0){
                    warm.decrementBrightness();
                }
            }, epochDelay);
        });
    }
}

export default Controller;