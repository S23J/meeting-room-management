import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import axios from '../../../../../api/axios';
import Swal from 'sweetalert2';
import { Button, Form, Modal } from 'react-bootstrap';
import { ThemeContext } from '../../../../../auth';

function ModalEditPin ( {
    showEditPin,
    setShowEditPin,
    meeting,
    meetingid,
    retrieveDetailMeeting,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const [ disabled, setDisabled ] = useState( false );

    const handleClose = () =>
    {
        setShowEditPin( false );
    };

    const defaultValue = {

        pincode: meeting?.pincode || "",
    }

    const handleSubmitPin = async ( values ) =>
    {

        // console.log( values );
        setDisabled( true );
        try {
            const response = await axios.patch( `/manage/requests/${meetingid}/`, values,
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
                title: 'Berhasil mengubah kode pin',
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
                text: 'Terjadi kesalahan saat mengubah kode pin',
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
            show={ showEditPin }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium' } }>
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

export default ModalEditPin;