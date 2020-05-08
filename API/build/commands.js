"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = __importDefault(require("child_process"));
var node_cron_1 = __importDefault(require("node-cron"));
var Commands = /** @class */ (function () {
    function Commands() {
    }
    Commands.startSleep = function () {
        return Commands.consoleCommand("python ./lamp-sleep.py");
    };
    Commands.setPinValue = function (pin, pct) {
        var maxValue = 255;
        var value = Math.floor(maxValue * (pct / 100));
        return Commands.consoleCommand("pigs p " + pin + " " + value);
    };
    Commands.setAlarmSchedule = function (cronExpression) {
        if (Commands.scheduledTask) {
            Commands.scheduledTask.stop();
            Commands.scheduledTask.destroy();
        }
        Commands.scheduledTask = node_cron_1.default.schedule(cronExpression, function () {
            child_process_1.default.exec('python ./lamp-on.py', function (err, stdout, stderr) {
                if (err) {
                    console.log("something went wrong");
                    console.log(err);
                }
                else {
                    console.log(stderr);
                    console.log(stdout);
                }
            });
        });
        Commands.scheduledTask.start();
    };
    Commands.consoleCommand = function (command) {
        return new Promise(function (resolve, reject) {
            child_process_1.default.exec(command, function (err, stdout, stderr) {
                if (err) {
                    reject("something went wrong");
                    console.log(err);
                }
                else {
                    console.log(stderr);
                    console.log(stdout);
                }
            });
        });
    };
    return Commands;
}());
exports.default = Commands;
