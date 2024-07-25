import React from 'react';
import { td, Container, Row, Table } from 'react-bootstrap';

export class ResponseTable extends React.Component {

    constructor(props) {
        super(props);
    }

    toDate = (milliseconds) => {
        if (!milliseconds) {
            return '';
        }
        const date = new Date(milliseconds);
        return date.toString();
    }

    render() {
        if (this.props.data) {
            return (
                <Table striped bordered hover responsive>
                    <tbody>
                    <tr>
                        <td>Service</td>
                        <td>{this.props.data.service}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td>{this.props.data.status}</td>
                    </tr>
                    {this.props.data.message ? (
                        <tr>
                            <td>Message</td>
                            <td>{this.props.data.message}</td>
                        </tr>
                    ) : null}
                    {this.props.data.pickedUp ? (
                        <tr>
                            <td>Picked Up</td>
                            <td>{this.toDate(this.props.data.pickedUp)}</td>
                        </tr>
                    ) : null}
                    {this.props.data.delivered ? (
                        <tr>
                            <td>Delivered</td>
                            <td>{this.toDate(this.props.data.delivered)}</td>
                        </tr>
                    ) : null}
                    {this.props.data.link ? (
                        <tr>
                            <td>Link</td>
                            <td><a href={this.props.data.link} target="_blank">Click here</a></td>
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
}