import React from 'react';
import { Alert } from 'react-bootstrap';

export class Alerts extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.successes.map((message, i) => (
                    <Alert variant='success' key={i} dismissible>{message}</Alert>
                ))}
                {this.props.infos.map((message, i) => (
                    <Alert variant='primary' key={i} dismissible>{message}</Alert>
                ))}
                {this.props.warnings.map((message, i) => (
                    <Alert variant='warning' key={i} dismissible>{message}</Alert>
                ))}
                {this.props.errors.map((message, i) => (
                    <Alert variant='danger' key={i} dismissible>{message}</Alert>
                ))}
            </div>
        );
    }
}