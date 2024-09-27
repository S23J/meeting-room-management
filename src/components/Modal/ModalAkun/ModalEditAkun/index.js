import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import { ThemeContext } from '../../../../auth';
import Select from 'react-select';
import { PiEye, PiEyeSlash } from 'react-icons/pi';

function ModalEditAkun ( {
    showEditAkun,
    setShowEditAkun,
    rowSelected,
    ruangid,
    retrieveAkun,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const [ disabled, setDisabled ] = useState( false );
    const [ selectedPlatform, setSelectedPlatform ] = useState( null );

    const handleClose = () =>
    {
        setShowEditAkun( false );
    };

    const [ passwordShown, setPasswordShown ] = useState( false );
    const togglePassword = () =>
    {
        setPasswordShown( !passwordShown );
    };

    const defaultValue = {

        account: rowSelected?.account || '',
        client_id: rowSelected?.client_id || '',
        client_secret: rowSelected?.client_secret || '',
        calendar_id: rowSelected?.calendar_id || '',
    };

    const platformOptions = [
        { value: 'Zoom', label: 'Zoom' },
        { value: 'Google Meeting', label: 'Google Meeting' },
    ];


    useEffect( () =>
    {
        const platformOption = platformOptions.find( option => option.value === rowSelected?.platform );
        setSelectedPlatform( platformOption || '' );
    }, [ rowSelected ] );

    const handleSelectPlatform = ( selectedOption ) =>
    {
        setSelectedPlatform( selectedOption );
    };


    const handleSubmitAkun = async ( values ) =>
    {

        const finalData = Object.assign( {}, values, {
            platform: selectedPlatform?.value,
        } );

        // console.log( finalData );
        setDisabled( true );
        try {
            const response = await axios.patch( `/manage/omplatform/${rowSelected.id}/`, finalData,
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
                title: 'Berhasil mengubah akun',
                showConfirmButton: true,
            } )
            retrieveAkun();
            setDisabled( false );
        } catch ( err ) {
            console.error( err )
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah akun',
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

    // Custom styles for react-select
    const selectStyles = {
        control: ( provided, state ) => ( {
            ...provided,
            minHeight: '50px', // Adjust the height as needed
            border: state.isFocused ? '1px solid #80bdff' : '1px solid #ced4da',
            background: theme === 'light' ? '#212529' : '#FFFFFF',
            boxShadow: state.isFocused ? '0 0 0 0.3rem rgba(0, 123, 255, 0.25)' : null,
            '&:hover': {
                borderColor: '#80bdff',
            },
            fontFamily: 'Poppins-Regular'
        } ),
        singleValue: ( provided, state ) => ( {
            ...provided,
            color: theme === 'light' ? ( state.isFocused ? 'red' : 'white' ) : ( state.isFocused ? 'red' : '#222' ), // Conditional text color based on theme and focus
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
            show={ showEditAkun }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Ubah Akun
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={ defaultValue }
                    enableReinitialize={ true }
                    onSubmit={ handleSubmitAkun }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                    } ) => (
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='account'>Email Akun*</Form.Label>
                                <Form.Control
                                    id='account'
                                    type="email"
                                    value={ values.account }
                                    onChange={ handleChange( "account" ) }
                                    required
                                    placeholder="Masukkan akun email"
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor="platform">Platform*</Form.Label>
                                <Select
                                    id="platform"
                                    options={ platformOptions }
                                    value={ selectedPlatform }
                                    onChange={ handleSelectPlatform }
                                    styles={ selectStyles }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor='client_id'>Client ID*</Form.Label>
                                <Form.Control
                                    id='client_id'
                                    type="text"
                                    value={ values.client_id }
                                    onChange={ handleChange( "client_id" ) }
                                    required
                                    placeholder="Masukkan client Id"
                                    style={ formStyles.input }
                                />
                            </Form.Group>
                            <Form.Label style={ formStyles.label } htmlFor='client_secret'>Client Secret*</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    id='client_secret'
                                    type={ passwordShown ? "text" : "password" }
                                    value={ values.client_secret }
                                    onChange={ handleChange( "client_secret" ) }
                                    required
                                    placeholder="Masukkan client Secret"
                                    style={ formStyles.input }
                                />

                                <Button variant="secondary" onClick={ togglePassword } >
                                    {
                                        passwordShown ?
                                            <PiEyeSlash size={ 25 } />

                                            :
                                            <PiEye size={ 25 } />
                                    }
                                </Button>
                            </InputGroup>
                            { selectedPlatform?.value === 'Google Meeting' && (
                                <Form.Group className="mb-3">
                                    <Form.Label style={ formStyles.label } htmlFor='calendar_id'>Calendar ID*</Form.Label>
                                    <Form.Control
                                        id='calendar_id'
                                        type="text"
                                        value={ values.calendar_id }
                                        onChange={ handleChange( "calendar_id" ) }
                                        required
                                        placeholder="Masukkan calendar Id"
                                        style={ formStyles.input }
                                    />
                                </Form.Group>
                            ) }
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
            <Modal.Body>
            </Modal.Body>
        </Modal>
    )
}

export default ModalEditAkun