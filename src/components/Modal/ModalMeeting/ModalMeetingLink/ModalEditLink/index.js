import React, { useContext } from 'react';
import { Formik } from 'formik';
import axios from '../../../../../api/axios';
import Swal from 'sweetalert2';
import { Button, Form, Modal } from 'react-bootstrap';
import { ThemeContext } from '../../../../../auth';

function ModalEditLink ( {
    showEditLink,
    setShowEditLink,
    meeting,
    meetingid,
    retrieveDetailMeeting,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const handleClose = () =>
    {
        setShowEditLink( false );
    };

    const defaultValue = {

        link_meeting: meeting?.link_meeting || "",
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
                title: 'Berhasil mengubah link',
                showConfirmButton: true,
            } )
            retrieveDetailMeeting();
        } catch ( err ) {
            console.log( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah link',
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

    return (
        <Modal
            show={ showEditLink }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Ubah Link Meeting
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
                                <Form.Label style={ formStyles.label } htmlFor='link'>Link Meeting*</Form.Label>
                                <Form.Control
                                    id='link'
                                    type='text'
                                    as="textarea"
                                    rows={ 3 }
                                    required
                                    value={ values.link_meeting }
                                    onChange={ handleChange( "link_meeting" ) }
                                    style={ formStyles.input }
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
                    ) }
                </Formik>
            </Modal.Body>

        </Modal>
    )
}

export default ModalEditLink;