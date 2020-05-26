import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './app.scss'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Schedule from './Components/Schedule';
import Sleep from './Components/Sleep';
import LightControl from './Components/LightControl';
import Status from './Components/Status';

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
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        />
    </div>
  );
}

export default App;
