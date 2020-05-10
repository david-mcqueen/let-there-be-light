import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function Schedule() {


    return (
        <div className="slider">
            <Card>
                <Card.Header as="h5">Schedule</Card.Header>
                <Card.Body>
                    <Card.Title>Set the Alarm time</Card.Title>
                    <Card.Text>
                    Check box for days of the week
                    Input boxes for time
                    </Card.Text>
                    <Button variant="primary">Set Alarm</Button>
                </Card.Body>
                </Card>
        </div>
    )

}


export default Schedule;