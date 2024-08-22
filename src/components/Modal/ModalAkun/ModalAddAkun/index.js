import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, ThemeContext } from '../../../../auth';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';

function ModalAddAkun ( {
    showAddAkun,
    setShowAddAkun,
    ruangid,
    retrieveAkun,
    tokenUser
} )
{
    const { theme } = useContext( ThemeContext );
    const [ accountEmail, setAccountEmail ] = useState( '' );
    const [ selectedPlatform, setSelectedPlatform ] = useState( null );
    const [ clientID, setClientID ] = useState( '' );
    const [ clientSecret, setClientSecret ] = useState( '' );
    const [ calendarID, setCalendarID ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowAddAkun( false );
        setSelectedPlatform( null );
        setAccountEmail( '' );
        setClientID( '' );
        setClientSecret( '' );
        setCalendarID( '' );
    };

    const platformOptions = [
        { value: 'Zoom', label: 'Zoom' },
        { value: 'Google Meeting', label: 'Google Meeting' },
    ];

    const handleSelectPlatform = selectedOption =>
    {
        setSelectedPlatform( selectedOption );
    };

    // const [ authCode, setAuthCode ] = useState( null );
    // const [ hasSubmitted, setHasSubmitted ] = useState( false ); // Track if submitData has already been called

    const [ authCodeGmeet, setAuthCodeGmeet ] = useState( null );
    const [ hasSubmittedGmeet, setHasSubmittedGmeet ] = useState( false );

    const handleAuthGmeet = async ( event ) =>
    {
        event.preventDefault();

        const data = {
            account: accountEmail,
            client_id: clientID,
            client_secret: clientSecret,
            calendar_id: calendarID,
            platform: selectedPlatform?.value,
            ruangan: ruangid,
        };

        window.sessionStorage.setItem( "data", JSON.stringify( data ) );
        setDisabled( true );

        const redirectUri = `https://oauth.pstmn.io/v1/callback`;
        const scope = 'https://www.googleapis.com/auth/calendar';
        const GMeetAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientID}&redirect_uri=${encodeURIComponent( redirectUri )}&scope=${encodeURIComponent( scope )}&access_type=offline&prompt=consent`;

        // Open the OAuth process in a new window
        const authWindow = window.open( GMeetAuthUrl, "_blank", "width=500,height=600" );

        // Listen for messages from the new window
        const handleMessage = ( event ) =>
        {
            if ( event.origin !== window.location.origin ) return; // Ensure the message is from your own domain

            if ( event.data.type === "gmeet-auth-success" && !hasSubmittedGmeet ) {
                const { refreshToken } = event.data;
                window.sessionStorage.setItem( "refresh_token", JSON.stringify( refreshToken ) );
                setHasSubmittedGmeet( true ); // Mark that submission has happened
                submitData( refreshToken );
            }

            setDisabled( false );
            window.removeEventListener( "message", handleMessage ); // Remove the event listener after use
        };

        window.addEventListener( "message", handleMessage );
    };


    // In the new window, after the token is obtained (modify your OAuth callback script to include this)
    const exchangeCodeGmeetForToken = async ( code ) =>
    {
        const getData = window.sessionStorage.getItem( "data" );
        const getDataParse = JSON.parse( getData );
        const redirectUri = `https://oauth.pstmn.io/v1/callback`;

        const dataBody = new URLSearchParams( {
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            client_id: getDataParse?.client_id,
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
                type: "zoom-auth-success",
                refreshToken: response.data.refresh_token,
            }, window.location.origin );

            // Close the new window after sending the message
            window.close();

        } catch ( error ) {
            console.error( 'Error fetching access token', error.response.data );
        }
    };


    // // Handles authentication process and redirect to Zoom
    // const handleAuth = async ( event ) =>
    // {
    //     event.preventDefault();

    //     const data = {
    //         account: accountEmail,
    //         client_id: clientID,
    //         client_secret: clientSecret,
    //         calendar_id: calendarID,
    //         platform: selectedPlatform?.value,
    //         ruangan: ruangid,
    //     };

    //     window.sessionStorage.setItem( "data", JSON.stringify( data ) );
    //     setDisabled( true );

    //     const redirectUri = `http://localhost:3000/detail-ruangan/${ruangid}`;
    //     const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${encodeURIComponent( redirectUri )}`;

    //     // Open the OAuth process in a new window
    //     const authWindow = window.open( zoomAuthUrl, "_blank", "width=500,height=600" );

    //     // Listen for messages from the new window
    //     const handleMessage = ( event ) =>
    //     {
    //         if ( event.origin !== window.location.origin ) return; // Ensure the message is from your own domain

    //         if ( event.data.type === "zoom-auth-success" && !hasSubmitted ) {
    //             const { refreshToken } = event.data;
    //             window.sessionStorage.setItem( "refresh_token", JSON.stringify( refreshToken ) );
    //             setHasSubmitted( true ); // Mark that submission has happened
    //             submitData( refreshToken );
    //         }

    //         setDisabled( false );
    //         window.removeEventListener( "message", handleMessage ); // Remove the event listener after use
    //     };

    //     window.addEventListener( "message", handleMessage );
    // };

    // // In the new window, after the token is obtained (modify your OAuth callback script to include this)
    // const exchangeCodeForToken = async ( code ) =>
    // {
    //     const getData = window.sessionStorage.getItem( "data" );
    //     const getDataParse = JSON.parse( getData );
    //     const redirectUri = `http://localhost:3000/detail-ruangan/${ruangid}`;

    //     const dataBody = new URLSearchParams( {
    //         code: code,
    //         grant_type: 'authorization_code',
    //         redirect_uri: redirectUri,
    //     } );

    //     try {
    //         const response = await axios.post( 'https://zoom.us/oauth/token', dataBody.toString(), {
    //             headers: {
    //                 Authorization: `Basic ${btoa( `${getDataParse?.client_id}:${getDataParse?.client_secret}` )}`,
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //         } );

    //         // Send the refresh token back to the original page
    //         window.opener.postMessage( {
    //             type: "zoom-auth-success",
    //             refreshToken: response.data.refresh_token,
    //         }, window.location.origin );

    //         // Close the new window after sending the message
    //         window.close();

    //     } catch ( error ) {
    //         console.error( 'Error fetching access token', error.response.data );
    //     }
    // };

    // Submits data to the backend
    const submitData = async ( refreshToken ) =>
    {
        const getData = window.sessionStorage.getItem( "data" );
        const getDataParse = JSON.parse( getData );

        if ( !refreshToken ) {
            Alert( "Refresh token is not available." );
            return;
        }

        const finalData = {
            account: getDataParse?.account,
            client_id: getDataParse?.client_id,
            client_secret: getDataParse?.client_secret,
            calendar_id: getDataParse?.calendar_id,
            platform: getDataParse?.platform,
            ruangan: ruangid,
            auth_code: refreshToken, // Include the refresh token
        };

        try {
            const response = await axios.post( `/manage/omplatform/`, finalData, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },
            } );

            // console.log( response );
            handleClose();
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil menambahkan Akun',
                showConfirmButton: true
            } );
            const result = await Swal.fire( {
                icon: 'success',
                title: 'Berhasil menambahkan Akun',
                showConfirmButton: true
            } );

            if ( result.isConfirmed ) {
                try {
                    window.sessionStorage.removeItem( 'data' );
                    window.sessionStorage.removeItem( 'refresh_token' );
                } catch ( err ) {
                    console.log( err )

                }
            }
            retrieveAkun();
            setDisabled( false );
        } catch ( error ) {
            console.error( error.response.data );
            Swal.fire( {
                icon: 'success',
                title: 'Warning',
                text: 'Terjadi kesalahan saat menambahkan Akun',
                showConfirmButton: true
            } );
            setDisabled( false );
        }
    };

    // useEffect to handle OAuth callback in the new window
    // useEffect( () =>
    // {
    //     const urlParams = new URLSearchParams( window.location.search );
    //     const code = urlParams.get( 'code' );
    //     if ( code && !hasSubmitted ) {
    //         setAuthCode( code );
    //         exchangeCodeForToken( code );
    //     }
    // }, [ hasSubmitted ] );

    // useEffect to handle OAuth callback in the new window
    useEffect( () =>
    {
        const urlParams = new URLSearchParams( window.location.search );
        const code = urlParams.get( 'code' );
        if ( code && !hasSubmittedGmeet ) {
            setAuthCodeGmeet( code );
            exchangeCodeGmeetForToken( code );
        }
    }, [ hasSubmittedGmeet ] );


    const formStyles = {
        label: {
            fontFamily: 'Poppins-Medium',
            color: theme === 'light' ? '#FFFFFF' : '#222222',
        },
        input: {
            color: theme === 'light' ? '#FFFFFF' : '#222222',
            fontFamily: 'Poppins-Regular',
            minHeight: '50px',
            borderColor: '#ced4da', // Initial border color
        },
    };

    // Custom styles for react-select
    const selectStyles = {
        control: ( provided, state ) => ( {
            ...provided,
            minHeight: '50px', // Adjust the height as needed
            border: state.isFocused ? '1px solid #80bdff' : '1px solid #ced4da',
            background: theme === 'light' ? '#212529' : '#FFFFFF',
            boxShadow: state.isFocused ? '0 0 0 0.3rem rgba(0, 123, 255, 0.25)' : null,
            '&:hover': {
                borderColor: '#80bdff',
            },
            fontFamily: 'Poppins-Regular'
        } ),
        singleValue: ( provided, state ) => ( {
            ...provided,
            color: theme === 'light' ? ( state.isFocused ? 'red' : 'white' ) : ( state.isFocused ? 'red' : '#222' ), // Conditional text color based on theme and focus
        } ),
        option: ( provided, state ) => ( {
            ...provided,
            color: state.isSelected ? '#fff' : '#333',
            background: state.isSelected ? '#007bff' : '#fff',
            fontFamily: 'Poppins-Regular'
        } ),
    };

    return (
        <Modal
            show={ showAddAkun }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton >
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Tambah Akun
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form >
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='account'>Email Akun*</Form.Label>
                        <Form.Control
                            id='account'
                            type="email"
                            onChange={ ( e ) => setAccountEmail( e.target.value ) }
                            value={ accountEmail }
                            required
                            placeholder="Masukkan akun email"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='platform'>Platform*</Form.Label>
                        <Select
                            id='platform'
                            options={ platformOptions }
                            value={ selectedPlatform }
                            onChange={ handleSelectPlatform }
                            styles={ selectStyles }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='client_id'>Client ID*</Form.Label>
                        <Form.Control
                            id='client_id'
                            type="text"
                            onChange={ ( e ) => setClientID( e.target.value ) }
                            value={ clientID }
                            required
                            placeholder="Masukkan client Id"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='client_secret'>Client Secret*</Form.Label>
                        <Form.Control
                            id='client_secret'
                            type="text"
                            onChange={ ( e ) => setClientSecret( e.target.value ) }
                            value={ clientSecret }
                            required
                            placeholder="Masukkan client Secret"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    { selectedPlatform?.value === 'Google Meeting' && (
                        <Form.Group className="mb-3">
                            <Form.Label style={ formStyles.label } htmlFor='calendar_id'>Calendar ID*</Form.Label>
                            <Form.Control
                                id='calendar_id'
                                type="text"
                                onChange={ ( e ) => setCalendarID( e.target.value ) }
                                value={ calendarID }
                                required
                                placeholder="Masukkan calendar Id"
                                style={ formStyles.input }
                            />
                        </Form.Group>
                    ) }
                    <div className="d-grid gap-2 mt-4">
                        <Button
                            onClick={ handleAuthGmeet }
                            id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                            variant='btn'
                            disabled={ disabled || !clientID || !clientSecret || !selectedPlatform }
                        >
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalAddAkun
