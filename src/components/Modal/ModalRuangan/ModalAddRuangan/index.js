import React, { useContext, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { ThemeContext } from '../../../../auth';

function ModalAddRuangan ( {
    showAddRuangan,
    setShowAddRuangan,
    retrieveRuangan,
    tokenUser
} )
{
    const { theme } = useContext( ThemeContext );
    const [ gedung, setGedung ] = useState( '' );
    const [ namaRuangan, setNamaRuangan ] = useState( '' );
    const [ noRuangan, setNoRuangan ] = useState( '' );
    const [ kapasitas, setKapasitas ] = useState( '' );
    const [ lantai, setLantai ] = useState( '' );
    const [ disabled, setDisabled ] = useState( false );
    const [ isSubmitting, setIsSubmitting ] = useState( false );

    const handleClose = () =>
    {
        setShowAddRuangan( false );
        setGedung( '' );
        setNamaRuangan( '' );
        setNoRuangan( '' );
        setKapasitas( '' );
        setLantai( '' );
    };

    const handleSubmitRuangan = async ( event ) =>
    {
        event.preventDefault();
        setIsSubmitting( true );
        const data = {
            gedung: gedung,
            nama_ruangan: namaRuangan,
            no_ruangan: noRuangan,
            kapasitas: kapasitas,
            lantai: lantai
        };

        setDisabled( true );
        try {
            const response = await axios.post( `/manage/ruangan/`, data,
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
                title: 'Berhasil menambahkan ruangan',
                showConfirmButton: true,
            } );
            retrieveRuangan();
            setIsSubmitting( false );
            setDisabled( false );
        } catch ( err ) {
            console.error( err )
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan menambahkan ruangan',
            } );
            setIsSubmitting( false );
            setDisabled( false );
        }

    };

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
            show={ showAddRuangan }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
            data-bs-theme={ theme === 'light' ? 'dark' : '' }
        >
            <Modal.Header closeButton >
                <Modal.Title style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                    Tambah Ruangan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={ handleSubmitRuangan }>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='gedung'>Gedung*</Form.Label>
                        <Form.Control
                            id='gedung'
                            type="text"
                            onChange={ ( e ) => setGedung( e.target.value ) }
                            value={ gedung }
                            required
                            placeholder="Masukkan nama gedung"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='ruangan'>Nama Ruangan*</Form.Label>
                        <Form.Control
                            id='ruangan'
                            type="text"
                            onChange={ ( e ) => setNamaRuangan( e.target.value ) }
                            value={ namaRuangan }
                            required
                            placeholder="Masukkan nama ruangan"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='no_ruangan'>No. Ruangan*</Form.Label>
                        <Form.Control
                            id='no_ruangan'
                            type="text"
                            onChange={ ( e ) => setNoRuangan( e.target.value ) }
                            value={ noRuangan }
                            required
                            placeholder="Masukkan nomor ruangan"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='kapasitas'>Kapasitas Ruangan*</Form.Label>
                        <Form.Control
                            id='kapasitas'
                            type="number"
                            onChange={ ( e ) => setKapasitas( e.target.value ) }
                            value={ kapasitas }
                            required
                            placeholder="Masukkan kapasitas ruangan"
                            style={ formStyles.input }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={ formStyles.label } htmlFor='lantai'>Lantai*</Form.Label>
                        <Form.Control
                            id='lantai'
                            type="text"
                            onChange={ ( e ) => setLantai( e.target.value ) }
                            value={ lantai }
                            required
                            placeholder="Masukkan lantai"
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
                                    disabled={ disabled || !gedung || !namaRuangan || !noRuangan || !kapasitas || !lantai }
                                >
                                    Simpan
                                </Button>
                        ) }
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalAddRuangan

