import React from 'react';
import * as APIUtils from '../../api/APIUtils';
import { Form } from 'react-bootstrap';

export class FileParser extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange.bind(this);
    }

    clearAlerts = () => {
        this.props.clearAlerts();
    }

    handleChange = event => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        event.preventDefault();
        this.clearAlerts();
        const path = '/api/file/parse';
        const data = new FormData();
        data.append('file', file);
        APIUtils.postFormData(path, data).then(({status, json}) => {
            if (status === 200) {
                this.props.setTrackingNumbers(json);
                return;
            }
            if (status === 400) {
                this.props.addWarning(json.message);
                return;
            }
            if (status === 500) {
                this.props.addError(json.message);
                return;
            }
            this.props.addError(json);
        });
    }

    render() {
        return <Form.Control 
            type="file" 
            onChange={this.handleChange} 
            className="mb-3"
        />
    }
}