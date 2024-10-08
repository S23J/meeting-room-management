import { createContext, useEffect, useState } from 'react';
import axios from '../../api/axios';
import Swal from 'sweetalert2';

const AuthContext = createContext( {} );

export const AuthProvider = ( { children } ) =>
{
    const [ userInfo, setUserInfo ] = useState();
    const [ tokens, setTokens ] = useState();
    const [ showSidebar, setShowSidebar ] = useState( false );
    const toggleSidebar = () =>
    {
        setShowSidebar( !showSidebar );
    };

    const [ mobileSidebar, setMobileSidebar ] = useState( false );
    const toggleMobileSidebar = () =>
    {
        setMobileSidebar( !mobileSidebar );
    };

    const isLoggedIn = async () =>
    {
        try {

            let user_info = await window.sessionStorage.getItem( "userInfo" )
            user_info = JSON.parse( user_info )

            if ( user_info ) {
                setUserInfo( user_info )
            }

            let token = await window.sessionStorage.getItem( "token" )

            let tokenMeta = JSON.parse( token )

            if ( tokenMeta ) {

                setTokens( tokenMeta )
            }

        } catch ( e ) {

        }
    }

    useEffect( () =>
    {
        isLoggedIn()
    }, [] );

    const tokenUser = tokens?.token;

    const patchMeeting = ( meetingId, tokenUser ) =>
    {
        const data = { finished: true };
        axios.patch( `/manage/requests/${meetingId}/`, data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ${tokenUser}`,
            },
        } )
            .then( response =>
            {

            } )
            .catch( err =>
            {
                console.log( err );
            } );
    };

    const toLocalTime = ( date, offset ) =>
    {
        const localTime = new Date( date.getTime() + offset * 60 * 60 * 1000 );
        return localTime;
    };

    const retrieveMeeting = () =>
    {
        axios.get( '/manage/requests/', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ${tokenUser}`,
            },
        } )
            .then( res =>
            {
                const filterData = res.data.filter( item =>
                {
                    return item.status === "approved" && item.finished === false;
                } );

                var dt = new Date();

                const localDt = toLocalTime( dt, 7 );

                filterData.forEach( meeting =>
                {
                    const meetingTime = new Date( meeting.waktu_selesai ); 

                    if ( meetingTime <= localDt ) {

                        patchMeeting( meeting.id, tokenUser );
                        Swal.fire( {
                            icon: 'success',
                            title: 'Ada meeting yang telah selesai.',
                            showConfirmButton: true,
                        } ).then( ( result ) =>
                        {
                            if ( result.isConfirmed ) {
                                window.location.reload();
                            }
                        } );
                    } else {

                    }
                } );
            } )
            .catch( err =>
            {
                console.error( err );
            } );
    };

    useEffect( () =>
    {
        const interval = setInterval( () =>
        {
            if ( tokenUser !== undefined ) retrieveMeeting();
        }, 10000 );
        return () => clearInterval( interval );
    }, [ tokenUser ] );

    return (
        <AuthContext.Provider
            value={ {
                userInfo,
                setUserInfo,
                tokens,
                setTokens,
                showSidebar,
                setShowSidebar,
                toggleSidebar,
                mobileSidebar,
                setMobileSidebar,
                toggleMobileSidebar
            } }
        >
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext;