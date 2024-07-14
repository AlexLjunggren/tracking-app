import React, { useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import { FileParser } from '../fileParser/FileParser';
import { Alert, Button, ButtonGroup, Col, FloatingLabel, Form, InputGroup, Row } from 'react-bootstrap';

export class Tracking extends React.Component {

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
            successes: [],
            warnings: [],
            errors: [],
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

    addSuccess = success => {
        this.setState({successes: [...this.state.successes, success]});
    };

    addWarning = warning => {
        this.setState({warnings: [...this.state.warnings, warning]});
    };

    addError = error => {
        this.setState({errors: [...this.state.errors, error]});
    };

    clearMessages = () => {
        this.setState({
            successes: [],
            warnings: [],
            errors: [],
        });
    }

    handleTrackingNumberChange = event => {
        let trackingNumbers = event.target.value.split('\n');
        this.setState({trackingNumbers: trackingNumbers});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.clearMessages();
        const path = '/api/tracking';
        const data = JSON.stringify({
            trackingNumbers: this.state.trackingNumbers,
            email: this.state.email,
            service: this.state.service,
        });
        APIUtils.postJSON(path, data).then(({status, json}) => {
            if (status === 204) {
                this.addSuccess('Request submitted. You will receive an email once processing is complete');
                return;
            }
            if (status === 400) {
                this.addWarning(json);
                return
            }
            if (status === 500) {
                this.addError(json.message);
                return;
            }
            this.addError(json);
        });
    }
    
    render() {
        return (
            <div>
                {this.state.successes.map((message, i) => (
                    <Alert variant='success' key={i}>{message}</Alert>
                ))}
                {this.state.warnings.map((message, i) => (
                    <Alert variant='warning' key={i}>{message}</Alert>
                ))}
                {this.state.errors.map((message, i) => (
                    <Alert variant='danger' key={i}>{message}</Alert>
                ))}
                {JSON.stringify(this.state.warning)}
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
                            <option value='DHL'>DHL</option>
                            <option value='UPS'>UPS</option>
                            <option value='USPS'>Postal</option>
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
                        addWarning={this.addWarning}
                        addError={this.addError}
                        clearMessages={this.clearMessages}
                    />
                    <FloatingLabel
                        controlId="floatingTextarea"
                        label="Tracking Numbers"
                        className="mb-3"
                    >
                        <Form.Control 
                            as="textarea" 
                            placeholder='Tracking Numbers'
                            value={this.state.trackingNumbers.join('\n')} 
                            onChange={this.handleTrackingNumberChange}
                            style={{ height: '250px' }}
                            required
                            />
                    </FloatingLabel>
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        );
    }
}