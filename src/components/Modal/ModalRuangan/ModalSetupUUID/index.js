import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { ThemeContext } from '../../../../auth';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';


function ModalSetupUUID ( {
    showAddUUID,
    setShowAddUUID,
    ruangid,
    retrieveDetailRuangan,
    tokenUser
} )
{
    const { theme } = useContext( ThemeContext );
    const [ serviceUUID, setServiceUUID ] = useState( '' );
    const [ karakteristikUUID, setKarakteristikUUID ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowAddUUID( false );
        setServiceUUID( '' );
        setKarakteristikUUID( '' );
    };

    const handleSubmitUUID = async ( event ) =>
    {
        event.preventDefault();
        const data = {
            SERVICE_UUID: serviceUUID,
            CHARACTERISTIC_UUID: karakteristikUUID,
        };

        setDisabled( true );
        try {
            const response = await axios.patch( `/manage/ruangan/${ruangid}/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                }

            );

            handleClose();
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil setup UUID',
                showConfirmButton: true,
            } )
            retrieveDetailRuangan();
            setDisabled( false );
        } catch ( err ) {
            console.error( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat setup UUID',
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
            borderColor: '#ced4da',
        },
    };

    return (
        <Modal
            show={ showAddUUID }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Setup UUID Ruangan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ handleSubmitUUID }>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='serviceUUID'>Service UUID*</Form.Label>
                        <Form.Control
                            id='serviceUUID'
                            type="text"
                            onChange={ ( e ) => setServiceUUID( e.target.value ) }
                            value={ serviceUUID }
                            required
                            placeholder="Masukkan service UUID"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='karakteristikUUID'>Karakteristik UUID*</Form.Label>
                        <Form.Control
                            id='karakteristikUUID'
                            type="text"
                            onChange={ ( e ) => setKarakteristikUUID( e.target.value ) }
                            value={ karakteristikUUID }
                            required
                            placeholder="Masukkan karakteristik UUID"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4">
                        <Button
                            type="submit"
                            id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                            variant='btn'
                            disabled={ disabled || !serviceUUID || !karakteristikUUID }
                        >
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalSetupUUID
