import './Header.css'
import React, { useState } from 'react';

export class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertSuccesses: [],
            alertInfos: [],
            alertWarnings: [],
            alertErrors: [],
        };
    }

    render() {
        return (
            <div className='header'>
                tracking.ljunggren.io
            </div>
        );
    }
}