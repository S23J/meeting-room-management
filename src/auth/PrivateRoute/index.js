import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteComp = ( props ) =>
{
    if ( sessionStorage.getItem( "userInfo" ) ) {
        return <>{ props.children }</>;
    } else {
        return <Navigate to="/" />;

    }
};

export default PrivateRouteComp;