import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Formik } from 'formik';

function ModalEditPerlengkapan ( {
    showEditAlat,
    setShowEditAlat,
    rowSelected,
    listRuangan,
    retrieveAlat,
    retrieveRuangan,
    tokenUser
} )
{

    const handleClose = () =>
    {
        setShowEditAlat( false );
    };

    const [ selectedRuangan, setSelectedRuangan ] = useState( null );

    const ruanganOptions = listRuangan.map( ruangan => ( {
        value: ruangan.id,
        label: ruangan.nama_ruangan,
    } ) );

    const [ isDefaultSet, setIsDefaultSet ] = useState( false );

    useEffect( () =>
    {

        const defaultSelectedRuangan = ruanganOptions.find( ( option ) => option.value === rowSelected?.ruangan );

        if ( defaultSelectedRuangan ) {
            setSelectedRuangan( defaultSelectedRuangan );
            setIsDefaultSet( true );
        }
    }, [ rowSelected?.ruangan, isDefaultSet ] );

    const handleSelectRuangan = selectedOption =>
    {
        setSelectedRuangan( selectedOption );
    };


    const defaultValue = {

        nama_equipment: rowSelected?.nama_equipment || '',
    }

    const handleSubmitPeralatan = async ( values ) =>
    {

        const { alat, ...restData } = values;

        const finalData = Object.assign( {}, restData, {
            ruangan: selectedRuangan?.value,
        } );

        console.log( finalData );

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
            console.log( response );
            handleClose();
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil mengubah peralatan',
                showConfirmButton: true,
            } )
            retrieveAlat();
            // retrieveRuangan();
        } catch ( err ) {
            console.log( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah peralatan',
            } )
        }

    }

    return (
        <Modal
            show={ showEditAlat }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium' } }>
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
                            <Form.Group className="mb-3">
                                <Form.Label style={ formStyles.label } htmlFor="namaRuangan">Ruangan*</Form.Label>
                                <Select
                                    id='namaRuangan'
                                    options={ ruanganOptions }
                                    required
                                    value={ selectedRuangan }
                                    onChange={ handleSelectRuangan }
                                    styles={ selectStyles }
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
            <Modal.Body>
            </Modal.Body>
        </Modal>
    )
}

export default ModalEditPerlengkapan


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

// Custom styles for react-select
const selectStyles = {
    control: ( provided, state ) => ( {
        ...provided,
        minHeight: '50px', // Adjust the height as needed
        border: state.isFocused ? '1px solid #80bdff' : '1px solid #ced4da',
        boxShadow: state.isFocused ? '0 0 0 0.3rem rgba(0, 123, 255, 0.25)' : null,
        '&:hover': {
            borderColor: '#80bdff',
        },
        fontFamily: 'Poppins-Regular'
    } ),
    option: ( provided, state ) => ( {
        ...provided,
        color: state.isSelected ? '#fff' : '#333',
        background: state.isSelected ? '#007bff' : '#fff',
        fontFamily: 'Poppins-Regular'
    } ),
};
