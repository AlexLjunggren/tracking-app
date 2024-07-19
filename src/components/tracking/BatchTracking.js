import React, { useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import { FileParser } from '../fileParser/FileParser';
import { Alert, FloatingLabel, Form } from 'react-bootstrap';
import { Submit } from '../buttons/Submit';

export class BatchTracking extends React.Component {

    constructor(props) {
        super(props);
        this.handleServiceChange.bind(this);
        this.handleEmailChange.bind(this);
        this.handleTrackingNumberChange.bind(this);
        this.handleSubmit.bind(this);
        this.state = {
            service: '',
            email: '',
            trackingNumbers: [],
            processing: false,
        };
    }

    handleServiceChange = event => {
        this.setState({service: event.target.value});
    }

    handleEmailChange = event => {
        this.setState({email: event.target.value});
    }

    setTrackingNumbers = trackingNumbers => {
        this.setState({trackingNumbers: trackingNumbers});
    };

    handleTrackingNumberChange = event => {
        let trackingNumbers = event.target.value.split('\n');
        this.setState({trackingNumbers: trackingNumbers});
    }

    clearAlerts = () => {
        this.props.clearAlerts();
    }

    setProcessiong = (processing) => {
        this.setState({processing: processing});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clearAlerts();
        this.setProcessiong(true);
        const path = '/api/tracking/batch';
        const data = JSON.stringify({
            trackingNumbers: this.state.trackingNumbers,
            email: this.state.email,
            service: this.state.service,
        });
        APIUtils.postJSON(path, data).then(({status, json}) => {
            this.setProcessiong(false);
            switch(status) {
                case 204: 
                    this.props.addSuccess('Request submitted. You will receive an email once processing is complete');
                    break;
                case 400:
                    this.props.addWarning(json);
                    break;
                case 500:
                    this.props.addError(json.message);
                    break;
                default:
                    this.props.addError(json);
            }
        });
    }
    
    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FloatingLabel 
                        controlId="floatingSelect" 
                        label="Tracking Service" 
                        className="mb-3"
                    >
                        <Form.Select 
                            value={this.state.service}
                            onChange={this.handleServiceChange}
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
                        className="mb-3"
                    >
                        <Form.Control 
                            type="email" 
                            onChange={this.handleEmailChange}
                            placeholder="name@example.com" 
                            required 
                        />
                    </FloatingLabel>
                    <FileParser 
                        setTrackingNumbers={this.setTrackingNumbers} 
                        addWarning={this.props.addWarning}
                        addError={this.props.addError}
                        clearAlerts={this.props.clearAlerts}
                    />
                    <FloatingLabel
                        controlId="floatingTextarea"
                        label="Tracking Numbers"
                        // className="mb-3"
                    >
                        <Form.Control 
                            as="textarea" 
                            placeholder='Tracking Numbers'
                            value={this.state.trackingNumbers.join('\n')} 
                            onChange={this.handleTrackingNumberChange}
                            style={{ height: '250px' }}
                            className="mb-3"
                            required
                            />
                    </FloatingLabel>
                    <Submit processing={this.state.processing}/>
                </Form>
            </div>
        );
    }
}