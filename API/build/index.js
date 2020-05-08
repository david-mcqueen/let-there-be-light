"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var commands_1 = __importDefault(require("./commands"));
var body_parser_1 = __importDefault(require("body-parser"));
var Pin_1 = __importDefault(require("./Pin"));
var app = express_1.default();
app.use(body_parser_1.default.json()); // support json encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: true })); // support encoded bodies
app.listen(3000, function () {
    console.log("Server running on port 3000");
});
app.post("/sleep", function (req, res, next) {
    commands_1.default.startSleep()
        .then(function (response) {
        res.json({ success: true });
    })
        .catch(function (reason) {
        console.log(reason);
        res.json({ success: false });
    });
});
app.post("/setSchedule", function (req, res, next) {
    var schedule = req.body.schedule;
    if (!schedule) {
        res.json({ success: false });
        return;
    }
    commands_1.default.setAlarmSchedule('* * * * *');
    res.json({ success: true });
});
app.post("/setBrightness", function (req, res, next) {
    var colour = req.body.colour;
    var value = req.body.value;
    var selectedPin;
    console.log(colour);
    console.log(value);
    switch (colour) {
        case "ww":
            selectedPin = Pin_1.default.WARM_WHITE;
            break;
        case "cw":
            selectedPin = Pin_1.default.COOL_WHITE;
            break;
        default:
            res.json({ success: false });
            return;
    }
    commands_1.default.setPinValue(selectedPin, value)
        .then(function (res) {
        res.json({ success: true });
    })
        .catch(function (reason) {
        res.json({ success: false });
    });
});
