import axios from 'axios';
import React, { useEffect } from 'react'
import { LogoBundar } from '../../assets';
import Swal from 'sweetalert2';

function Callback ()
{

    // useEffect( () =>
    // {
    //     const urlParams = new URLSearchParams( window.location.search );
    //     const code = urlParams.get( 'code' );
    //     if ( code ) {
    //         exchangeCodeForToken( code );
    //     }
    // }, [] );

    // const exchangeCodeForToken = async ( code ) =>
    // {
    //     const getData = window.sessionStorage.getItem( "data" );
    //     const getDataParse = JSON.parse( getData );

    //     if ( getDataParse?.platform === "Google Meeting" ) {
    //         const clientId = getDataParse?.client_id;
    //         const clientSecret = getDataParse?.client_secret;
    //         const redirectUri = `http://localhost:3000/callback/`;

    //         const dataBody = new URLSearchParams( {
    //             code: code,
    //             grant_type: 'authorization_code',
    //             redirect_uri: redirectUri,
    //             client_id: clientId,
    //             client_secret: clientSecret
    //         } );

    //         try {
    //             const response = await axios.post( 'https://oauth2.googleapis.com/token', dataBody.toString(), {
    //                 headers: {
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                 },
    //             } );

    //             const accessToken = response.data.access_token;

    //             console.log( response )

    //             window.opener.postMessage( { accessToken: accessToken, authorizationStatus: 'success' }, '*' );

    //             const result = await Swal.fire( {
    //                 html: `
    //                     <div style="text-align: center;">
    //                         <img src="${LogoBundar}" alt="Logo" style="width: 100px; height: 100px; display: block; margin: 0 auto;">
    //                         <h2 style="margin-top: 50px">Berhasil melakukan Authorization</h2>
    //                     </div>
    //                 `,
    //                 showConfirmButton: true
    //             } );

    //             if ( result.isConfirmed ) {
    //                 try {
    //                     window.close();
    //                 } catch ( err ) {
    //                     console.error( err );
    //                 }
    //             };
    //         } catch ( error ) {
    //             console.error( 'Error fetching access token', error.response.data );
    //             const result = await Swal.fire( {
    //                 icon: 'error',
    //                 title: 'Warning',
    //                 text: 'Terjadi kesalahan saat melakukan Authorization',
    //                 showConfirmButton: true
    //             } );

    //             if ( result.isConfirmed ) {
    //                 try {
    //                     window.close();
    //                 } catch ( err ) {
    //                     console.error( err )
    //                 }
    //             }
    //         };

    //     } else if ( getDataParse?.platform === "Zoom" ) {

    //         try {

    //         } catch ( error ) {
    //             console.error( error );
    //         };
    //     }


    // };

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

                // Send the refresh token back to the original page
                window.opener.postMessage( {
                    type: "gmeet-auth-success",
                    refreshToken: response.data.refresh_token,
                }, window.location.origin );

                // Close the new window after sending the message
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

                // Send the refresh token back to the original page
                window.opener.postMessage( {
                    type: "zoom-auth-success",
                    refreshToken: response.data.refresh_token,
                }, window.location.origin );

                // Close the new window after sending the message
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
            exchangeCodeForToken( code );
        }
    }, [] );


    return (
        <div>

        </div>
    )
}

export default Callback
