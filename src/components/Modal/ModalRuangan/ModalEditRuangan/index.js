import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../../auth';

function ModalEditRuangan ( {
    showEditRuangan,
    setShowEditRuangan,
    rowSelected,
    retrieveRuangan,
    tokenUser
} )
{
    const { theme } = useContext( ThemeContext );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowEditRuangan( false );

    };

    const defaultValue = {

        gedung: rowSelected?.gedung || "",
        kapasitas: rowSelected?.kapasitas || "",
        lantai: rowSelected?.lantai || "",
        nama_ruangan: rowSelected?.nama_ruangan || "",
        no_ruangan: rowSelected?.no_ruangan || "",
    }

    const handleSubmitRuangan = async ( values ) =>
    {

        // console.log( values );
        setDisabled( true );
        try {
            const response = await axios.patch( `/manage/ruangan/${rowSelected.id}/`, values,
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
                title: 'Berhasil mengubah ruangan',
                showConfirmButton: true,
            } )
            retrieveRuangan();
            setDisabled( false );
        } catch ( err ) {
            console.error( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah ruangan',
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
            show={ showEditRuangan }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium' } }>
                    Ubah Ruangan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={ defaultValue }
                    enableReinitialize={ true }
                    onSubmit={ handleSubmitRuangan }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                        setFieldValue,
                    } ) => (
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='namaGedung'>Gedung*</Form.Label>
                                <Form.Control
                                    id='namaGedung'
                                    type='text'
                                    required
                                    value={ values.gedung }
                                    onChange={ handleChange( "gedung" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='namaRuangan'>Nama Ruangan*</Form.Label>
                                <Form.Control
                                    id='namaRuangan'
                                    type='text'
                                    required
                                    value={ values.nama_ruangan }
                                    onChange={ handleChange( "nama_ruangan" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='nomorRuangan'>No. Ruangan*</Form.Label>
                                <Form.Control
                                    id='nomorRuangan'
                                    type='text'
                                    required
                                    value={ values.no_ruangan }
                                    onChange={ handleChange( "no_ruangan" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='kapasitasRuangan'>Kapasitas Ruangan*</Form.Label>
                                <Form.Control
                                    id='kapasitasRuangan'
                                    type='number'
                                    required
                                    value={ values.kapasitas }
                                    onChange={ handleChange( "kapasitas" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='lantai'>Lantai*</Form.Label>
                                <Form.Control
                                    id='lantai'
                                    type='number'
                                    required
                                    value={ values.lantai }
                                    onChange={ handleChange( "lantai" ) }
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
                    ) }
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default ModalEditRuangan


