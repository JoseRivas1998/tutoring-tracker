import React from 'react';

import Navigation from '../../components/Navigation/Navigation';

const layout = props => (
    <>
        {props.children}
        <Navigation/>
    </>
);

export default layout;
