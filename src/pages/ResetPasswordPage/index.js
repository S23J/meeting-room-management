import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../api/axios';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

const schema = yup.object().shape( {
    new_password: yup
        .string()
        .required( 'Password di butuhkan!' )
        .min( 8, 'Password setidaknya memiliki 8 karakter!' )
        .max( 16, 'Password tidak boleh lebih dari 16 karakter!' ),
    confirmpassword: yup.string().oneOf( [ yup.ref( 'new_password' ), null ], 'Passwords tidak sama!' ),
} );

function ResetPasswordPage ()
{
    const { userId, token } = useParams();
    const navigate = useNavigate();
    const [ disabled, setDisabled ] = useState( false );

    const [ passwordShown, setPasswordShown ] = useState( false );
    const togglePassword = () =>
    {
        setPasswordShown( !passwordShown );
    };
    const [ confirmPwdShown, setConfirmPwdShown ] = useState( false );
    const toggleConfirmPwd = () =>
    {
        setConfirmPwdShown( !confirmPwdShown );
    };

    const defaultValue = {
        new_password: '',
    }

    const handleSubmitResetPassword = async ( values ) =>
    {
        const { confirmpassword, ...restData } = values;
        setDisabled( true );
        const finalData = Object.assign( {}, restData, {
            uid: userId,
            token: token
        } );
        try {
            const response = await axios.post( `/auth/password-reset/`, finalData,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    },
                }

            );
            Swal.fire( {
                icon: 'success',
                title: 'Reset password berhasil',
                showConfirmButton: false,
                text: `${response.data.message}`,
                timer: 2500,
            } );
            navigate( '/' );
        } catch ( err ) {
            console.error( err );
            if ( !err?.response ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan pada server',
                } )
                setDisabled( false );
            } else if ( err?.response.status === 400 ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid token',
                } )
                setDisabled( false );
            }
        }
    };


    return (
        <Container
            fluid
            className='vh-100 d-flex align-items-center justify-content-center'
            style={ { backgroundColor: '#eaeaea' } }
        >
            <div
                id='cardResetPassword'
                className='my-5'
            >
                <h5 className='mt-3 text-center' style={ { fontFamily: 'Poppins-SemiBold' } }>Reset Password</h5>
                <Formik
                    initialValues={ defaultValue }
                    validationSchema={ schema }
                    onSubmit={ handleSubmitResetPassword }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    } ) => (
                        <Form className='mx-3' onSubmit={ handleSubmit }>
                            <Form.Label className='mb-3' style={ formStyles.label } htmlFor='newPassword'>Password Baru*</Form.Label>
                            <Form.Group >
                                <Form.Control
                                    id='new_password'
                                    type={ passwordShown ? "text" : "password" }
                                    placeholder="Masukkan Password Baru"
                                    value={ values.new_password }
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.new_password }
                                    required
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', minHeight: '50px' } }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.new_password }
                                </Form.Control.Feedback>
                                <p
                                    className='mt-2'
                                    onClick={ togglePassword }
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', cursor: 'pointer', maxWidth: '250px' } }
                                >
                                    { passwordShown ? "Hide " : "Show " }
                                    password
                                    <span>
                                        { passwordShown
                                            ?
                                            <Icon className='ms-1' path={ mdiEyeOff } size={ 0.8 } />
                                            :
                                            <Icon className='ms-1' path={ mdiEye } size={ 0.8 } />
                                        }
                                    </span>
                                </p>
                            </Form.Group>
                            <Form.Label className='mb-3' style={ formStyles.label } htmlFor='confirmpassword'>Konfirmasi Password*</Form.Label>
                            <Form.Group >
                                <Form.Control
                                    id='confirmpassword'
                                    type={ confirmPwdShown ? "text" : "password" }
                                    placeholder="Masukkan Konfirmasi Password"
                                    onChange={ handleChange }
                                    isInvalid={ !!errors.confirmpassword }
                                    required
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', minHeight: '50px' } }
                                />
                                <Form.Control.Feedback type="invalid">
                                    { errors.confirmpassword }
                                </Form.Control.Feedback>
                                <p
                                    className='mt-2 mb-4'
                                    onClick={ toggleConfirmPwd }
                                    style={ { color: '#363636', fontFamily: 'Poppins-Regular', cursor: 'pointer', maxWidth: '250px' } }
                                >
                                    { confirmPwdShown ? "Hide " : "Show " }
                                    password
                                    <span >
                                        { confirmPwdShown
                                            ?
                                            <Icon className='ms-1' path={ mdiEyeOff } size={ 0.8 } />
                                            :
                                            <Icon className='ms-1' path={ mdiEye } size={ 0.8 } />
                                        }
                                    </span>
                                </p>
                            </Form.Group>
                            <div className="d-grid gap-2 my-4">
                                <Button
                                    type="submit"
                                    id='actionButton'
                                    variant='btn'
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    ) }
                </Formik>
            </div>
        </Container>
    )
}

export default ResetPasswordPage

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
