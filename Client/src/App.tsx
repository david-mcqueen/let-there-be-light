import React from 'react';
import './app.scss'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Schedule from './Components/Schedule';
import Sleep from './Components/Sleep';
import LightControl from './Components/LightControl';

function App() {
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <Sleep />
            <LightControl />
            <Schedule />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
