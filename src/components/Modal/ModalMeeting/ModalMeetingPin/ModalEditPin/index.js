import React from 'react';
import { Formik } from 'formik';
import axios from '../../../../../api/axios';
import Swal from 'sweetalert2';
import { Button, Form, Modal } from 'react-bootstrap';

function ModalEditPin ( {
    showEditPin,
    setShowEditPin,
    meeting,
    meetingid,
    retrieveDetailMeeting,
    tokenUser
} )
{

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
        } catch ( err ) {
            console.log( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah kode pin',
            } )
        }

    }


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
                                <Form.Label style={ formStyles.label } htmlFor='pinCode'>Kode PIN*</Form.Label>
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
                                    id='actionButtonModal'
                                    variant='btn'
                                // disabled={ disabled }
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


const formStyles = {
    label: {
        fontFamily: 'Poppins-Medium',
        color: '#222',
    },
    input: {
        color: '#222',
        fontFamily: 'Poppins-Regular',
        minHeight: '50px',
        borderColor: '#ced4da', // Initial border color
    },
};
