import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../../../auth';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
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
    const [ isSubmitting, setIsSubmitting ] = useState( false );

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
        { value: 'Google Meet', label: 'Google Meet' },
        { value: 'Zoom', label: 'Zoom' },
    ];

    const handleSelectPlatform = selectedOption =>
    {
        setSelectedPlatform( selectedOption );
    };


    const redirectAuth = ( event ) =>
    {
        event.preventDefault();
        setIsSubmitting( true );
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

        const handleMessage = ( event ) =>
        {
            if ( event.origin !== window.location.origin ) return; 

            if ( event.data.type === "gmeet-auth-success" || event.data.type === "zoom-auth-success" ) {
                const { refreshToken } = event.data;
                window.sessionStorage.setItem( "refresh_token", JSON.stringify( refreshToken ) );

                submitData();
            }
            setIsSubmitting( false );
            setDisabled( false );
            window.removeEventListener( "message", handleMessage );
        };

        if ( selectedPlatform?.value === "Google Meet" ) {
            const getData = window.sessionStorage.getItem( "data" );
            const getDataParse = JSON.parse( getData );

            const clientId = getDataParse?.client_id;
            const redirectUri = `http://localhost:3000/callback`;
            const scope = 'https://www.googleapis.com/auth/calendar';

            const GMeetAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent( redirectUri )}&scope=${encodeURIComponent( scope )}&access_type=offline&prompt=consent`;

            window.open( GMeetAuthUrl, "_blank", "width=500,height=600" );

        } else if ( selectedPlatform?.value === "Zoom" ) {
            const getData = window.sessionStorage.getItem( "data" );
            const getDataParse = JSON.parse( getData );

            const clientId = getDataParse?.client_id;
            const redirectUri = `http://localhost:3000/callback`;
            const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent( redirectUri )}`;

            window.open( zoomAuthUrl, "_blank", "width=500,height=600" );
        }
        setDisabled( false );
        window.addEventListener( "message", handleMessage );
    };

    const submitData = async () =>
    {

        const getData = window.sessionStorage.getItem( "data" );
        const getDataParse = JSON.parse( getData );
        const getRefreshToken = window.sessionStorage.getItem( "refresh_token" );
        const refreshToken = JSON.parse( getRefreshToken );

        const finalData = {
            account: getDataParse?.account,
            client_id: getDataParse?.client_id,
            client_secret: getDataParse?.client_secret,
            calendar_id: getDataParse?.calendar_id,
            platform: getDataParse?.platform,
            ruangan: ruangid,
            auth_code: refreshToken,
        };
        setIsSubmitting( true );
        setDisabled( true );
        try {
            const response = await axios.post( `/manage/omplatform/`, finalData, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },
            }
            );

            window.sessionStorage.removeItem( 'data' );
            window.sessionStorage.removeItem( 'refresh_token' );
            handleClose();
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil menambahkan Akun',
                showConfirmButton: true,
            } )
            retrieveAkun();
            setIsSubmitting( false );
            setDisabled( false );
        } catch ( err ) {
            console.error( err )
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat menambahkan Akun',
            } );
            setIsSubmitting( false );
            setDisabled( false );
        }

    };

    const formStyles = {
        label: {
            fontFamily: 'Poppins-Medium',
            color: theme === 'light' ? '#FFFFFF' : '#222222',
        },
        input: {
            color: theme === 'light' ? '#FFFFFF' : '#222222',
            fontFamily: 'Poppins-Regular',
            minHeight: '50px',
            borderColor: '#ced4da',
        },
    };

    const selectStyles = {
        control: ( provided, state ) => ( {
            ...provided,
            minHeight: '50px',
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
            color: theme === 'light' ? ( state.isFocused ? 'red' : 'white' ) : ( state.isFocused ? 'red' : '#222' ),
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
                    { selectedPlatform?.value === 'Google Meet' && (
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
                        { isSubmitting ? (
                            <Button
                                id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                                variant='btn'
                                disabled
                            >
                                <Spinner
                                    animation="border"
                                    size='sm'
                                />
                            </Button>
                        ) : (
                                <Button
                                    onClick={ redirectAuth }
                                    id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                                    disabled={ disabled || !accountEmail || !selectedPlatform?.value || !clientID || !clientSecret }
                                    variant='btn'
                                >
                                    Simpan
                                </Button>
                        ) }
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalAddAkun
