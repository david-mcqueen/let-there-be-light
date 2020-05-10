import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ApiService from '../service/ApiService';

function Schedule() {

    const api = new ApiService()

    return (
        <div className="slider">
            <Card>
                <Card.Header as="h5">Sleep</Card.Header>
                <Card.Body>
                    <Card.Text>
                    Turn off the lights over 30 minutes
                    </Card.Text>
                    <Button variant="success" block onClick={() => api.sleep()}>Sleep</Button>
                </Card.Body>
                </Card>
        </div>
    )

}


export default Schedule;