import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ( { children } ) =>
{
    if ( sessionStorage.getItem( "userInfo" ) ) {
        return <Navigate to="/dashboard/" />;
    } else {
        return <>{ children }</>;
    }
};

export default PublicRoute;