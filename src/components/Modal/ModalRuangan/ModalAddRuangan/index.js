import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';

function ModalAddRuangan ( {
    showAddRuangan,
    setShowAddRuangan,
    retrieveRuangan,
    tokenUser
} )
{
    const [ gedung, setGedung ] = useState( '' );
    const [ namaRuangan, setNamaRuangan ] = useState( '' );
    const [ noRuangan, setNoRuangan ] = useState( '' );
    const [ kapasitas, setKapasitas ] = useState( '' );
    const [ lantai, setLantai ] = useState( '' );

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
        const data = {
            gedung: gedung,
            nama_ruangan: namaRuangan,
            no_ruangan: noRuangan,
            kapasitas: kapasitas,
            lantai: lantai
        };
        // console.log( data );
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
            // console.log( response );
            handleClose();
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil menambahkan ruangan',
                showConfirmButton: true,
            } )
            retrieveRuangan();
        } catch ( err ) {
            console.log( err );
            handleClose();
            Swal.fire( {
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan menambahkan ruangan',
            } )
        }

    }

    return (
        <Modal
            show={ showAddRuangan }
            onHide={ handleClose }
            backdrop="static"
            keyboard={ false }
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title style={ { fontFamily: 'Poppins-Medium' } }>
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
                            placeholder="Masukkan nama gedung"
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
                            placeholder="Masukkan nama gedung"
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
            </Modal.Body>
        </Modal>
    )
}

export default ModalAddRuangan


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