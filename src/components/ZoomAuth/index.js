import React, { useEffect, useState } from 'react'
import axios from '../../api/axios';
import { Button } from 'react-bootstrap';

function ZoomAuth ( {
    meetingid,
    selectedPlatform,
    tokenUser
} )
{

    // const [ detailAkun, setDetailAkun ] = useState( null );

    // const retrieveDetailAkun = async () =>
    // {
    //     try {
    //         const res = await axios.get( `/manage/omplatform/${selectedPlatform?.value}`, {
    //             headers: {
    //                 'Access-Control-Allow-Origin': '*',
    //                 'Content-Type': 'application/json',
    //                 withCredentials: true,
    //                 Authorization: `Token ${tokenUser}`,
    //             },
    //         } );
    //         setDetailAkun( res.data );
    //         // const win = window.sessionStorage
    //         // win.setItem( "client_id", JSON.stringify( res.data.client_id ) )
    //         // win.setItem( "client_secret", JSON.stringify( res.data.client_secret ) )
    //         console.log( res.data );
    //     } catch ( err ) {
    //         console.error( err );
    //     }
    // };

    // useEffect( () =>
    // {
    //     if ( tokenUser !== undefined ) retrieveDetailAkun();
    // }, [ tokenUser ] );

    // console.log( detailAkun?.client_id )
    // console.log( detailAkun?.client_secret )

    // const redirectToZoomAuth = async () =>
    // {
    //     const clientId = detailAkun?.client_id
    //     // const clientId = await window.sessionStorage.getItem( "client_id" );
    //     // const clientIdParse = JSON.parse( clientId )
    //     const redirectUri = `http://localhost:3000/detail-meeting/${meetingid}`; // Replace with your actual redirect URI
    //     const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent( redirectUri )}`;

    //     // Redirect to Zoom Authorization URL
    //     window.location.href = zoomAuthUrl;
    // };


    // const [ authCode, setAuthCode ] = useState( null );

    // useEffect( () =>
    // {
    //     // Extract the authorization code from the URL
    //     const urlParams = new URLSearchParams( window.location.search );
    //     const code = urlParams.get( 'code' );
    //     if ( code ) {
    //         setAuthCode( code );
    //         // Now you can use this code to get the access token
    //         exchangeCodeForToken( code );
    //     }
    // }, [] );

    // const exchangeCodeForToken = async ( code ) =>
    // {
    //     const clientId = detailAkun?.client_id
    //     const clientSecret = detailAkun?.client_secret
    //     // const clientId = await window.sessionStorage.getItem( "client_id" );
    //     // const clientIdParse = JSON.parse( clientId )
    //     // const clientSecret = await window.sessionStorage.getItem( "client_secret" );
    //     // const clientSecretParse = JSON.parse( clientSecret )
    //     const redirectUri = `http://localhost:3000/detail-meeting/${meetingid}`; // Must match the redirect URI in your Zoom app settings

    //     const dataBody = new URLSearchParams( {
    //         code: code,
    //         grant_type: 'authorization_code',
    //         redirect_uri: redirectUri,
    //     } );

    //     try {
    //         const response = await axios.post( 'https://zoom.us/oauth/token', dataBody.toString(), {
    //             headers: {
    //                 Authorization: `Basic ${btoa( `${clientId}:${clientSecret}` )}`,
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //         } );

    //         const accessToken = response.data.access_token;
    //         console.log( 'Access Token:', accessToken );
    //         // You can now store the access token and use it to make API requests
    //         // Store in state or in localStorage
    //     } catch ( error ) {
    //         console.error( 'Error fetching access token', error.response.data );
    //     }
    // };

    // const handleSubmit = async ( e ) =>
    // {
    //     e.preventDefault();

    //     const formData = {
    //         topic: 'Meeting Topic 2',
    //         start_time: '2024-08-21T11:00:00Z',
    //         duration: 60,
    //     };

    //     try {
    //         const response = await axios.post( 'https://api.zoom.us/v2/users/me/meetings', formData, {
    //             headers: {
    //                 Authorization: `Bearer eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImNkNTJlZDhlLTIzY2UtNDhmNi05ZTZkLTE4NDYzYWNhMDRkZiJ9.eyJ2ZXIiOjksImF1aWQiOiI2MmQ3MDk5YTBmNmNlNWVjYTk1YzYxNzRmOGIxYmIzNCIsImNvZGUiOiJNRDd5U0pmR0kyNEtqbWdDQnRWVHptb0sxdUM3Nk5Eb2ciLCJpc3MiOiJ6bTpjaWQ6OXBXUUI3dDJSd2VZN3cxSDFCQW1QQSIsImdubyI6MCwidHlwZSI6MCwidGlkIjowLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJJZ00xYTl5d1NpV1luRHVFR1FDVjJRIiwibmJmIjoxNzI0MTI2NzA3LCJleHAiOjE3MjQxMzAzMDcsImlhdCI6MTcyNDEyNjcwNywiYWlkIjoidl9kbDExZEFTdXFRVzVVczk3blFJZyJ9.kuMqnLQVA8HMPEUeCiQKt2vflkinwqjDSbg4qmvYIugjF-1urnukq7tjCbJgA5qJa1EeqFMx4NDTC-VTrz8ECA`, // Replace with the actual access token
    //             },
    //         } );
    //         alert( `Meeting Created! ID: ${response.data.id}` );
    //         console.log( response.data )
    //     } catch ( error ) {
    //         console.error( 'Error creating meeting', error.response.data );
    //     }
    // };

    return (
        <div>
            {/* <Button variant='success' className='mt-2 me-2' onClick={ retrieveDetailAkun }>
                Pilih Akun
            </Button>
            <Button variant='primary' className='mt-2' onClick={ redirectToZoomAuth }>
                Buat Meeting
            </Button> */}
        </div>
    );
}

export default ZoomAuth
