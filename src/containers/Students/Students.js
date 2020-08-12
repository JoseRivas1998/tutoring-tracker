import React, {Component} from 'react';
import {Row, Col, Form, Table, InputGroup, Button} from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import {Helmet} from 'react-helmet';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDollarSign, faEdit, faWindowClose, faSave} from '@fortawesome/free-solid-svg-icons';

import InputElement from '../../components/InputElement/InputElement';
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
        updateStudentForm: {},
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

    addUpdateStudentForm = student => {
        const newUpdateStudentForm = {
            ...this.state.updateStudentForm
        };
        newUpdateStudentForm[student.id] = {
            name: {
                label: "Name",
                type: inputTypes.TEXT,
                value: student.name,
                touched: true,
                valid: true,
                validator: validators.requiredText
            },
            subject: {
                label: "Subject",
                type: inputTypes.TEXT,
                value: student.subject,
                touched: true,
                valid: true,
                validator: validators.requiredText
            },
            hourly_rate: {
                label: "Hourly Rate",
                type: inputTypes.NUMBER,
                value: Number(student.hourly_rate.substring(1)),
                touched: true,
                valid: true,
                validator: validators.combineAnd(validators.requiredNumber, validators.minValue(0)),
                filter: filters.filterNumber
            }
        };
        this.setState({updateStudentForm : newUpdateStudentForm});
    };

    removeUpdateStudentForm = studentId => {
        const newUpdateStudentForm = {
            ...this.state.updateStudentForm
        };
        delete newUpdateStudentForm[studentId];
        this.setState({updateStudentForm: newUpdateStudentForm});
    };

    updateEditForm = (event, key, studentId) => {
        const updatedEditForms = {
            ...this.state.updateStudentForm
        };
        const newValues = forms.updateForm(event, key, updatedEditForms[studentId]);
        updatedEditForms[studentId] = newValues.form;
        this.setState({updateStudentForm: updatedEditForms});
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
                        <th>Actions</th>
                    </tr>
                    </thead>
                );
            };
            const buildBody = () => {
                const buildRow = student => {
                    const buildPlainRow = () => {
                        const buildEditButton = () => {
                            return (
                                <Button
                                    type={"button"}
                                    variant={"warning"}
                                    onClick={event => this.addUpdateStudentForm(student)}>
                                    <FontAwesomeIcon icon={faEdit}/>
                                </Button>
                            );
                        };
                        return (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.subject}</td>
                                <td>{student.hourly_rate}</td>
                                <td>{student.createdAt}</td>
                                <td>{student.updatedAt}</td>
                                <td>{buildEditButton()}</td>
                            </tr>
                        )
                    };
                    const buildEditRow = () => {
                        const form = this.state.updateStudentForm[student.id];
                        const buildCancelButton = () => {
                            return (
                                <Button
                                    type={"button"}
                                    variant={"warning"}
                                    onClick={event => this.removeUpdateStudentForm(student.id)}>
                                    <FontAwesomeIcon icon={faWindowClose}/>
                                </Button>
                            );
                        };
                        const buildSaveButton = () => {
                            return (
                                <Button
                                    type={"button"}
                                    variant={"success"}
                                    className={"ml-sm-2"}>
                                    <FontAwesomeIcon icon={faSave}/>
                                </Button>
                            );
                        };
                        const buildNameInput = () => {
                            return (
                                <InputElement
                                    label={form.name.label}
                                    type={form.name.type}
                                    value={form.name.value}
                                    touched={form.name.touched}
                                    valid={form.name.valid}
                                    removeLabel
                                    onChange={event => this.updateEditForm(event, 'name', student.id)}/>
                            );
                        };
                        const buildSubjectInput = () => {
                            return (
                                <InputElement
                                    label={form.subject.label}
                                    type={form.subject.type}
                                    value={form.subject.value}
                                    touched={form.subject.touched}
                                    valid={form.subject.valid}
                                    removeLabel
                                    onChange={event => this.updateEditForm(event, 'subject', student.id)}/>
                            );
                        };
                        const buildHourlyRateInput = () => {
                            return (
                                <Form.Group>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faDollarSign}/>
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type={"number"}
                                            value={form.hourly_rate.value}
                                            isValid={form.hourly_rate.valid}
                                            isInvalid={form.hourly_rate.touched && !form.hourly_rate.valid}
                                            onChange={event => this.updateEditForm(event, 'hourly_rate', student.id)}/>
                                        <InputGroup.Append>
                                            <InputGroup.Text>/hr</InputGroup.Text>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>
                            );
                        };
                        return (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{buildNameInput()}</td>
                                <td>{buildSubjectInput()}</td>
                                <td>{buildHourlyRateInput()}</td>
                                <td>{student.createdAt}</td>
                                <td>{student.updatedAt}</td>
                                <td>{buildCancelButton()}{buildSaveButton()}</td>
                            </tr>
                        );
                    };
                    return this.state.updateStudentForm[student.id] ? buildEditRow() : buildPlainRow();
                };
                const students = this.state.students.map(buildRow);
                return (
                    <tbody>
                    {students}
                    </tbody>
                );
            };
            return (
                <Table responsive striped hover>
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
                <h2>New Student</h2>
                {buildNewStudentForm()}
                <hr/>
                {buildStudentsTable()}
            </Col>
        );
    }
}

export default Students;
