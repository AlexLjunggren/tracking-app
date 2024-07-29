import React, { useState, useEffect, useImperativeHandle } from 'react';
import * as APIUtils from '../../api/APIUtils';
import './FileParser.css';
import Info from '../info/Info'
import { FloatingLabel, Form, InputGroup, Spinner } from 'react-bootstrap';

export default function FileParser({ setTrackingNumbers, clearAlerts, addWarning, addError }) {
    const [headers, setHeaders] = useState([]);
    const [sheets, setSheets] = useState([]);
    const [sheet, setSheet] = useState(0);
    const [column, setColumn] = useState(0);
    const [processing, setProcessing] = useState(false);

    const isUnique = (value, index, array) => {
        return array.indexOf(value) === index;
    }

    const parseTrackingNumbers = (sheets, sheet, column) => {
        if (sheets.length == 0) {
            setTrackingNumbers([]);
            return;
        }
        let data = sheets[sheet].rows.map((row) => row.cells[column].value?.trim());
        data = data.filter((value) => value && value.length)
            .filter(isUnique);
        setTrackingNumbers(data);
    }

    const parseHeaders = (sheets, sheet) => {
        let headers = sheets[sheet].headers.cells.map((cell) => cell.value?.trim());
        setHeaders(headers);
    }

    const parseResponse = json => {
        setSheets(json.sheets);
        setSheet(0);
        setColumn(0);
        parseHeaders(json.sheets, 0);
        parseTrackingNumbers(json.sheets, 0, 0);
    }

    const showSheets = () => {
        if (!sheets) {
            return false;
        }
        if (sheets.length <=1) {
            return false;
        }
        return true;
    }

    const showHeaders = () => {
        if (!headers) {
            return false;
        }
        if (headers.length <= 1) {
            return false;
        }
        return true;
    }

    const handleSheetChange = event => {
        const sheet = event.target.value;
        setSheet(sheet);
        setColumn(0);
        parseHeaders(sheets, sheet);
        parseTrackingNumbers(sheets, sheet, 0);
    }

    const handleHeadersChange = event => {
        const column = event.target.value;
        setColumn(column);
        parseTrackingNumbers(sheets, sheet, column);
    }

    const handleFileChange = event => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        setProcessing(true);
        clearAlerts();
        const path = '/api/file/parse';
        const data = new FormData();
        data.append('file', file);
        APIUtils.postFormData(path, data).then(({status, json}) => {
            setProcessing(false);
            switch(status) {
            case 200:
                parseResponse(json);
                break;
            case 400:
                addWarning(json.message);
                break;
            case 500:
                addError(json.message);
                break;
            default:
                addError(json);
            }
        });
    }

    return (
        <div>
            <div className="mb-3">
                <InputGroup>
                    {processing ? (
                        <InputGroup.Text>
                            <Spinner
                                animation="border"
                                size="sm"
                                variant="primary"
                            />
                        </InputGroup.Text>
                    ) : null}
                    <Form.Control 
                        type="file" 
                        onChange={handleFileChange}
                        disabled={processing}
                        placeholder='Place text'
                    />
                </InputGroup>
                <Info 
                    label={'Accepted file types?'}
                    tip={'Excel (xlsx, csv)'}
                />
            </div>
            {showSheets() ? (
                <div className="mb-3">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Sheet"
                >
                    <Form.Select onChange={handleSheetChange} 
                        value={sheet}> 
                        {sheets.map((sheet, i) => (
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
            {showHeaders() ? (
                <div className="mb-3">
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Column"
                    >
                        <Form.Select onChange={handleHeadersChange} value={column}> 
                            {headers.map((header, i) => (
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
    )
}