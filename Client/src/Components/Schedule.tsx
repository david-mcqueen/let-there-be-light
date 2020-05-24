import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import TimePicker from 'react-time-picker'

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import ApiService from '../service/ApiService';

function Schedule() {

    const weekpart = {
        WEEKDAY: "WEEKDAY",
        WEEKEND: "WEEKEND"
    }

    const api = new ApiService();

    useEffect(() => {
        api.getStatus()
            .then((resp: { ww: number, cw: number, weekendSchedule: string, weekdaySchedule: string }) => {
                setWeekendSchedule(weekendSchedule);
                setWeekdaySchedule(weekdaySchedule);
            })
    }, [])

    const [weekdaySchedule, setWeekdaySchedule] = useState('');
    const [weekendSchedule, setWeekendSchedule] = useState('');

    const setAlarmSchedules = () => {

        const weekdayParts = weekdaySchedule.split(":");
        const weekendParts = weekendSchedule.split(":");

        api.setSchedule(`* ${weekdayParts[1]} ${weekdayParts[0]} * * 1-5`, weekpart.WEEKDAY);
        api.setSchedule(`* ${weekendParts[1]} ${weekendParts[0]} * * 6-7`, weekpart.WEEKEND);
    }

    const setScheduleFromPicker = (datetimeValue: string, part: string) => {
        if(part === weekpart.WEEKDAY){
            setWeekdaySchedule(datetimeValue);
        }else if (part === weekpart.WEEKEND){
            setWeekendSchedule(datetimeValue);
        }
    }


    return (
        <div className="slider">
            <Card>
                <Card.Header as="h5">Schedule</Card.Header>
                <Card.Body>
                    <Card.Title>Weekday</Card.Title>
                    <Card.Text>
                    <InputGroup className="mb-3">
                        <TimePicker value={weekdaySchedule} onChange={(value: any) => setScheduleFromPicker(value, weekpart.WEEKDAY)}/>
                    </InputGroup>
                    </Card.Text>

                    <Card.Title>Weekend</Card.Title>
                    <Card.Text>
                    <InputGroup className="mb-3">
                        <TimePicker value={weekendSchedule} onChange={(value: any) => setScheduleFromPicker(value, weekpart.WEEKEND)}/>
                    </InputGroup>
                    </Card.Text>
                            <Button variant="outline-secondary" onClick={() => setAlarmSchedules()}>Set</Button>
                </Card.Body>
                </Card>
        </div>
    )

}


export default Schedule;