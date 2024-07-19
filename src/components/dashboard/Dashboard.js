import { Tab } from 'bootstrap';
import React, { useState } from 'react';
import * as APIUtils from '../../api/APIUtils';
import { Tabs } from 'react-bootstrap';
import { Tracking } from '../tracking/Tracking';
import { BatchTracking } from '../tracking/BatchTracking';
import { RawTracking } from '../tracking/RawTracking';
import { Alerts } from '../alerts/Alerts';

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertSuccesses: [],
            alertInfos: [],
            alertWarnings: [],
            alertErrors: [],
        };
    }

    componentDidMount = () => {
        this.getAnnouncements();
    }

    getAnnouncements = () => {
        const path = '/api/announcement';
        APIUtils.get(path).then(({status, json}) => {
            switch(status) {
                case 200: 
                    json.map((message, i) => this.addInfo(message));
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

    addSuccess = success => {
        this.setState({alertSuccesses: [...this.state.alertSuccesses, success]});
    };

    addInfo = info => {
        this.setState({alertInfos: [...this.state.alertInfos, info]});
    }

    addWarning = warning => {
        this.setState({alertWarnings: [...this.state.alertWarnings, warning]});
    };

    addError = error => {
        this.setState({alertErrors: [...this.state.alertErrors, error]});
    };

    clearAlerts = () => {
        this.setState({
            alertSuccesses: [],
            alertInfos: [],
            alertWarnings: [],
            alertErrors: [],
        });
    }

    render() {
        return (
            <div>
                <Alerts 
                    successes={this.state.alertSuccesses}
                    infos={this.state.alertInfos}
                    warnings={this.state.alertWarnings}
                    errors={this.state.alertErrors}
                />
                <Tabs defaultActiveKey="batch"
                    className="mb-3"
                >
                    <Tab eventKey="individual" title="Tracking">
                        <Tracking 
                            addSuccess={this.addSuccess}
                            addWarning={this.addWarning}
                            addError={this.addError}
                            clearAlerts={this.clearAlerts}
                        />
                    </Tab>
                    <Tab eventKey="batch" title="Batch">
                        <BatchTracking 
                            addSuccess={this.addSuccess}
                            addWarning={this.addWarning}
                            addError={this.addError}
                            clearAlerts={this.clearAlerts}
                        />
                    </Tab>
                    <Tab eventKey="raw" title="Raw">
                        <RawTracking 
                            addSuccess={this.addSuccess}
                            addWarning={this.addWarning}
                            addError={this.addError}
                            clearAlerts={this.clearAlerts}
                        />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}