import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import ApiService from '../service/ApiService';

function Schedule() {

    const api = new ApiService()

    const [schedule, setSchedule] = useState('');

    const setAlarmSchedule = () => {

        api.setSchedule(schedule);
    }


    return (
        <div className="slider">
            <Card>
                <Card.Header as="h5">Schedule</Card.Header>
                <Card.Body>
                    <Card.Title>Set the Alarm time</Card.Title>
                    <Card.Text>
                    <InputGroup className="mb-3">
                        <FormControl aria-describedby="alarm-time" placeholder="CRON expression" value={schedule} onChange={(e) => setSchedule(e.target.value)}/>
                        <InputGroup.Append>
                            <Button variant="outline-secondary" onClick={() => setAlarmSchedule()}>Set</Button>
                        </InputGroup.Append>
                    </InputGroup>
                    </Card.Text>
                </Card.Body>
                </Card>
        </div>
    )

}


export default Schedule;