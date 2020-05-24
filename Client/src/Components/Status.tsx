import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ApiService from '../service/ApiService';
import useInterval from '../hooks/useInterval';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Status() {

    const api = new ApiService();

    useInterval(() => {
        api.getStatus()
            .then((respStatus: {ww: number, cw: number}) => {
                setStatus(respStatus);
            });
    }, 5000, true)

    const [status, setStatus] = useState({
        ww: 0,
        cw: 0
    });

    return (
        <div className="status">
            <Card>
                <Card.Header as="h5">Status</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col>
                                Warm White: {status.ww}%
                            </Col>
                            <Col>
                                Cool White: {status.cw}%
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Status;