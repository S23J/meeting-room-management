import React, { useContext, useState } from 'react'
import { Button, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap'
import { LoginImages, LogoBundar } from '../../assets';
import { useMediaQuery } from 'react-responsive';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';
import Swal from 'sweetalert2';
import { ModalLupaPassword } from '../../components';
import axios from '../../api/axios';


function Login ()
{

    const [ username, setUser ] = useState( '' );
    const [ password, setPwd ] = useState( '' );
    const { setTokens, setUserInfo } = useContext( AuthContext );
    const [ disabled, setDisabled ] = useState( false );
    const [ isSubmittingLogin, setIsSubmittingLogin ] = useState( false );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const isTablet = useMediaQuery( { minWidth: 600, maxWidth: 1024 } );

    const navigate = useNavigate();
    const [ passwordShown, setPasswordShown ] = useState( false );
    const togglePassword = () =>
    {
        setPasswordShown( !passwordShown );
    };

    const [ showLupaPassword, setShowLupaPassword ] = useState( false );
    const handleShowLupaPassword = () =>
    {
        setShowLupaPassword( true );
    }

    const styleResponsive = {
        minWidth: isMobile ? '90vw' : isTablet ? '75vw' : '75vw',
        maxWidth: isMobile ? '90vw' : isTablet ? '75vw' : '75vw'
    };

    const handleSubmitLogin = async ( event ) =>
    {
        event.preventDefault()
        setIsSubmittingLogin( true );
        setDisabled( true )
        const data = {
            username: username,
            password: password,
        }
        try {
            const response = await axios.post( `/auth/login/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                    },
                }

            );

            if ( response?.data.user_info.group_name === 'administrator' ) {
                const userInfo = response?.data.user_info
                const userToken = response?.data
                setTokens( { token: userToken.token } );
                window.sessionStorage.setItem( "token", JSON.stringify( { token: userToken.token } ) )
                setUserInfo( userInfo );
                window.sessionStorage.setItem( "userInfo", JSON.stringify( userInfo ) )
                Swal.fire( {
                    icon: 'success',
                    title: `Selamat datang ${response?.data.user_info.first_name} ${response?.data.user_info.last_name}`,
                    showConfirmButton: false,
                    timer: 2000
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
                navigate( '/dashboard/' );
            } else {
                Swal.fire( {
                    icon: 'error',
                    title: 'Warning',
                    text: 'Akun tidak punya akes!',
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
            }
        } catch ( err ) {

            if ( !err?.response ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan pada proses login!',
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
            } else if ( err.response?.status === 400 ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Oops...!',
                    text: `${err.response?.data.non_field_errors}`,
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
            } else if ( err.response?.status === 401 ) {
                Swal.fire( {
                    icon: 'error',
                    title: 'Oops...!',
                    text: `Periksa kembali Username dan Password anda`,
                } )
                setIsSubmittingLogin( false );
                setDisabled( false );
            }
        }
    };

    return (
        <Container
            fluid
            className='vh-100 d-flex align-items-center justify-content-center'
        >
            <div
                id='cardLogin'
                style={ styleResponsive }
            >
                <Row>
                    <Col xs={ 12 } md={ 12 } lg={ 6 } className='text-center'>
                        <div className='text-start'>
                            <Image
                                src={ LogoBundar }
                                fluid
                                width={ 100 }
                            />
                        </div>
                        <h4 className='my-4 mx-4' style={ { fontFamily: 'Poppins-Medium' } }>Selamat datang di Aplikasi Meeting Room Management</h4>
                        <div className='mb-5 text-center mx-4'>
                            <Image
                                src={ LoginImages }
                                fluid
                                width={ 500 }

                            />
                        </div>
                    </Col>
                    <Col xs={ 12 } md={ 12 } lg={ 6 } className='text-start my-auto' >
                        <div className='mx-4'>
                            <p className='text-center mb-5' style={ { fontFamily: 'Poppins-Light' } }>Silahkan Login menggunakan Akun Administrator!</p>
                            <Form onSubmit={ handleSubmitLogin } >
                                <Form.Group className="mb-3">
                                    <Form.Label style={ formStyles.label } htmlFor='usernameLogin'>Username atau Email*</Form.Label>
                                    <Form.Control
                                        id='username'
                                        type="text"
                                        disabled={ disabled }
                                        onChange={ ( e ) => setUser( e.target.value ) }
                                        value={ username }
                                        required
                                        style={ formStyles.input }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" >
                                    <Form.Label style={ formStyles.label } htmlFor='passwordLogin'>Password*</Form.Label>
                                    <Form.Control
                                        id='password'
                                        type={ passwordShown ? "text" : "password" }
                                        disabled={ disabled }
                                        onChange={ ( e ) => setPwd( e.target.value ) }
                                        value={ password }
                                        required
                                        style={ formStyles.input }
                                    />
                                    <p className='mt-2' onClick={ togglePassword } style={ { fontFamily: 'Poppins-Regular', cursor: 'pointer', maxWidth: '170px' } }>{ passwordShown ? "Hide" : "Show" } password <span >{ passwordShown ? <Icon path={ mdiEyeOff } size={ 0.8 } /> : <Icon path={ mdiEye } size={ 0.8 } /> } </span></p>
                                </Form.Group>
                                <div>
                                    <p
                                        className='mt-4'
                                        onClick={ handleShowLupaPassword }
                                        style={ { fontFamily: 'Poppins-Regular', cursor: 'pointer', textDecoration: 'underline', color: '#12B3ED', maxWidth: '130px' } }
                                    >
                                        Lupa password?
                                    </p>
                                </div>
                                <div className="d-grid gap-2 my-4">
                                    { isSubmittingLogin ? (
                                        <Button
                                            id='actionButtonLogin'
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
                                            variant='btn'
                                            id='actionButtonLogin'
                                            className='mb-3'
                                        >
                                            Masuk
                                        </Button>
                                    ) }
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
            <ModalLupaPassword
                showLupaPassword={ showLupaPassword }
                setShowLupaPassword={ setShowLupaPassword }
            />
        </Container>
    )
}

export default Login



const formStyles = {
    label: {
        fontFamily: 'Poppins-Medium',
        color: 'white',
    },
    input: {
        color: '#222',
        fontFamily: 'Poppins-Regular',
        minHeight: '50px',
        borderColor: '#ced4da',
    },
};
