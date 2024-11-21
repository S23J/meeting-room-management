import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import axios from '../../../../../api/axios';
import Swal from 'sweetalert2';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { ThemeContext } from '../../../../../auth';

function ModalEditPin ( {
    showEditPin,
    setShowEditPin,
    detailRuangan,
    ruangid,
    retrieveDetailRuangan,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const [ disabled, setDisabled ] = useState( false );
    const [ isSubmitting, setIsSubmitting ] = useState( false );

    const handleClose = () =>
    {
        setShowEditPin( false );
    };

    const defaultValue = {

        pincode: detailRuangan?.pincode || "",
    }

    const handleSubmitPin = async ( values ) =>
    {
        setIsSubmitting( true );
        setDisabled( true );
        try {
            const response = await axios.patch( `/manage/ruangan/${ruangid}/`, values,
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
                title: 'Berhasil mengubah kode pin',
                showConfirmButton: true,
            } )
            retrieveDetailRuangan();
            setIsSubmitting( false );
            setDisabled( false );
        } catch ( err ) {
            console.error( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah kode pin',
            } );
            setIsSubmitting( false );
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
            show={ showEditPin }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Ubah Pin
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={ defaultValue }
                    enableReinitialize={ true }
                    onSubmit={ handleSubmitPin }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                        setFieldValue,
                    } ) => (
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='pinCode'>Kode Pintu*</Form.Label>
                                <Form.Control
                                    id='pinCode'
                                    type='text'
                                    maxLength={ 6 }
                                    required
                                    value={ values.pincode }
                                    onChange={ handleChange( "pincode" ) }
                                    style={ formStyles.input }
                                />
                            </Form.Group>
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
                                            type="submit"
                                            id={ theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight' }
                                            variant='btn'
                                            disabled={ disabled }
                                        >
                                            Simpan
                                        </Button>
                                ) }
                            </div>
                        </Form>
                    ) }
                </Formik>
            </Modal.Body>

        </Modal>
    )
}

export default ModalEditPin;