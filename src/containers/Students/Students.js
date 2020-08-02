import React, {Component} from 'react';
import {Row, Col, Form, Table, InputGroup, Button} from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import {Helmet} from 'react-helmet';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDollarSign} from '@fortawesome/free-solid-svg-icons';

import {DATE_FORMAT} from '../../utils/dateutils';
import * as inputTypes from '../../utils/inputTypes';
import * as filters from '../../utils/filters';
import * as forms from '../../utils/forms';
import * as validators from '../../utils/validators';

const buildNewForm = () => ({
    name: {
        label: "Name",
        type: inputTypes.TEXT,
        value: "",
        touched: false,
        valid: false,
        validator: validators.requiredText
    },
    subject: {
        label: "Subject",
        type: inputTypes.TEXT,
        value: "",
        touched: false,
        valid: false,
        validator: validators.requiredText
    },
    hourly_rate: {
        label: "Hourly Rate",
        type: inputTypes.NUMBER,
        value: 0,
        touched: false,
        valid: false,
        validator: validators.combineAnd(validators.requiredNumber, validators.minValue(0)),
        filter: filters.filterNumber
    }
});

class Students extends Component {

    state = {
        students: [],
        newStudent: {
            ...buildNewForm()
        },
        formValid: false
    };

    componentDidMount() {
        this.loadStudents().then(r => console.log(`${this.state.students.length} students loaded.`));
    }

    loadStudents = async () => {
        const response = await axios.get('http://localhost:3001/students/')
        const students = response.data.map(student => ({
            ...student,
            hourly_rate: `$${student.hourly_rate.toFixed(2)}`,
            createdAt: moment(student.createdAt).format(DATE_FORMAT),
            updatedAt: moment(student.updatedAt).format(DATE_FORMAT)
        }));
        this.setState({students: students});
    };

    onFormInputUpdate = (event, key) => {
        const updatedState = forms.updateForm(event, key, this.state.newStudent);
        this.setState({newStudent: updatedState.form, formValid: updatedState.formValid});
    };

    onFormSubmit = event => {
        event.preventDefault();
        if (!this.state.formValid) return;
        const submitForm = async () => {
            const formData = {
                name: this.state.newStudent.name.value,
                subject: this.state.newStudent.subject.value,
                hourly_rate: this.state.newStudent.hourly_rate.value
            };
            const response = await axios.post('http://localhost:3001/students/', formData);
            this.setState({newStudent: {...buildNewForm()}, formValid: false});
            console.log(response);
        }
        submitForm().then(() => this.loadStudents());
    };

    render() {
        const buildStudentsTable = () => {
            const buildHeader = () => {
                return (
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Hourly Rate</th>
                        <th>Created</th>
                        <th>Last Updated</th>
                    </tr>
                    </thead>
                );
            };
            const buildBody = () => {
                const students = this.state.students.map(student => (
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.subject}</td>
                        <td>{student.hourly_rate}</td>
                        <td>{student.createdAt}</td>
                        <td>{student.updatedAt}</td>
                    </tr>
                ));
                return (
                    <tbody>
                    {students}
                    </tbody>
                );
            };
            return (
                <Table responsive striped hover bordered>
                    {buildHeader()}
                    {buildBody()}
                </Table>
            );
        };
        const buildNewStudentForm = () => {
            return (
                <Form onSubmit={this.onFormSubmit}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>{this.state.newStudent.name.label}</Form.Label>
                                <Form.Control
                                    value={this.state.newStudent.name.value}
                                    placeholder={this.state.newStudent.name.label}
                                    isValid={this.state.newStudent.name.valid}
                                    isInvalid={this.state.newStudent.name.touched && !this.state.newStudent.name.valid}
                                    onChange={event => this.onFormInputUpdate(event, "name")}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>{this.state.newStudent.subject.label}</Form.Label>
                                <Form.Control
                                    value={this.state.newStudent.subject.value}
                                    placeholder={this.state.newStudent.subject.label}
                                    isValid={this.state.newStudent.subject.valid}
                                    isInvalid={this.state.newStudent.subject.touched && !this.state.newStudent.subject.valid}
                                    onChange={event => this.onFormInputUpdate(event, "subject")}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>{this.state.newStudent.hourly_rate.label}</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text><FontAwesomeIcon icon={faDollarSign}/></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        value={this.state.newStudent.hourly_rate.value}
                                        type={"number"}
                                        placeholder={this.state.newStudent.hourly_rate.label}
                                        isValid={this.state.newStudent.hourly_rate.valid}
                                        isInvalid={this.state.newStudent.hourly_rate.touched && !this.state.newStudent.hourly_rate.valid}
                                        onChange={event => this.onFormInputUpdate(event, "hourly_rate")}/>
                                    <InputGroup.Append>
                                        <InputGroup.Text>/hr</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                variant={"primary"}
                                type={"submit"}
                                disabled={!this.state.formValid}>Add Student</Button>
                        </Col>
                    </Row>
                </Form>
            );
        };
        return (
            <Col>
                <Helmet>
                    <title>Students</title>
                </Helmet>
                <h1>Students</h1>
                {buildStudentsTable()}
                <hr/>
                <h2>New Student</h2>
                {buildNewStudentForm()}
            </Col>
        );
    }
}

export default Students;
