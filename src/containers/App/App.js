import React from 'react';
import Layout from '../../hoc/layout/Layout';
import {Container, Row} from 'react-bootstrap';
import {Switch, Route} from 'react-router';

import Students from '../Students/Students';
import Sessions from '../Sessions/Sessions';
import classes from './App.module.css';


function App() {
    return (
        <div>
            <Layout>
                <Container className={classes.MainContainer} fluid>
                    <Row>
                        <Switch>
                            <Route path={"/"} exact component={Students}/>
                            <Route path={"/sessions"} component={Sessions}/>
                        </Switch>
                    </Row>
                </Container>
            </Layout>
        </div>
    );
}

export default App;
