import Pin from "../enums/Pin";

class ApiService {

    public setBrightness = (band: Pin, value: number) => {

        var data = new URLSearchParams();
        data.append('colour', band.toString());
        data.append('value', value.toString());

        return fetch('http://192.168.1.104:3000/setBrightness', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
            body: data.toString()
        })
    }
}

export default ApiService;