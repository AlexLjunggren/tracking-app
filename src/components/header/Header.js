import './Header.css'
import React from 'react';

export class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='header'>
                tracking.ljunggren.io
            </div>
        );
    }
}