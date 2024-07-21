import React from 'react';
import * as APIUtils from '../../api/APIUtils';
import './FileParser.css';
import Info from '../info/Info'
import { FloatingLabel, Form } from 'react-bootstrap';

export class FileParser extends React.Component {

    constructor(props) {
        super(props);
        this.handleFileChange.bind(this);
        this.handleHeadersChange.bind(this);
        this.state = {
            headers: [],
            data: [],
            column: 0,
        };
    }

    clearAlerts = () => {
        this.props.clearAlerts();
    }

    setHeaders = headers => {
        this.setState({headers: headers});
    }

    isUnique = (value, index, array) => {
        return array.indexOf(value) === index;
    }

    setTrackingNumbers = () => {
        let data = this.state.data.map((row) => row[this.state.column]);
        data = data.filter((value) => value && value.length)
            .filter(this.isUnique);
        this.props.setTrackingNumbers(data);
    }

    clearResults = () => {
        this.setState({
            headers: [],
            data: [],
            column: 0,
        }, () => {
            this.setTrackingNumbers();
        });
    }

    parseResponse = json => {
        this.setState({
            headers: json.headers,
            data: json.data,
            column: 0,
        }, () => {
            this.setTrackingNumbers();
        });
    }

    showHeaders = () => {
        const headers = this.state.headers;
        if (!headers) {
            return false;
        }
        if (headers.length <= 1) {
            return false;
        }
        return true;
    }

    handleHeadersChange = event => {
        const column = event.target.value;
        this.setState({column: column}, () => {
            this.setTrackingNumbers();
        });
    }

    handleFileChange = event => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.clearAlerts();
        const path = '/api/file/parse';
        const data = new FormData();
        data.append('file', file);
        data.append('column', this.state.column);
        APIUtils.postFormData(path, data).then(({status, json}) => {
            if (status === 200) {
                this.parseResponse(json);
                return;
            }
            this.clearResults();
            this.props.addError(json.message);
        });
    }

    render() {
        return <div>
            <Form.Control 
                type="file" 
                onChange={this.handleFileChange} 
                className="mb-3"
            />
            {this.showHeaders() ? (
                <div className="mb-3">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Column"
                    >
                        <Form.Select onChange={this.handleHeadersChange} value={this.state.column}> 
                            {this.state.headers.map((header, i) => (
                                <option key={i} value={i}>{header}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                    <Info 
                        label={'What is this?'}
                        tip={'Don\'t see the data you are looking for? Try selecting a different column'}
                        className={'fileParserInfo'}
                    />
                </div>
            ) : null}
        </div >
    }
}