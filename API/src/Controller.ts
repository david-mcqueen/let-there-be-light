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
    
    public startSleep = () => {
        return this.consoleCommand(`python ./Scripts/light-off.py`)
    }

    public setPinValue = (pin: Pin, pct: number) => {

        this.getChannel(pin).setValuePct(pct);

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




}


  export default Controller;