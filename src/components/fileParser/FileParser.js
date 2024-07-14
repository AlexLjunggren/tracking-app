import React from 'react';
import * as APIUtils from '../../api/APIUtils';
import { Form } from 'react-bootstrap';

export class FileParser extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange.bind(this);
    }

    handleChange = event => {
        event.preventDefault();
        this.props.clearMessages();
        const path = '/api/file/parse';
        const data = new FormData();
        const file = event.target.files[0];
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