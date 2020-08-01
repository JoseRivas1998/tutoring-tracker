import React, {Component} from 'react';
import {Col, Table} from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

const DATE_FORMAT = "YYYY-MM-DD hh:mm:ss a";

class Students extends Component {

    state = {
        students: []
    };

    componentDidMount() {
        this.loadStudents();
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
                console.log(this.state.students);
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
        return (
            <Col>
                <h1>Students</h1>
                {buildStudentsTable()}
            </Col>
        );
    }
}

export default Students;
