"use strict";

import express from 'express';
import cors from 'cors';
import Controller from './Controller';
import bodyParser from 'body-parser';
import Pin from './Pin';


const app = express();
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/test", (req, res, next) => {
    res.json({success: true});
})

app.get("/status", (req, res, next) => {
    res.json(Controller.instance.getStatus());
})

app.post("/sleep", (req, res, next) => {
    Controller.instance.startSleep()
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
    const part = req.body.part;

    if(!schedule || !part) {
        res.json({success: false});
        return;
    }

    try {
        Controller.instance.setAlarmSchedule(schedule, part);
        res.json({success: true});
    }
    catch(e) {
        console.log(e);
        res.json({success: false});
    }
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

    Controller.instance.setPinValue(selectedPin, value)
        .then((response: any) => {
            console.log("success");
            res.json({success: true});
        })
        .catch((reason: any) => {
            console.log(reason)
            res.json({success: false});
        });
        
})