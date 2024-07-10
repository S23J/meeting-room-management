import { createContext, useEffect, useState } from 'react';
import axios from '../../api/axios';

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

    // const tokenUser = tokens?.token;

    // const patchMeeting = ( meetingId, tokenUser ) =>
    // {
    //     const data = { finished: true };
    //     axios.patch( `/manage/requests/${meetingId}/`, data, {
    //         headers: {
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-Type': 'application/json',
    //             withCredentials: true,
    //             Authorization: `Token ${tokenUser}`,
    //         },
    //     } )
    //         .then( response =>
    //         {
    //             console.log( 'Patch response:', response );
    //         } )
    //         .catch( err =>
    //         {
    //             console.log( 'Patch error:', err );
    //         } );
    // };

    // const retrieveMeeting = () =>
    // {
    //     axios.get( '/manage/requests/', {
    //         headers: {
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-Type': 'application/json',
    //             withCredentials: true,
    //             Authorization: `Token ${tokenUser}`,
    //         },
    //     } )
    //         .then( res =>
    //         {
    //             const filterData = res.data.filter( item =>
    //             {
    //                 return item.status === "approved" && item.finished === null;
    //             } );

    //             // const now = new Date().toISOString();
    //             // console.log( 'Current time (now):', now.toISOString() ); // Log in UTC format
    //             function toIsoString ( date )
    //             {
    //                 var tzo = -date.getTimezoneOffset(),
    //                     dif = tzo >= 0 ? '+' : '-',
    //                     pad = function ( num )
    //                     {
    //                         return ( num < 10 ? '0' : '' ) + num;
    //                     };

    //                 return date.getFullYear() +
    //                     '-' + pad( date.getMonth() + 1 ) +
    //                     '-' + pad( date.getDate() ) +
    //                     'T' + pad( date.getHours() ) +
    //                     ':' + pad( date.getMinutes() ) +
    //                     ':' + pad( date.getSeconds() ) +
    //                     '.' + pad( date.getMilliseconds() ) +
    //                     'Z'
    //             }

    //             var dt = new Date();
    //             console.log( toIsoString( dt ) );

    //             filterData.forEach( meeting =>
    //             {
    //                 const meetingTime = new Date( meeting.waktu_selesai ); // Ensure meeting time is correctly parsed as Date
    //                 console.log( 'Meeting time (waktu_selesai):', meetingTime.toISOString() ); // Log in UTC format

    //                 if ( meetingTime > dt ) { // Compare in milliseconds
    //                     console.log( `Meeting ${meeting.id} has ended. Executing patch...` );
    //                     patchMeeting( meeting.id, tokenUser );
    //                 } else (
    //                     console.log( 'Belom waktunya' )
    //                 )
    //             } );

    //         } )
    //         .catch( err =>
    //         {
    //             console.log( 'Error fetching meetings:', err );
    //         } );
    // };
    // useEffect( () =>
    // {
    //     const interval = setInterval( () =>
    //     {
    //         if ( tokenUser !== undefined ) retrieveMeeting();
    //     }, 10000 ); // Interval set to 10 seconds
    //     return () => clearInterval( interval );
    // }, [ tokenUser ] );

    // Check interval meeting


    return (
        <AuthContext.Provider value={ { userInfo, setUserInfo, tokens, setTokens, showSidebar, setShowSidebar, toggleSidebar, mobileSidebar, setMobileSidebar, toggleMobileSidebar } }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext;