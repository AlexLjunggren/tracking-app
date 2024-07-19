import React, { useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import { FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { ResponseTable } from '../response/ResponseTable';
import { Submit } from '../buttons/Submit';

export class Tracking extends React.Component {

    constructor(props) {
        super(props);
        this.handleServiceChange.bind(this);
        this.handleTrackingNumberChange.bind(this);
        this.handleSubmit.bind(this);
        this.state = {
            service: '',
            trackingNumber: '',
            response: null,
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

    setResponse = (json) => {
        this.setState({response: json});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setResponse(null);
        this.clearAlerts();
        this.setProcessiong(true);
        const path = '/api/tracking';
        const data = JSON.stringify({
            trackingNumber: this.state.trackingNumber,
            service: this.state.service,
        });
        APIUtils.postJSON(path, data).then(({status, json}) => {
            this.setProcessiong(false);
            console.log(json);
            switch(status) {
                case 200: 
                    this.setResponse(json);
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
                        label="Tracing Number"
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
                    <ResponseTable data={this.state.response} />
                </Form>
            </div>
        );
    }
}