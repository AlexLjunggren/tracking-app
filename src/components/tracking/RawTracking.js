import React, { useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import { FloatingLabel, Form } from 'react-bootstrap';
import { Submit } from '../buttons/Submit';

export class RawTracking extends React.Component {

    constructor(props) {
        super(props);
        this.handleServiceChange.bind(this);
        this.handleTrackingNumberChange.bind(this);
        this.handleSubmit.bind(this);
        this.state = {
            service: '',
            trackingNumber: '',
            json: null,
            processing: false,
        };
    }

    handleServiceChange = event => {
        this.setState({service: event.target.value});
    }

    handleTrackingNumberChange = (event) => {
        this.setState({trackingNumber: event.target.value});
    }

    clearAlerts = () => {
        this.props.clearAlerts();
    }

    setProcessiong = (processing) => {
        this.setState({processing: processing});
    }

    setJson = (json) => {
        this.setState({json: json});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clearAlerts();
        this.setJson(null);
        this.setProcessiong(true);
        const path = '/api/tracking/raw';
        const data = JSON.stringify({
            trackingNumber: this.state.trackingNumber,
            service: this.state.service,
        });
        APIUtils.postJSON(path, data).then(({status, json}) => {
            this.setProcessiong(false);
            switch(status) {
                case 200: 
                    this.setJson(json);
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
                            <option value='AUTO'>Auto Detect (BETA)</option>
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Tracking Number"
                        className="mb-3"
                    >
                        <Form.Control 
                            type="text" 
                            onChange={this.handleTrackingNumberChange}
                            placeholder="Tracking Number" 
                            required 
                        />
                    </FloatingLabel>
                    <Submit processing={this.state.processing}/>
                    <pre>{this.state.json ? JSON.stringify(this.state.json, null, 2) : ''}</pre> 
                </Form>
            </div>
        );
    }
}