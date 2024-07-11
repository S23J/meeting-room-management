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

    // Check interval meeting

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
                console.log( 'Patch response:', response );
            } )
            .catch( err =>
            {
                console.log( 'Patch error:', err );
            } );
    };

    // Function to adjust date to local timezone
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
                    return item.status === "approved" && item.finished === null;
                } );

                // Get current time in UTC
                var dt = new Date();
                // console.log( 'Current UTC time (dt):', dt.toISOString() );

                // Adjust current time to local timezone (+7 hours)
                const localDt = toLocalTime( dt, 7 );
                // console.log( 'Current local time (localDt):', localDt.toISOString() );

                filterData.forEach( meeting =>
                {
                    const meetingTime = new Date( meeting.waktu_selesai ); // Ensure meeting time is correctly parsed as Date
                // console.log( 'Meeting time (waktu_selesai):', meetingTime.toISOString() ); // Log in UTC format

                    // Check if meeting end time is less than or equal to current local time
                    if ( meetingTime <= localDt ) {
                        // console.log(`Meeting ${meeting.id} has ended. Executing patch...`);
                        patchMeeting( meeting.id, tokenUser );
                        Swal.fire( {
                            icon: 'success',
                            title: 'Ada meeting yang telah selesai.',
                            showConfirmButton: true,
                        } ).then( ( result ) =>
                        {
                            if ( result.isConfirmed ) {
                                window.location.reload(); // Reload the page when the confirm button is clicked
                            }
                        } );
                    } else {
                        // console.log('Belom waktunya');
                    }
                } );
            } )
            .catch( err =>
            {
                console.log( 'Error fetching meetings:', err );
            } );
    };

    useEffect( () =>
    {
        const interval = setInterval( () =>
        {
            if ( tokenUser !== undefined ) retrieveMeeting();
        }, 60000 ); // Interval set to 60 seconds
        return () => clearInterval( interval );
    }, [ tokenUser ] );

    // Check interval meeting


    return (
        <AuthContext.Provider value={ { userInfo, setUserInfo, tokens, setTokens, showSidebar, setShowSidebar, toggleSidebar, mobileSidebar, setMobileSidebar, toggleMobileSidebar } }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext;