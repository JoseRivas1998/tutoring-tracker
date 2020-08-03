import React, {Component} from 'react';
import {Col, Table, Form, Row, Button, Alert} from 'react-bootstrap';
import {Helmet} from 'react-helmet';
import axios from 'axios';
import moment from 'moment';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';

import Spinner from '../../components/Spinner/Spinner';
import {DATE_FORMAT} from '../../utils/dateutils';
import * as inputTypes from '../../utils/inputTypes';
import InputElement from '../../components/InputElement/InputElement';
import * as forms from '../../utils/forms';
import * as validators from '../../utils/validators';
import * as filters from '../../utils/filters';

const createLogSessionForm = (students) => {
    const defaultStudentId = students.length > 0 ? students[0].id : -1;
    return {
        student: {
            label: "Student",
            type: inputTypes.SELECT,
            value: defaultStudentId,
            touched: true,
            valid: true,
            filter: filters.filterNumber,
            options: students.map(student => ({name: student.name, value: student.id}))
        },
        date: {
            label: "Date",
            type: inputTypes.DATE,
            value: moment().startOf('day'),
            touched: true,
            valid: true
        },
        start_time: {
            label: "Start Time",
            type: inputTypes.TIME,
            value: moment().startOf('minute'),
            touched: true,
            valid: true
        },
        end_time: {
            label: "End Time",
            type: inputTypes.TIME,
            value: moment().startOf('minute'),
            touched: true,
            valid: true
        }
    }
};

class Sessions extends Component {

    state = {
        loading: true,
        unrequested: [],
        requested: [],
        students: [],
        logSessionForm: {
            ...createLogSessionForm([])
        },
        logSessionFormValid: false,
        logSessionFormError: null,
    };

    componentDidMount() {
        this.loadData();
    }

    loadData = async () => {
        if (!this.state.loading) this.setState({loading: true});
        const unrequested = await axios.get('http://localhost:3001/sessions?requested=false');
        const requested = await axios.get('http://localhost:3001/sessions?requested=true');
        const students = (await axios.get('http://localhost:3001/students')).data;
        this.setState({
            loading: false,
            unrequested: unrequested.data,
            requested: requested.data,
            students: students,
            logSessionForm: {...createLogSessionForm(students)}
        })
    };

    logSessionOnChange = (event, key) => {
        const form = forms.updateForm(event, key, this.state.logSessionForm);
        this.setState({logSessionForm: form.form, logSessionFormValid: form.formValid});
    };

    logSessionOnFormSubmit = async event => {
        event.preventDefault();
        if (!this.state.logSessionFormValid) return;
        const startTime = moment(this.state.logSessionForm.start_time.value).year(0).month(0).date(0).startOf('minute');
        const endTime = moment(this.state.logSessionForm.end_time.value).year(0).month(0).date(0).startOf('minute');
        if (!(validators.maxTime(endTime)(startTime))) {
            this.setState({logSessionFormError: "Start time must be before end time"});
            return;
        }
        this.setState({logSessionFormError: null});
        const date = moment(this.state.logSessionForm.date.value).startOf('day');
        const duration = endTime.diff(startTime, 'hours', true);
        date.hour(startTime.hour()).minute(startTime.minute() + 1);
        const formData = {
            date: date.format(),
            duration: duration,
            StudentId: this.state.logSessionForm.student.value
        };
        let error = null;
        try {
            await axios.post('http://localhost:3001/sessions/', formData);
        } catch (err) {
            let errorMessage = "Unable to add session.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            error = errorMessage;
        }
        this.setState({logSessionFormError: error});
        this.loadData();
    };

    render() {
        if (this.state.loading) {
            return (
                <Col>
                    <Helmet>
                        <title>Sessions</title>
                    </Helmet>
                    <Spinner text={"Loading"}/>
                </Col>
            );
        }
        const buildSessionTable = (sessions) => {
            const buildHeading = () => {
                return (
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Payment Paid</th>
                        <th>Student Name</th>
                        <th>Student Subject</th>
                        <th>Amount Owed</th>
                    </tr>
                    </thead>
                );
            };
            const buildBody = () => {
                const buildRows = () => {
                    const buildRow = session => {
                        const amountOwed = session.duration * session.Student.hourly_rate;
                        return (
                            <tr key={session.id}>
                                <td>{session.id}</td>
                                <td>{moment(session.date).format(DATE_FORMAT)}</td>
                                <td>{session.duration.toFixed(2)} h</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={session.payment_paid ? faCheck : faTimes}
                                        className={session.payment_paid ? 'text-success' : 'text-danger'}/>
                                </td>
                                <td>{session.Student.name}</td>
                                <td>{session.Student.subject}</td>
                                <td>${amountOwed.toFixed(2)}</td>
                            </tr>
                        );
                    };
                    return sessions.map(buildRow);
                };
                return (
                    <tbody>
                    {buildRows()}
                    </tbody>
                );
            };
            return (
                <Table responsive striped hover>
                    {buildHeading()}
                    {buildBody()}
                </Table>
            );
        };
        const buildLogSessionForm = () => {
            const buildLogSessionFormElements = () => {
                const buildLogSessionFormElement = formElement => {
                    return (
                        <Col key={formElement.key}>
                            <InputElement
                                label={formElement.label}
                                type={formElement.type}
                                value={formElement.value}
                                touched={formElement.touched}
                                valid={formElement.valid}
                                options={formElement.options}
                                onChange={event => this.logSessionOnChange(event, formElement.key)}/>
                        </Col>
                    );
                };
                const elements = [];
                for (let key in this.state.logSessionForm) {
                    elements.push(buildLogSessionFormElement({key: key, ...this.state.logSessionForm[key]}));
                }
                return elements;
            };
            return (
                <Form onSubmit={this.logSessionOnFormSubmit}>
                    <Row>
                        {buildLogSessionFormElements()}
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                variant={"primary"}
                                disabled={!this.state.logSessionFormValid}
                                type={"submit"}>Submit</Button>
                        </Col>
                    </Row>
                </Form>
            )
        };
        const buildLogSessionFormError = () => {
            if (!this.state.logSessionFormError) return null;
            return (
                <Alert variant={"danger"} className={"mt-2"}>
                    {this.state.logSessionFormError}
                </Alert>
            );
        };
        return (
            <Col>
                <Helmet>
                    <title>Sessions</title>
                </Helmet>
                <h1>Sessions</h1>
                <h2>Log Session</h2>
                {buildLogSessionForm()}
                {buildLogSessionFormError()}
                <h2>Sessions with no Payment Request</h2>
                {buildSessionTable(this.state.unrequested)}
                <h2>Sessions with Payment Request</h2>
                {buildSessionTable(this.state.requested)}
            </Col>
        );
    }
}

export default Sessions;
