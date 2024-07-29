import React, { useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import Info from '../info/Info'
import { Button, FloatingLabel, Form, Stack } from 'react-bootstrap';
import Submit from '../buttons/Submit';

export default function RawTracking({ addWarning, addError, clearAlerts}) {
    const [service, setService] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [json, setJson] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleServiceChange = event => {
        setService(event.target.value);
    }

    const handleTrackingNumberChange = (event) => {
        setTrackingNumber(event.target.value);
    }

    const handleReset = () => {
        setService('');
        setTrackingNumber('');
        setJson(null);
        clearAlerts();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        clearAlerts();
        setJson(null);
        setProcessing(true);
        const path = '/api/tracking/raw';
        const data = JSON.stringify({
            trackingNumber: trackingNumber,
            service: service,
        });
        APIUtils.postJSON(path, data).then(({status, json}) => {
            setProcessing(false);
            switch(status) {
                case 200: 
                    setJson(json);
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
                        <option value='AUTO'>Auto Detect (BETA)</option>
                    </Form.Select>
                    {service === 'AUTO' ? (
                        <Info 
                            label={'What is Auto Detect (BETA)?'}
                            tip={'The application will attempt to identify the tracking service based on the tracking number'}
                        />
                    ) : null}
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Tracking Number"
                    className="mb-3"
                >
                    <Form.Control 
                        type="text" 
                        value={trackingNumber}
                        onChange={handleTrackingNumberChange}
                        placeholder="Tracking Number" 
                        required 
                    />
                </FloatingLabel>
                <Stack direction="horizontal" gap={2} className="mb-3">
                    <Submit processing={processing}/>
                    <Button variant="outline-secondary" onClick={handleReset}>Reset</Button>
                </Stack>
                {json ? (
                    <pre>{JSON.stringify(json, null, 2)}</pre>
                ) : null}
            </Form>
        </div>
    );
}