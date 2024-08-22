import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../../auth';

function ModalAddPerlengkapan ( {
    showAddAlat,
    setShowAddAlat,
    ruangid,
    retrieveDetailEquipment,
    tokenUser
} )
{
    const { theme } = useContext( ThemeContext );
    const [ alat, setAlat ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowAddAlat( false );
        setAlat( '' );
    };

    const handleSubmitPeralatan = async ( event ) =>
    {
        event.preventDefault();
        const data = {
            nama_equipment: alat,
            ruangan: ruangid,
        };
        // console.log( data );
        setDisabled( true );
        try {
            const response = await axios.post( `/manage/equipment/`, data,
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
                title: 'Berhasil menambahkan peralatan',
                showConfirmButton: true,
            } )
            retrieveDetailEquipment();
            setDisabled( false );
        } catch ( err ) {
            console.log( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan menambahkan peralatan',
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
            show={ showAddAlat }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Tambah Peralatan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ handleSubmitPeralatan }>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='alat'>Nama Peralatan*</Form.Label>
                        <Form.Control
                            id='alat'
                            type="text"
                            onChange={ ( e ) => setAlat( e.target.value ) }
                            value={ alat }
                            required
                            placeholder="Masukkan nama peralatan"
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

export default ModalAddPerlengkapan


