import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ApiService from '../service/ApiService';
import Pin from '../enums/Pin';
import Slider, { Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import useInterval from '../hooks/useInterval';

const handle = (props: any) => {
    const { value, dragging, index, ...restProps } = props;

    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
};

function Schedule() {

    const [ww_value, setww_value] = useState(0);
    const [cw_value, setcw_value] = useState(0);

    const api = new ApiService()

    const setValue = (value: number, coolwhite?: boolean) => {
        
        if (coolwhite){
            api.setBrightness(Pin.COOL_WHITE, value);
        } else {
            api.setBrightness(Pin.WARM_WHITE, value);
        }
    }

    useInterval(() => {
        api.getStatus()
            .then((respStatus: {ww: number, cw: number}) => {
                setww_value(respStatus.ww);
                setcw_value(respStatus.cw);
            });
    }, 5000, true)

    const turnOff = () => {
        setcw_value(0);
        setww_value(0);
    }


    return (
        <div className="slider">
            <Card>
                <Card.Header as="h5">Lights</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col sm>
                                <Button variant="dark" block onClick={() => {turnOff()}}>Off</Button>
                            </Col>
                        </Row>
                    </Card.Text>
                    
                    Warm White
                    <Slider min={0} max={100} onChange={setww_value} onAfterChange={setValue} handle={handle} value={ww_value}/>

                    Cool White
                    <Slider min={0} max={100} onChange={setcw_value} onAfterChange={(value: number) => {setValue(value, true)}} handle={handle} value={cw_value}/>
                </Card.Body>
                </Card>
        </div>
    )

}


export default Schedule;