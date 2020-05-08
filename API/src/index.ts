import express from 'express';
import Commands from './commands';
import bodyParser from 'body-parser';
import Pin from './Pin';


const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.post("/sleep", (req, res, next) => {
    Commands.startSleep()
        .then((response: any) => {
            res.json({success: true})
        })
        .catch((reason: any) => {
            console.log(reason);
            res.json({success: false})
        })
});

app.post("/setSchedule", (req, res, next) => {
    const schedule = req.body.schedule;
    if(!schedule) {
        res.json({success: false});
        return;
    }

    Commands.setAlarmSchedule('* * * * *');
    res.json({success: true});
})

app.post("/setBrightness", (req, res, next) => {
    const colour = req.body.colour;
    const value = req.body.value;

    let selectedPin: any;

    console.log(colour)
    console.log(value)

    switch (colour){
        case "ww":
            selectedPin = Pin.WARM_WHITE;
            break;
        case "cw":
            selectedPin = Pin.COOL_WHITE;
            break;
        default:
            res.json({success: false});
            return;
    }

    Commands.setPinValue(selectedPin, value)
        .then((res: any) => {
            res.json({success: true});
        })
        .catch((reason: any) => {
            res.json({success: false});
        });
        
})