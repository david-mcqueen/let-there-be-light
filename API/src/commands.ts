"use strict";

import exec from 'child_process';
import Pin from './Pin';
import cron from 'node-cron';

class Commands {

    private static scheduledTask: cron.ScheduledTask;
    
    public static startSleep = () => {
        return Commands.consoleCommand(`python ./Scripts/light-off.py`)
    }

    public static setPinValue = (pin: Pin, pct: number) => {
        const maxValue: number = 255;
        const value = Math.floor(maxValue * (pct / 100));
        
        return Commands.consoleCommand(`pigs p ${pin} ${value}`);
    }

    public static setAlarmSchedule = (cronExpression: string) => {
        if(Commands.scheduledTask){
            Commands.scheduledTask.stop();
            Commands.scheduledTask.destroy();
        }

        Commands.scheduledTask = cron.schedule(cronExpression, () => {
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

        Commands.scheduledTask.start();
    }

    private static consoleCommand = (command: string) : Promise<any> => {

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


  export default Commands;