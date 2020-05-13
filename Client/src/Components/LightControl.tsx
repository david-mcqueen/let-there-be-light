import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ApiService from '../service/ApiService';
import Pin from '../enums/Pin';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Schedule() {

    const api = new ApiService()

    const setValue = (value: number) => {
        api.setBrightness(Pin.WARM_WHITE, value);

        // Always ensure CW is 0
        // This can currently be turned on via the light-on.py script
        api.setBrightness(Pin.COOL_WHITE, 0);
    }


    return (
        <div className="slider">
            <Card>
                <Card.Header as="h5">Lights</Card.Header>
                <Card.Body>
                    <Card.Title>Adjust the lights</Card.Title>
                    <Card.Text>
                        <Row>
                            <Col sm>
                                <Button variant="dark" block onClick={() => setValue(0)}>Off</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="lightcontrol_valuebuttons">
                                <Button variant="outline-secondary" onClick={() => setValue(10)}>10%</Button>
                                <Button variant="outline-secondary" onClick={() => setValue(25)}>25%</Button>
                                <Button variant="outline-secondary" onClick={() => setValue(50)}>50%</Button>
                                <Button variant="outline-secondary" onClick={() => setValue(75)}>75%</Button>
                                <Button variant="outline-secondary" onClick={() => setValue(100)}>100%</Button>
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
                </Card>
        </div>
    )

}


export default Schedule;