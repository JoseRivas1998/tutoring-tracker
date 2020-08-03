import React from 'react';
import {Col, Container, Nav, Row} from 'react-bootstrap';
import {faBusinessTime, faDollarSign, faUsers, faFileInvoiceDollar} from '@fortawesome/free-solid-svg-icons';

import NavItem from './NavItem/NavItem';
import classes from './Navigation.module.css';

const navLinks = [
    {
        path: "/",
        icon: faUsers
    },
    {
        path: "/sessions",
        icon: faBusinessTime
    },
    {
        path: "/requests",
        icon: faDollarSign
    },
    {
        path: "/report",
        icon: faFileInvoiceDollar
    }
];

const navigation = props => {
    const navItems = navLinks.map((navLink, index) => (
        <NavItem path={navLink.path} icon={navLink.icon} key={index}/>
    ));
    return (
        <Container className={[classes.Navigation, "fixed-bottom"].join(' ')} fluid>
            <Row>
                <Col>
                    <Nav fill variant={"pills"}>
                        {navItems}
                    </Nav>
                </Col>
            </Row>
        </Container>
    );
};

export default navigation;
