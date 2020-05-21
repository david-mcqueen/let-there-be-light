import { toast } from 'react-toastify';

import Pin from "../enums/Pin";
class ApiService {

    private _url = `http://192.168.1.104:3000`

    public sleep = () => {
        return fetch(`${this._url}/sleep`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }
        })
        .then((value: Response) => {
            console.log('success')
            toast.success(`success`);
            return value;
        })
        .catch((reason: any) => {
            toast.error('Failed to sleep');
        })
    }

    public setSchedule = (schedule: string) => {
        var data = new URLSearchParams();
        data.append('schedule', schedule);

        return fetch(`${this._url}/setSchedule`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: data.toString()
        })
        .then((value: Response) => {
            console.log('success')
            toast.success(`success`);
            return value;
        })
        .catch((reason: any) => {
            toast.error(`Failed to setSchedule ${schedule}`);
        })
    }

    public setBrightness = (band: Pin, value: number) => {

        var data = new URLSearchParams();
        data.append('colour', band.toString());
        data.append('value', value.toString());

        return fetch(`${this._url}/setBrightness`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: data.toString()
        })
        .then((value: Response) => {
            console.log('success')
            toast.success(`success`);
            return value;
        })
        .catch((reason: any) => {
            toast.error(`Failed to setBrightness on pin ${band}`);
        })
    }
}

export default ApiService;