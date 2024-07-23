import React from 'react';
import * as APIUtils from '../../api/APIUtils';
import './FileParser.css';
import Info from '../info/Info'
import { FloatingLabel, Form } from 'react-bootstrap';

export class FileParser extends React.Component {

    constructor(props) {
        super(props);
        this.handleFileChange.bind(this);
        this.handleSheetChange.bind(this);
        this.handleHeadersChange.bind(this);
        this.state = {
            workbook: {},
            sheets: [],
            headers: [],
            sheet: 0,
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
        const sheets = this.state.sheets;
        if (sheets.length == 0) {
            this.props.setTrackingNumbers([]);
            return;
        }
        let data = sheets[this.state.sheet].rows.map((row) => row.cells[this.state.column].value);
        data = data.filter((value) => value && value.length)
            .filter(this.isUnique);
        this.props.setTrackingNumbers(data);
    }

    setHeaders = () => {
        let headers = this.state.sheets[this.state.sheet].headers.cells.map((cell) => cell.value);
        this.setState({headers: headers});
    }

    clearResults = () => {
        this.setState({
            processing: false,
            workbook: {},
            sheets: [],
            headers: [],
            sheet: 0,
            column: 0,
        }, () => {
            this.setTrackingNumbers();
        });
    }

    parseResponse = json => {
        this.setState({
            workbook: json,
            sheets: json.sheets,
            sheet: 0,
            column: 0,
        }, () => {
            this.setHeaders();
            this.setTrackingNumbers();
        });
    }

    showSheets = () => {
        const sheets = this.state.sheets;
        if (!sheets) {
            return false;
        }
        if (sheets.length <=1) {
            return false;
        }
        return true;
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

    setProcessing = (processing) => {
        this.setState({processing: processing});
    }

    handleSheetChange = event => {
        const sheet = event.target.value;
        this.setState({
            sheet: sheet,
            column: 0,
        }, () => {
            this.setHeaders();
            this.setTrackingNumbers();
        });
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
        this.setProcessing(true);
        this.clearAlerts();
        const path = '/api/file/parse';
        const data = new FormData();
        data.append('file', file);
        data.append('column', this.state.column);
        APIUtils.postFormData(path, data).then(({status, json}) => {
            this.setProcessing(false);
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
            <div className="mb-3">
                <Form.Control 
                    type="file" 
                    onChange={this.handleFileChange}
                    disabled={this.state.processing}
                />
                <Info 
                    label={'Accepted file types?'}
                    tip={'Excel (xlsx, csv)'}
                />
            </div>
            {this.showSheets() ? (
                <div className="mb-3">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Sheet"
                >
                    <Form.Select onChange={this.handleSheetChange} value={this.state.sheet}> 
                        {this.state.sheets.map((sheet, i) => (
                            <option key={i} value={i}>{sheet.name}</option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
                <Info 
                    label={'What is this?'}
                    tip={'The file contained multiple sheets. Select the sheet containing the tracking numbers'}
                />
            </div>
        ) : null}
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
                        tip={'The file contained multiple columns. Select the column containing the tracking numbers'}
                   />
                </div>
            ) : null}
        </div >
    }
}