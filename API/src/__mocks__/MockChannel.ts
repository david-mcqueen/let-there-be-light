import { injectable, inject } from 'inversify';
import Pin from "../Pin";
import exec from 'child_process';
import Channel from "../Channel";

@injectable()
class MockChannel extends Channel {

    constructor(pin: Pin) {
        super(pin);
    }

    public setValue(val: number): Promise<any> {
        this.currentValue = val;
        return new Promise<any>((resolve: any, reject: any) => {
            resolve();
        })
    }
}

export default MockChannel;