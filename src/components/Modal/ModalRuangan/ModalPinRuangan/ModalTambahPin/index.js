import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import axios from '../../../../../api/axios';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../../../auth';

function ModalTambahPin ( {
    showAddPin,
    setShowAddPin,
    ruangid,
    retrieveDetailRuangan,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const [ pinCode, setPinCode ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowAddPin( false );
        setPinCode( '' );
    };

    const handleSubmitPin = async ( event ) =>
    {
        event.preventDefault();
        const data = {
            pincode: pinCode,
        };
        // console.log( data );
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
            // console.log( response );
            handleClose();
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil menambahkan kode pin',
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
                text: 'Terjadi kesalahan saat menambahkan kode pin',
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
            show={ showAddPin }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Tambah Pin
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ handleSubmitPin }>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='pinCode'>Kode Pintu*</Form.Label>
                        <Form.Control
                            id='pinCode'
                            type="text"
                            onChange={ ( e ) => setPinCode( e.target.value ) }
                            value={ pinCode }
                            maxLength={ 6 }
                            required
                            placeholder="Masukkan kode pin"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4">
                        <Button
                            type="submit"
                            id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                            variant='btn'
                            disabled={ disabled || !pinCode }
                        >
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    )
}

export default ModalTambahPin