import axios from 'axios';
import React, { useEffect } from 'react'

function Callback ()
{

    const exchangeCodeForTokenNewAkun = async ( code ) =>
    {

        const getData = window.sessionStorage.getItem( "data" );
        const getDataParse = JSON.parse( getData );

        if ( getDataParse?.platform === "Google Meeting" ) {
            const clientId = getDataParse?.client_id;
            const clientSecret = getDataParse?.client_secret;
            const redirectUri = `http://localhost:3000/callback`;

            const dataBody = new URLSearchParams( {
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret
            } );

            try {
                const response = await axios.post( 'https://oauth2.googleapis.com/token', dataBody.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                } );

                window.opener.postMessage( {
                    type: "gmeet-auth-success",
                    refreshToken: response.data.refresh_token,
                }, window.location.origin );

                window.close();

            } catch ( error ) {
                console.error( error )
            }

        } else if ( getDataParse?.platform === "Zoom" ) {

            const redirectUri = `http://localhost:3000/callback`;

            const dataBody = new URLSearchParams( {
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            } );

            try {
                const response = await axios.post( 'https://zoom.us/oauth/token', dataBody.toString(), {
                    headers: {
                        Authorization: `Basic ${btoa( `${getDataParse?.client_id}:${getDataParse?.client_secret}` )}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                } );

                window.opener.postMessage( {
                    type: "zoom-auth-success",
                    refreshToken: response.data.refresh_token,
                }, window.location.origin );

                window.close();

            } catch ( error ) {
                console.error( error )
            }
        }

    };

    const exchangeCodeForToken = async ( code ) =>
    {
        const getDataAkunMeeting = window.sessionStorage.getItem( "data-akun-meeting" );
        const getDataAkunMeetingParse = JSON.parse( getDataAkunMeeting );

        if ( getDataAkunMeetingParse?.platform === "Google Meeting" ) {

            const clientId = getDataAkunMeetingParse?.client_id;
            const clientSecret = getDataAkunMeetingParse?.client_secret;
            const redirectUri = `http://localhost:3000/callback`;

            const dataBody = new URLSearchParams( {
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret
            } );

            try {
                const response = await axios.post( 'https://oauth2.googleapis.com/token', dataBody.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                } );

                window.opener.postMessage( {
                    type: "gmeet-auth-success",
                    refreshToken: response.data.refresh_token,
                }, window.location.origin );

                window.close();

            } catch ( error ) {
                console.error( error )
            }


        } else if ( getDataAkunMeetingParse?.platform === "Zoom" ) {

            const redirectUri = `http://localhost:3000/callback`;
            const clientId = getDataAkunMeetingParse?.client_id;
            const clientSecret = getDataAkunMeetingParse?.client_secret;

            const dataBody = new URLSearchParams( {
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            } );

            try {
                const response = await axios.post( 'https://zoom.us/oauth/token', dataBody.toString(), {
                    headers: {
                        Authorization: `Basic ${btoa( `${clientId}:${clientSecret}` )}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                } );

                window.opener.postMessage( {
                    type: "zoom-auth-success",
                    refreshToken: response.data.refresh_token,
                }, window.location.origin );

                window.close();

            } catch ( error ) {
                console.error( error )
            }

        }



    };

    useEffect( () =>
    {
        const urlParams = new URLSearchParams( window.location.search );
        const code = urlParams.get( 'code' );
        if ( code ) {
            exchangeCodeForTokenNewAkun( code );
            exchangeCodeForToken( code );
        }
    }, [] );


    return (
        <div>

        </div>
    )
}

export default Callback
