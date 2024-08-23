import axios from 'axios';
import React, { useEffect } from 'react'
import { LogoBundar } from '../../assets';
import Swal from 'sweetalert2';

function Callback ()
{

    useEffect( () =>
    {
        const urlParams = new URLSearchParams( window.location.search );
        const code = urlParams.get( 'code' );
        if ( code ) {
            exchangeCodeForToken( code );
        }
    }, [] );

    const exchangeCodeForToken = async ( code ) =>
    {
        const getData = window.sessionStorage.getItem( "data" );
        const getDataParse = JSON.parse( getData );

        if ( getDataParse?.platform === "Google Meeting" ) {
            const clientId = getDataParse?.client_id;
            const clientSecret = getDataParse?.client_secret;
            const redirectUri = `http://localhost:3000/callback/`;

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

                const accessToken = response.data.access_token;

                // Store the access token and notify the parent window
                window.opener.postMessage( { accessToken: accessToken, authorizationStatus: 'success' }, '*' );

                Swal.fire( {
                    html: `
                <div style="text-align: center;">
                    <img src="${LogoBundar}" alt="Logo" style="width: 100px; height: 100px; display: block; margin: 0 auto;">
                    <h2 style="margin-top: 60px">Berhasil melakukan Authorization</h2>
                </div>
            `,
                    showConfirmButton: false,
                    timer: 2000
                } );
                setTimeout( () =>
                {
                    window.close();
                }, 2000 );
            } catch ( error ) {
                console.error( 'Error fetching access token', error.response.data );
                const result = await Swal.fire( {
                    icon: 'error',
                    title: 'Warning',
                    text: 'Terjadi kesalahan saat melakukan Authorization',
                    showConfirmButton: true
                } );

                if ( result.isConfirmed ) {
                    try {
                        window.close();
                    } catch ( err ) {
                        console.error( err )
                    }
                }
            };
        } else if ( getDataParse?.platform === "Zoom" ) {

            const clientId = getDataParse?.client_id;
            const clientSecret = getDataParse?.client_secret;
            const redirectUri = `http://localhost:3000/callback/`;

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

                const accessToken = response.data.access_token;

                // Store the access token and notify the parent window
                window.opener.postMessage( { accessToken: accessToken, authorizationStatus: 'success' }, '*' );

                Swal.fire( {
                    html: `
                <div style="text-align: center;">
                    <img src="${LogoBundar}" alt="Logo" style="width: 100px; height: 100px; display: block; margin: 0 auto;">
                    <h2 style="margin-top: 60px">Berhasil melakukan Authorization</h2>
                </div>
            `,
                    showConfirmButton: false,
                    timer: 2000
                } );
                setTimeout( () =>
                {
                    window.close();
                }, 2000 );
            } catch ( error ) {
                console.error( 'Error fetching access token', error.response.data );
                const result = await Swal.fire( {
                    icon: 'error',
                    title: 'Warning',
                    text: 'Terjadi kesalahan saat melakukan Authorization',
                    showConfirmButton: true
                } );

                if ( result.isConfirmed ) {
                    try {
                        window.close();
                    } catch ( err ) {
                        console.error( err )
                    }
                }
            };
        }


    };


    return (
        <div>

        </div>
    )
}

export default Callback
