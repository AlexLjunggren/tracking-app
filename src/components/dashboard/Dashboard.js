import './Dashboard.css';
import { Tab } from 'bootstrap';
import React, { useEffect, useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import { Tabs } from 'react-bootstrap';
import Tracking from '../tracking/Tracking';
import BatchTracking from '../tracking/BatchTracking';
import RawTracking from '../tracking/RawTracking';
import Alerts from '../alerts/Alerts';

export default function Dashboard() {
    const [alertSuccesses, setAlertSuccesses] = useState([]);
    const [alertInfos, setAlertInfos] = useState([]);
    const [alertWarnings, setAlertWarnings] = useState([]);
    const [alertErrors, setAlertErrors] = useState([]);

    useEffect(() => {
        getAnnouncements();
    }, []);
    
    const getAnnouncements = () => {
        const path = '/api/announcements';
        APIUtils.get(path).then(({status, json}) => {
            switch(status) {
                case 200: 
                    json.map((message, i) => addInfo(message));
                    break;
                case 400:
                    this.addWarning(json);
                    break;
                case 500:
                    this.addError(json.message);
                    break;
                default:
                    this.addError(json);
            }
        });
    }

    const addInfo = info => {
        setAlertInfos(alertInfos => [...alertInfos, info]);
    }

    const addSuccess = success => {
        setAlertSuccesses(alertSuccesses => [...alertSuccesses, success]);
    };

    const addWarning = warning => {
        setAlertWarnings(alertWarnings => [...alertWarnings, warning]);
    };

    const addError = error => {
        setAlertErrors(alertErrors => [...alertErrors, error]);
    };

    const clearAlerts = () => {
        setAlertInfos([]);
        setAlertSuccesses([]);
        setAlertWarnings([]);
        setAlertErrors([]);
    }

    return (
        <div className='dashboard'>
            <Alerts 
                successes={alertSuccesses}
                infos={alertInfos}
                warnings={alertWarnings}
                errors={alertErrors}
            />
            <Tabs defaultActiveKey="batch"
                className="mb-3"
            >
                <Tab eventKey="individual" title="Tracking">
                    <Tracking 
                        addSuccess={addSuccess}
                        addWarning={addWarning}
                        addError={addError}
                        clearAlerts={clearAlerts}
                    />
                </Tab>
                <Tab eventKey="batch" title="Batch">
                    <BatchTracking 
                        addSuccess={addSuccess}
                        addWarning={addWarning}
                        addError={addError}
                        clearAlerts={clearAlerts}
                    />
                </Tab>
                <Tab eventKey="raw" title="Raw">
                    <RawTracking 
                        addSuccess={addSuccess}
                        addWarning={addWarning}
                        addError={addError}
                        clearAlerts={clearAlerts}
                    />
                </Tab>
            </Tabs>
        </div>
    );
}