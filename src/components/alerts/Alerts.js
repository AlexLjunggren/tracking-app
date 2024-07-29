import React from 'react';
import { Alert } from 'react-bootstrap';

export default function Alerts({ successes, infos, warnings, errors }) {

    return (
        <div>
            {successes.map((message, i) => (
                <Alert variant='success' key={i} dismissible>{message}</Alert>
            ))}
            {infos.map((message, i) => (
                <Alert variant='primary' key={i} dismissible>{message}</Alert>
            ))}
            {warnings.map((message, i) => (
                <Alert variant='warning' key={i} dismissible>{message}</Alert>
            ))}
            {errors.map((message, i) => (
                <Alert variant='danger' key={i} dismissible>{message}</Alert>
            ))}
        </div>
    );
}