import React from 'react';
import {Alert} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const spinner = props => (
    <Alert variant={"warning"}>
        <Alert.Heading>
            <h2><FontAwesomeIcon icon={faSpinner} spin/>{' '}{props.text ? props.text : 'Spinner'}</h2>
        </Alert.Heading>
    </Alert>
);

spinner.propTypes = {
    text: PropTypes.string
};

export default spinner;
