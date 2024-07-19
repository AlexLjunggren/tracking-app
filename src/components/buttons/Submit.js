import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';

export class Submit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonText: 'Submit',
            processingText: 'Processing...'
        };
    }

    getButtonText = () => {
        return this.props.processing ?
                this.state.processingText :
                this.state.buttonText;
    }

    render() {
        return (
            <Button type="submit" className="mb-3" >
                {this.props.processing ? (
                    <Spinner
                        animation="border"
                        size="sm"
                        variant="light"
                    />
                ) : null}
                {this.getButtonText()}
            </Button>
        );
    }
}