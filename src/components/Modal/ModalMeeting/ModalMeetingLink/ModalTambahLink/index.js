import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import axios from '../../../../../api/axios';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../../../auth';

function ModalTambahLink ( {
    showAddLink,
    setShowAddLink,
    meetingid,
    retrieveDetailMeeting,
    tokenUser
} )
{
    const { theme } = useContext( ThemeContext );
    const [ linkMeeting, setLinkMeeting ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowAddLink( false );
        setLinkMeeting( '' );
    };

    const handleSubmitPin = async ( event ) =>
    {
        event.preventDefault();
        const data = {
            link_meeting: linkMeeting,
        };
        // console.log( data );
        setDisabled( true );
        try {
            const response = await axios.patch( `/manage/requests/${meetingid}/`, data,
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
                title: 'Berhasil menambahkan link',
                showConfirmButton: true,
            } )
            retrieveDetailMeeting();
            setDisabled( false );
        } catch ( err ) {
            console.log( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat menambahkan link',
            } );
            setDisabled( false );
        }

    }

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


    return (
        <Modal
            show={ showAddLink }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Tambah Link Meeting
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ handleSubmitPin }>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='link'>Link Meeting*</Form.Label>
                        <Form.Control
                            id='link'
                            type="text"
                            as="textarea"
                            rows={ 3 }
                            onChange={ ( e ) => setLinkMeeting( e.target.value ) }
                            value={ linkMeeting }
                            required
                            placeholder="Masukkan link meeting"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4">
                        <Button
                            type="submit"
                            id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                            variant='btn'
                            disabled={ disabled }
                        >
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    )
}

export default ModalTambahLink
