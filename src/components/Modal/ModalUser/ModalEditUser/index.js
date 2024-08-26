import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { ThemeContext } from '../../../../auth';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Formik } from 'formik';

function ModalEditUser ( {
    showEditUser,
    setShowEditUser,
    rowSelected,
    retrieveUser,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowEditUser( false );
    };

    const defaultValue = {

        first_name: rowSelected?.first_name || "",
        last_name: rowSelected?.last_name || "",
        username: rowSelected?.username || "",
        email: rowSelected?.email || "",
    };

    const handleSubmitUser = async ( values ) =>
    {

        // console.log( values );
        setDisabled( true );
        try {
            const response = await axios.patch( `/auth/user-retrieve/${rowSelected.id}/`, values,
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
                title: 'Berhasil mengubah user',
                showConfirmButton: true,
            } )
            retrieveUser();
            setDisabled( false );
        } catch ( err ) {
            console.error( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah user',
            } );
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
            borderColor: '#ced4da', // Initial border color
        },
    };

    return (
        <Modal
            show={ showEditUser }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium' } }>
                    Ubah User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={ defaultValue }
                    enableReinitialize={ true }
                    onSubmit={ handleSubmitUser }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                        setFieldValue,
                    } ) => (
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='firstName'>Nama Depan*</Form.Label>
                                <Form.Control
                                    id='firstName'
                                    type='text'
                                    required
                                    value={ values.first_name }
                                    onChange={ handleChange( "first_name" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='lastName'>Nama Belakang*</Form.Label>
                                <Form.Control
                                    id='lastName'
                                    type='text'
                                    required
                                    value={ values.last_name }
                                    onChange={ handleChange( "last_name" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='userName'>Username*</Form.Label>
                                <Form.Control
                                    id='userName'
                                    type='text'
                                    required
                                    value={ values.username }
                                    onChange={ handleChange( "username" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='email'>Email*</Form.Label>
                                <Form.Control
                                    id='email'
                                    type='email'
                                    required
                                    value={ values.email }
                                    onChange={ handleChange( "email" ) }
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

export default ModalEditUser
