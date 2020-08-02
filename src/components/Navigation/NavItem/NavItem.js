import React from 'react';
import PropTypes from 'prop-types';
import {LinkContainer} from 'react-router-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Nav} from 'react-bootstrap';

import './NavItem.css';

const navItem = props => (
    <Nav.Item>
        <LinkContainer to={props.path} exact>
            <Nav.Link><FontAwesomeIcon icon={props.icon}/></Nav.Link>
        </LinkContainer>
    </Nav.Item>
);

navItem.propTypes = {
    path: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired
};

export default navItem;
