"use strict";

import exec from 'child_process';
import Pin from './Pin';
import cron from 'node-cron';

class Controller {

    private static _controller: Controller;
    
    public static get instance(): Controller {

        if (!this._controller) {
            this._controller = new Controller();
        }

        return this._controller;
    }

    private constructor(){ }

    private scheduledTask: cron.ScheduledTask | undefined;
    
    public startSleep = () => {
        return this.consoleCommand(`python ./Scripts/light-off.py`)
    }

    public setPinValue = (pin: Pin, pct: number) => {
        const maxValue: number = 255;
        const value = Math.floor(maxValue * (pct / 100));
        
        return this.consoleCommand(`pigs p ${pin} ${value}`);
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

    private consoleCommand = (command: string) : Promise<any> => {

        return new Promise<any>((resolve: any, reject: any) => {
            exec.exec(command, (err: any, stdout: any, stderr: any) => {
                if (err) {
                    reject("something went wrong");
                    console.log(err)
                }else {
                    console.log(stderr)
                    console.log(stdout)
                    resolve();
                }
            })

        });
    };
}


  export default Controller;