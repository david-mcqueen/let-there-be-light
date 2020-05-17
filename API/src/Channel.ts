import Pin from "./Pin";
import exec from 'child_process';

class Channel {
    private _pin: Pin;
    private _currentValue: number; // The current set value of the channel

    public set currentValue(val: number) {
        this._currentValue = val;
    }

    public get currentValue() : number {
        return this._currentValue;
    }

    constructor(pin: Pin) {
        this._pin = pin;
        this._currentValue = 0;
    }

    public incrementBrightness() {
        if(this.currentValue < 255){
            this.setValue(this.currentValue + 1);
        }
    }

    public decrementBrightness() {
        if (this.currentValue > 0){
            this.setValue(this.currentValue - 1);
        }
    }

    public setValuePct(pct: number) {
        const maxValue: number = 255;
        const value = Math.floor(maxValue * (pct / 100));
        
        this.setValue(value);
    }

    public setValue(val: number) {
        this.currentValue = val;
        return this.consoleCommand(`pigs p ${this._pin} ${val}`);
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


export default Channel;