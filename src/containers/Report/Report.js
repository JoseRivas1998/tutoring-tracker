import React, {Component} from 'react';
import {Col, Table, Row} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import axios from 'axios';
import moment from 'moment';

import InputElement from '../../components/InputElement/InputElement';
import * as inputTypes from '../../utils/inputTypes';
import * as forms from '../../utils/forms';
import {DATE_FORMAT} from '../../utils/dateutils';

class Report extends Component {

    state = {
        rangeForm: {
            startDate: {
                label: 'Start Date',
                type: inputTypes.DATE,
                value: moment().startOf('month')
            },
            endDate: {
                label: 'End Date',
                type: inputTypes.DATE,
                value: moment().endOf('month').startOf('day')
            }
        },
        paid: []
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('paid', 'true');
            const url = `http://localhost:3001/requests/?${queryParams}`;

            const startDate = moment(this.state.rangeForm.startDate.value);
            const endDate = moment(this.state.rangeForm.endDate.value).endOf('day');

            const paidRequests = (await axios.get(url)).data.map(request => ({
                ...request,
                date: moment(request.date)
            })).filter(request => {
                const date = moment(request.date);
                return date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate);
            });
            this.setState({paid: paidRequests});
        } catch (err) {
            console.error(err);
        }
    };

    onRangeChange = (event, key) => {
        this.setState({rangeForm: forms.updateForm(event, key, this.state.rangeForm).form}, () => this.loadData());
    };

    render() {
        const buildRangeForm = () => {
            const buildFormElements = () => {
                const buildFormElement = element => {
                    return (
                        <Col key={element.key}>
                            <InputElement
                                label={element.label}
                                type={element.type}
                                value={element.value}
                                touched={true}
                                valid={true}
                                onChange={event => this.onRangeChange(event, element.key)}/>
                        </Col>
                    );
                };
                const elements = [];
                for (let key in this.state.rangeForm) {
                    elements.push(buildFormElement({key, ...this.state.rangeForm[key]}));
                }
                return elements;
            };
            return (
                <Row>
                    {buildFormElements()}
                </Row>
            );
        };
        const buildPaidTable = () => {
            const buildHead = () => {
                return (
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Student Name</th>
                        <th>Student Subject</th>
                        <th>Amount Paid</th>
                    </tr>
                    </thead>
                )
            };
            const buildBody = () => {
                const buildRequestsRows = () => {
                    const buildRequestRow = request => {
                        const cost = request.duration * request.Student.hourly_rate;
                        return (
                            <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{moment(request.date).format(DATE_FORMAT)}</td>
                                <td>{request.duration.toFixed(2)} h</td>
                                <td>{request.Student.name}</td>
                                <td>{request.Student.subject}</td>
                                <td>${cost.toFixed(2)}</td>
                            </tr>
                        );
                    };
                    return this.state.paid.map(buildRequestRow);
                };
                const buildTotalRow = () => {
                    const total = this.state.paid.length === 0 ? 0 : this.state.paid
                        .map(request => request.duration * request.Student.hourly_rate)
                        .reduce((total, currentValue) => total + currentValue);
                    return (
                        <tr>
                            <td colSpan={5} className={"text-right"}><strong>Total</strong></td>
                            <td>${total.toFixed(2)}</td>
                        </tr>
                    );
                };
                return (
                    <tbody>
                    {buildRequestsRows()}
                    {buildTotalRow()}
                    </tbody>
                );
            };
            return (
                <Table responsive striped hover>
                    {buildHead()}
                    {buildBody()}
                </Table>
            );
        };
        return (
            <Col>
                <Helmet>
                    <title>Financial Report</title>
                </Helmet>
                <h1>Financial Report</h1>
                {buildRangeForm()}
                <h2>Paid Requests</h2>
                {buildPaidTable()}
            </Col>
        );
    }
}

export default Report;
