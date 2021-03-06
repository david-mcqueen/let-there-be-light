import { toast } from 'react-toastify';

import Pin from "../enums/Pin";
class ApiService {

    private _url: string;

    constructor() {
        const host = window.location.hostname;
        this._url = `http://${host.indexOf('localhost') > -1 ? "192.168.1.121" : host}:3000`
        console.log(this._url);
    }

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

    public stopSleep = () => {
        return fetch(`${this._url}/stopsleep`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }
        })
        .then((value: Response) => {
            toast.success(`success`);
            return value;
        })
        .catch((reason: any) => {
            toast.error('Failed to sleep');
        })
    }

    public setSchedule = (schedule: string, part: string) => {
        
        var data = new URLSearchParams();
        data.append('schedule', schedule);
        data.append('part', part)

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

    public getStatus = (): Promise<{ ww: number, cw: number, weekendSchedule: string, weekdaySchedule: string, isSleeping: boolean }> => {
        return fetch(`${this._url}/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }
        })
        .then((value: Response) => {
            if (!value.ok) {
                throw new Error(value.statusText)
              }
              return value.json()
        })
        .catch((reason: any) => {
            toast.error('Failed to getStatus');
        })
    }
}

export default ApiService;