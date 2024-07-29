import React from 'react';
import { Table } from 'react-bootstrap';

export default function ResponseTable({ data}) {

    const toDate = (milliseconds) => {
        if (!milliseconds) {
            return '';
        }
        const date = new Date(milliseconds);
        return date.toString();
    }

    if (data) {
        return (
            <Table striped bordered hover responsive>
                <tbody>
                <tr>
                    <td>Service</td>
                    <td>{data.service}</td>
                </tr>
                <tr>
                    <td>Status</td>
                    <td>{data.status}</td>
                </tr>
                {data.message ? (
                    <tr>
                        <td>Message</td>
                        <td>{data.message}</td>
                    </tr>
                ) : null}
                {data.pickedUp ? (
                    <tr>
                        <td>Picked Up</td>
                        <td>{toDate(data.pickedUp)}</td>
                    </tr>
                ) : null}
                {data.delivered ? (
                    <tr>
                        <td>Delivered</td>
                        <td>{toDate(data.delivered)}</td>
                    </tr>
                ) : null}
                {data.link ? (
                    <tr>
                        <td>Link</td>
                        <td><a href={data.link} target="_blank">Click here</a></td>
                    </tr>
                ) : null}
                </tbody>
            </Table>
        );
    }
    return (
        <div></div>
    );
}