"use strict";

import express from 'express';
import cors from 'cors';
import Controller from './Controller';
import bodyParser from 'body-parser';
import Pin from './Pin';
import Logger from './Logger';


const app = express();
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(3000, () => {
    Logger.instance.info('[index.js] Server running');
 console.log("Server running on port 3000");
});

app.get("/test", (req, res, next) => {
    res.json({success: true});
})

app.get("/status", (req, res, next) => {
    res.json(Controller.instance.getStatus());
})

app.post("/sleep", (req, res, next) => {
    Logger.instance.info('[index.js] Starting Sleep')
    Controller.instance.startSleep()
        .then((response: any) => {
            Logger.instance.info('[index.js] Finished Sleep')
            res.json({success: true})
        })
        .catch((reason: any) => {
            Logger.instance.info(`[index.js] Failed Sleep: ${reason}`)
            console.log(reason);
            res.json({success: false})
        })
});

app.post("/stopsleep", (req, res, next) => {
    Logger.instance.info('[index.js] Stopping Sleep')
    Controller.instance.stopSleep()
    res.json({success: true})
});

app.post("/setSchedule", (req, res, next) => {
    const schedule = req.body.schedule;
    const part = req.body.part;

    if(!schedule || !part) {
        res.json({success: false});
        return;
    }

    Logger.instance.info(`Setting Schedule. Time: ${schedule}. Part: ${part}`);

    try {
        Controller.instance.setAlarmSchedule(schedule, part);
        res.json({success: true});
    }
    catch(e) {
        Logger.instance.info(`Failed to set schedule. Time: ${schedule}. Part: ${part}. Reason ${e}`);
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

    Controller.instance.setPinValuePct(selectedPin, value)
        .then((response: any) => {
            console.log("success");
            res.json({success: true});
        })
        .catch((reason: any) => {
            console.log(reason)
            res.json({success: false});
        });
        
})