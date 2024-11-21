import React, { useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import Swal from 'sweetalert2';
import axios from '../../../api/axios';

function ModalLupaPassword ( {
    showLupaPassword,
    setShowLupaPassword
} )
{
    const [ email, setEmail ] = useState( "" );
    const [ disabled, setDisabled ] = useState( false );
    const [ isSubmitting, setIsSubmitting ] = useState( false );

    const handleCloseLupaPassword = () =>
    {
        setShowLupaPassword( false );
        setEmail( '' );
    };

    const handleSubmitEmail = async ( event ) =>
    {
        event.preventDefault();
        setIsSubmitting( true );
        const data = {
            email: email,
        }
        setDisabled( true );
        try {
            const response = await axios.post( `auth/request-reset-password/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    },
                }

            );
            handleCloseLupaPassword();
            Swal.fire( {
                icon: 'success',
                title: 'Reset password diterima',
                text: `${response.data.message}`,
                showConfirmButton: true,
            } )
            setIsSubmitting( false );
            setDisabled( false );
        } catch ( err ) {
            console.error( err )
            if ( err ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan pada server',
                } );
                setIsSubmitting( false );
                setDisabled( false )
            } else if ( err?.response.status === 400 ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Oops...',
                    text: `${err.response?.data.email[ 0 ]}`,
                } );
                setIsSubmitting( false );
                setDisabled( false );
            }


        }
    };

    return (
        <Modal
            show={ showLupaPassword }
            onHide={ handleCloseLupaPassword }
            backdrop="static"
            keyboard={ false }
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium' } }>
                    Lupa Password
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ handleSubmitEmail }>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='emailRecovery'>Email*</Form.Label>
                        <Form.Control
                            id='email'
                            type="email"
                            onChange={ ( e ) => setEmail( e.target.value ) }
                            value={ email }
                            required
                            placeholder="Masukkan email anda"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <div className="d-grid gap-2 my-4">
                        { isSubmitting ? (
                            <Button
                                id='actionButton'
                                variant='btn'
                                className='mb-4'
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
                                    id='actionButton'
                                    variant='btn'
                                    disabled={ disabled || !email }
                                >
                                    Submit
                                </Button>
                        ) }
                    </div>
                </Form>
            </Modal.Body>

        </Modal>
    )
}

export default ModalLupaPassword

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