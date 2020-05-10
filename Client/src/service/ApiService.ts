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
    }
}

export default ApiService;