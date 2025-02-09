import React, { useContext, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { ThemeContext } from '../../../../auth';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Formik } from 'formik';

function ModalEditUser({
    showEditUser,
    setShowEditUser,
    rowSelected,
    retrieveUser,
    tokenUser
}) {

    // console.log(rowSelected)

    const { theme } = useContext(ThemeContext);
    const [disabled, setDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setShowEditUser(false);
    };

    const defaultValue = {
        first_name: rowSelected?.first_name || "",
        last_name: rowSelected?.last_name || "",
        username: rowSelected?.username || "",
        email: rowSelected?.email || "",
        division: rowSelected?.profile ? rowSelected.profile.division || "" : "",
    };

    // console.log(rowSelected)

    const handleSubmitUser = async (values) => {
        setIsSubmitting(true);
        setDisabled(true);

        // Prepare two sets of data
        const dataUser = { ...values };
        delete dataUser.division; // First data excludes 'division'

        const dataProfile = {
            // ...values,
            division: values.division || "", // Second data includes 'division'
        };

        try {
            // Execute both patch requests in parallel
            await Promise.all([
                axios.patch(`/user-retrieve/${rowSelected.id}/`, dataUser, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        Authorization: `Token ${tokenUser}`,
                    },
                }),
                axios.patch(`/profile-retrieve/${rowSelected.id}/`, dataProfile, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        Authorization: `Token ${tokenUser}`,
                    },
                }),
            ]);

            handleClose();
            Swal.fire({
                icon: 'success',
                title: 'Berhasil mengubah user',
                showConfirmButton: true,
            });
            retrieveUser();
            setIsSubmitting(false);
            setDisabled(false);
        } catch (err) {
            console.error(err);
            handleClose();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah user',
            });
            setIsSubmitting(false);
            setDisabled(false);
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
            show={showEditUser}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            data-bs-theme={theme === 'light' ? 'dark' : ''}
        >
            <Modal.Header closeButton style={{ fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' }}>
                <Modal.Title style={{ fontFamily: 'Poppins-Medium' }}>
                    Ubah User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={defaultValue}
                    enableReinitialize={true}
                    onSubmit={handleSubmitUser}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mb-3'>
                                <Form.Label style={formStyles.label} htmlFor='firstName'>Nama Depan*</Form.Label>
                                <Form.Control
                                    id='firstName'
                                    type='text'
                                    required
                                    value={values.first_name}
                                    onChange={handleChange("first_name")}
                                    style={formStyles.input}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={formStyles.label} htmlFor='lastName'>Nama Belakang*</Form.Label>
                                <Form.Control
                                    id='lastName'
                                    type='text'
                                    required
                                    value={values.last_name}
                                    onChange={handleChange("last_name")}
                                    style={formStyles.input}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={formStyles.label} htmlFor='division'>Divisi*</Form.Label>
                                <Form.Control
                                    id='division'
                                    type='text'
                                    required
                                    value={values.division}
                                    onChange={handleChange("division")}
                                    style={formStyles.input}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={formStyles.label} htmlFor='userName'>Username*</Form.Label>
                                <Form.Control
                                    id='userName'
                                    type='text'
                                    required
                                    value={values.username}
                                    onChange={handleChange("username")}
                                    style={formStyles.input}
                                />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label style={formStyles.label} htmlFor='email'>Email*</Form.Label>
                                <Form.Control
                                    id='email'
                                    type='email'
                                    required
                                    value={values.email}
                                    onChange={handleChange("email")}
                                    style={formStyles.input}
                                />
                            </Form.Group>
                            <div className="d-grid gap-2 mt-4">
                                {isSubmitting ? (
                                    <Button
                                        id={theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight'}
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
                                        id={theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight'}
                                        variant='btn'
                                        disabled={disabled}
                                    >
                                        Simpan
                                    </Button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
}

export default ModalEditUser
