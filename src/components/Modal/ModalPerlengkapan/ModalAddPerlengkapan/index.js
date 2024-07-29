import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../../auth';

function ModalAddPerlengkapan ( {
    showAddAlat,
    setShowAddAlat,
    listRuangan,
    retrieveAlat,
    retrieveRuangan,
    tokenUser
} )
{
    const { theme } = useContext( ThemeContext );
    const [ alat, setAlat ] = useState( '' );
    const [ selectedRuangan, setSelectedRuangan ] = useState( null );

    const ruanganOptions = listRuangan.map( ruangan => ( {
        value: ruangan?.id,
        label: ruangan?.nama_ruangan,
    } ) );

    const handleSelectRuangan = selectedOption =>
    {
        setSelectedRuangan( selectedOption );
    };

    const handleClose = () =>
    {
        setShowAddAlat( false );
        setAlat( '' );
        setSelectedRuangan( null );
    };

    const handleSubmitPeralatan = async ( event ) =>
    {
        event.preventDefault();
        const data = {
            nama_equipment: alat,
            ruangan: selectedRuangan?.value,
        };
        // console.log( data );
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
            retrieveAlat();
            retrieveRuangan();
        } catch ( err ) {
            console.log( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan menambahkan peralatan',
            } )
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
            backgroundColor: theme === 'light' ? '#212529' : 'FFFFFF',
            fontFamily: 'Poppins-Regular'
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
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='ruangan'>Ruangan*</Form.Label>
                        <Select
                            id='ruangan'
                            options={ ruanganOptions }
                            required
                            value={ selectedRuangan }
                            onChange={ handleSelectRuangan }
                            styles={ selectStyles }
                        />
                    </Form.Group>
                    <div className="d-grid gap-2 mt-4">
                        <Button
                            type="submit"
                            id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                            variant='btn'
                        // disabled={ disabled }
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


