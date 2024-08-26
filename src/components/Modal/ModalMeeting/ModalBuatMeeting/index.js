import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { ThemeContext } from '../../../../auth';
import axios from '../../../../api/axios';
import Select from 'react-select';
import Swal from 'sweetalert2';

function ModalBuatMeeting ( {
    showAddNewMeeting,
    setShowAddMeeting,
    meetingid,
    retrieveDetailMeeting,
    detailRuangan,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const [ listAkun, setListAkun ] = useState( [] );
    const [ selectedPlatform, setSelectedPlatform ] = useState( null );
    const [ detailAkun, setDetailAkun ] = useState( null );
    const [ meetingTopic, setMeetingTopic ] = useState( '' );
    const [ meetingStartTime, setMeetingStartTime ] = useState( '' );
    const [ meetingDuration, setMeetingDuration ] = useState( '' );
    const [ meetingAgenda, setMeetingAgenda ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowAddMeeting( false );
        setSelectedPlatform( null );
        setMeetingTopic( '' );
        setMeetingStartTime( '' );
        setMeetingDuration( '' );
        setMeetingAgenda( '' );
    };

    const retrieveAkun = () =>
    {
        axios.get( `/manage/omplatform/filter_by_ruangan/?ruangan_id=${detailRuangan?.id}`,
            {
                headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                setListAkun( res.data );
            } ).catch( err =>
            {
                console.error( err )
            } )
    };

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( tokenUser !== undefined ) {
                if ( detailRuangan?.id !== undefined ) {
                    await retrieveAkun();
                }
            }
        };

        fetchData();
    }, [ tokenUser, detailRuangan?.id ] );

    const platformOptions = listAkun.map( akun => ( {
        value: akun.id,
        label: akun.account + ' || ' + akun.platform,
    } ) );

    const handleSelectPlatform = selectedOption =>
    {
        setSelectedPlatform( selectedOption );
    };

    const retrieveDetailAkun = async () =>
    {
        try {
            const res = await axios.get( `/manage/omplatform/${selectedPlatform?.value}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ${tokenUser}`,
                },
            } );
            setDetailAkun( res.data );

            // console.log( res.data );
        } catch ( err ) {
            console.error( err );
        }
    };

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( tokenUser !== undefined ) {
                if ( selectedPlatform?.value !== undefined ) {
                    await retrieveDetailAkun();
                }
            }
        };

        fetchData();
    }, [ tokenUser, selectedPlatform?.value ] );


    const handleSubmitUser = async ( event ) =>
    {
        event.preventDefault();

        const dataBody = new URLSearchParams( {
            grant_type: 'refresh_token',
            refresh_token: detailAkun?.auth_code,
        } );

        try {
            const response = await axios.post( 'https://zoom.us/oauth/token', dataBody.toString(), {
                headers: {
                    Authorization: `Basic ${btoa( `${detailAkun?.client_id}:${detailAkun?.client_secret}` )}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            } );

            const winLocal = window.sessionStorage
            winLocal.setItem( "zoom_new_access_token", JSON.stringify( response.data.access_token ) );

        } catch ( error ) {
            console.error( error.response );
        };

        const localDate = new Date( meetingStartTime );

        const offsetInMinutes = localDate.getTimezoneOffset();
        const offsetInMilliseconds = offsetInMinutes * 60 * 1000;

        const utcDate = new Date( localDate.getTime() - offsetInMilliseconds );

        const utcDateString = utcDate.toISOString();

        const data = {
            topic: meetingTopic,
            type: 2,
            start_time: utcDateString,
            duration: meetingDuration,
            timezone: 'Asia/Jakarta',
            agenda: meetingAgenda
        };

        try {

            const getAccessToken = window.sessionStorage.getItem( "zoom_new_access_token" );
            const accessToken = JSON.parse( getAccessToken );

            const responseNewMeeting = await axios.post( `https://api.zoom.us/v2/users/me/meetings`, data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Replace with the actual access token
                    },
                }

            );
            // console.log( responseNewMeeting );
            window.sessionStorage.removeItem( "zoom_new_access_token" );

            const dataLink = {
                link_meeting: responseNewMeeting?.data.join_url,
            };

            try {
                const response = await axios.patch( `/manage/requests/${meetingid}/`, dataLink,
                    {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json',
                            withCredentials: true,
                            Authorization: `Token ` + tokenUser,
                        },
                    }

                );
                // console.log( response );

                handleClose();
                Swal.fire( {
                    icon: 'success',
                    title: 'Berhasil membuat Meeting',
                    showConfirmButton: true
                } );
                retrieveDetailMeeting();
                setDisabled( false );

            } catch ( err ) {
                console.error( err.response );
                // setDisabled( false );
            }

        } catch ( err ) {
            console.error( err.response );
            Swal.fire( {
                icon: 'success',
                title: 'Warning',
                text: 'Terjadi kesalahan saat membuat Meeting',
                showConfirmButton: true
            } );
            setDisabled( false );
        };

    };


    const formStyles = {
        label: {
            fontFamily: 'Poppins-Medium',
        },
        input: {

            fontFamily: 'Poppins-Regular',
            minHeight: '50px',
            borderColor: '#ced4da', // Initial border color
            backgroundColor: theme === 'light' ? '#222' : '#FFFFFF',
            color: theme === 'light' ? '#FFFFFF' : '#222'
        },
        button: {
            height: '50px',
        },
    };

    // Custom styles for react-select
    const selectStyles = {
        control: ( provided, state ) => ( {
            ...provided,
            minHeight: '50px', // Adjust the height as needed
            border: state.isFocused ? '1px solid #80bdff' : '1px solid #ced4da',
            boxShadow: state.isFocused ? '0 0 0 0.3rem rgba(0, 123, 255, 0.25)' : null,
            '&:hover': {
                borderColor: '#80bdff',
            },
            fontFamily: 'Poppins-Regular'
        } ),
        singleValue: ( provided, state ) => ( {
            ...provided,
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
            show={ showAddNewMeeting }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Buat Meeting
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='endTime'>Pilih Akun Platform</Form.Label>
                        <Select
                            id='platform'
                            options={ platformOptions }
                            value={ selectedPlatform }
                            onChange={ handleSelectPlatform }
                            styles={ selectStyles }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='meetingTopic'>Topik Meeting*</Form.Label>
                        <Form.Control
                            id='meetingTopic'
                            type="text"
                            onChange={ ( e ) => setMeetingTopic( e.target.value ) }
                            value={ meetingTopic }
                            required
                            placeholder="Masukkan topik meeting"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='startMeeting'>Mulai Meeting*</Form.Label>
                        <Form.Control
                            id='startMeeting'
                            type="datetime-local"
                            onChange={ ( e ) => setMeetingStartTime( e.target.value ) }
                            value={ meetingStartTime }
                            required
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='meetingDuration'>Durasi Meeting*</Form.Label>
                        <Form.Control
                            id='meetingDuration'
                            type="number"
                            onChange={ ( e ) => setMeetingDuration( e.target.value ) }
                            value={ meetingDuration }
                            required
                            placeholder="Masukkan topik meeting"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='meetingAgenda'>Agenda Meeting</Form.Label>
                        <Form.Control
                            id='meetingAgenda'
                            type="text"
                            onChange={ ( e ) => setMeetingAgenda( e.target.value ) }
                            value={ meetingAgenda }
                            placeholder="Masukkan topik meeting"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4">
                        <Button
                            onClick={ handleSubmitUser }
                            id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                            variant='btn'
                            disabled={ disabled || !selectedPlatform?.value || !meetingTopic || !meetingStartTime || !meetingDuration }
                        >
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    )
}

export default ModalBuatMeeting
