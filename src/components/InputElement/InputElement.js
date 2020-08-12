import React from 'react';
import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import * as inputTypes from '../../utils/inputTypes';
import './InputElement.css';

const textFormElement = props => {
    return (
        <Form.Control
            value={props.value}
            placeholder={props.label}
            isValid={props.valid}
            isInvalid={props.touched && !props.valid}
            onChange={props.onChange}/>
    );
};

const selectFormElement = props => {
    let options = null;
    if (props.options) {
        options = props.options.map(option => (
            <option value={option.value} key={option.value}>{option.name ? option.name : option.value}</option>
        ));
    }
    return (
        <Form.Control
            value={props.value}
            as={"select"}
            onChange={props.onChange}>
            {options}
        </Form.Control>
    );
};

const dateFormElement = props => {
    return (
        <DateTime
            value={props.value}
            dateFormat={"MM/DD/YYYY"}
            timeFormat={false}
            closeOnSelect
            onChange={value => props.onChange({target: {value: value}})}/>
    );
};

const timeFormElement = props => {
    return (
        <DateTime
            value={props.value}
            dateFormat={false}
            timeFormat={"hh:mm A"}
            onChange={value => props.onChange({target: {value: value}})}/>
    );
};

const inputElement = props => {
    let formElement;
    switch (props.type) {
        case inputTypes.SELECT:
            formElement = selectFormElement(props);
            break;
        case inputTypes.DATE:
            formElement = dateFormElement(props);
            break;
        case inputTypes.TIME:
            formElement = timeFormElement(props);
            break;
        case inputTypes.TEXT:
        default:
            formElement = textFormElement(props);
            break;
    }
    return (
        <Form.Group>
            {props.removeLabel ? null : <Form.Label>{props.label}</Form.Label>}
            {formElement}
        </Form.Group>
    );
};

inputElement.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    touched: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array,
    removeLabel: PropTypes.bool
};

export default inputElement;
