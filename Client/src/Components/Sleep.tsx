import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ApiService from '../service/ApiService';
import useInterval from '../hooks/useInterval';

function Schedule() {

    const api = new ApiService()

    const [isSleeping, setIsSleeping] = useState(false);

    useInterval(() => {
        api.getStatus()
            .then((respStatus: {isSleeping: boolean}) => {
                if (isSleeping != respStatus.isSleeping){
                    setIsSleeping(respStatus.isSleeping)
                }
            });
    }, 5000, true)

    const sleep = () => {
        setIsSleeping(true);
        api.sleep();
    }

    const stopSleep = () => {
        setIsSleeping(false)
        api.stopSleep();
    }

    return (
        <div className="slider">
            <Card>
                <Card.Header as="h5">Sleep</Card.Header>
                <Card.Body>
                    <Card.Text>
                    Turn off the lights over 30 minutes
                    </Card.Text>
                    <ButtonGroup className="mr-2" aria-label="start group">
                        <Button variant="success" block disabled={isSleeping} onClick={() => !isSleeping ? sleep() : null}>{isSleeping ? 'Sleeping...' : 'Start Sleep'}</Button>

                    </ButtonGroup>

                    <ButtonGroup aria-label="stop group">
                        <Button disabled={!isSleeping} variant="info" onClick={stopSleep}>Stop Sleep</Button>
                    </ButtonGroup>
                </Card.Body>
                </Card>
        </div>
    )

}


export default Schedule;