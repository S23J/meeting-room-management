import React, { useContext, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import { ThemeContext } from '../../../../auth';

function ModalEditPerlengkapan ( {
    showEditAlat,
    setShowEditAlat,
    rowSelected,
    ruangid,
    retrieveDetailEquipment,
    tokenUser
} )
{

    const { theme } = useContext( ThemeContext );
    const [ disabled, setDisabled ] = useState( false );
    const [ isSubmitting, setIsSubmitting ] = useState( false );

    const handleClose = () =>
    {
        setShowEditAlat( false );
    };

    const defaultValue = {

        nama_equipment: rowSelected?.nama_equipment || '',
    }

    const handleSubmitPeralatan = async ( values ) =>
    {

        const { alat, ...restData } = values;


        const finalData = Object.assign( {}, restData, {
            ruangan: ruangid,
        } );
        setIsSubmitting( true );
        setDisabled( true );
        try {
            const response = await axios.patch( `/manage/equipment/${rowSelected.id}/`, finalData,
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
                title: 'Berhasil mengubah peralatan',
                showConfirmButton: true,
            } )
            retrieveDetailEquipment();
            setIsSubmitting( false );
            setDisabled( false );
        } catch ( err ) {
            console.error( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah peralatan',
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
            show={ showEditAlat }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Ubah Peralatan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={ defaultValue }
                    enableReinitialize={ true }
                    onSubmit={ handleSubmitPeralatan }
                >
                    { ( {
                        handleSubmit,
                        handleChange,
                        values,
                        setFieldValue,
                    } ) => (
                        <Form onSubmit={ handleSubmit }>
                            <Form.Group className='mb-3'>
                                <Form.Label style={ formStyles.label } htmlFor='namaPeralatan'>Nama Peralatan*</Form.Label>
                                <Form.Control
                                    id='namaPeralatan'
                                    type='text'
                                    required
                                    value={ values.nama_equipment }
                                    onChange={ handleChange( "nama_equipment" ) }
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
            <Modal.Body>
            </Modal.Body>
        </Modal>
    )
}

export default ModalEditPerlengkapan