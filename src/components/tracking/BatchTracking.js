import './BatchTracking.css';
import React, { useRef, useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import FileParser from '../fileParser/FileParser';
import { Button, FloatingLabel, Form, Stack } from 'react-bootstrap';
import Submit from '../buttons/Submit';

export default function BatchTracking({ addSuccess, addWarning, addError, clearAlerts}) {
    const [service, setService] = useState('');
    const [email, setEmail] = useState('');
    const [trackingNumbers, setTrackingNumbers] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [fileParserKey, setFileParserKey] = useState(1);

    const handleServiceChange = event => {
        setService(event.target.value);
    }

    const handleEmailChange = event => {
        setEmail(event.target.value);
    }

    const handleTrackingNumberChange = event => {
        let trackingNumbers = event.target.value.split('\n').map(trackingNumber => trackingNumber?.trim());
        setTrackingNumbers(trackingNumbers);
    }

    const handleReset = () => {
        resetData();
        clearAlerts();
    }

    const resetData = () => {
        setService('');
        setEmail('');
        setTrackingNumbers([]);
        setFileParserKey(fileParserKey * -1);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        clearAlerts();
        setProcessing(true);
        const path = '/api/tracking/batch';
        const data = JSON.stringify({
            trackingNumbers: trackingNumbers,
            email: email,
            service: service,
        });
        APIUtils.postJSON(path, data).then(({status, json}) => {
            setProcessing(false);
            switch(status) {
                case 204: 
                    addSuccess('Request submitted. You will receive an email once processing is complete');
                    resetData();
                    break;
                case 400:
                    addWarning(json);
                    break;
                case 500:
                    addError(json.message);
                    break;
                default:
                    addError(json);
            }
        });
    }
    
    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FloatingLabel 
                    controlId="floatingSelect" 
                    label="Tracking Service" 
                    className="mb-3"
                >
                    <Form.Select 
                        value={service}
                        onChange={handleServiceChange}
                        required
                    >
                        <option value='' hidden>Select Tracking Service</option>
                        <option value='FEDEX'>Fedex</option>
                        <option value='UPS'>UPS</option>
                        <option value='DHL'>DHL</option>
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Email address"
                >
                    <Form.Control 
                        type="email" 
                        onChange={handleEmailChange}
                        placeholder="name@example.com" 
                        value={email}
                        required 
                        className="mb-3"
                    />
                </FloatingLabel>
                <FileParser 
                    key={fileParserKey}
                    setTrackingNumbers={setTrackingNumbers} 
                    addWarning={addWarning}
                    addError={addError}
                    clearAlerts={clearAlerts}
                />
                <FloatingLabel
                    controlId="floatingTextarea"
                    label="Tracking Numbers"
                >
                    <Form.Control 
                        as="textarea" 
                        placeholder='Tracking Numbers'
                        value={trackingNumbers.join('\n')} 
                        onChange={handleTrackingNumberChange}
                        style={{ height: '250px' }}
                        className="mb-3"
                        required
                        />
                </FloatingLabel>
                <Stack direction="horizontal" gap={2} className="mb-3">
                    <Submit processing={processing}/>
                    <Button variant="outline-secondary" onClick={handleReset}>Reset</Button>
                </Stack>
            </Form>
        </div>
    )
}