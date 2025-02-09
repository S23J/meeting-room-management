import React, { useContext, useState } from 'react'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { ThemeContext } from '../../../../auth';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeOff } from '@mdi/js';

function ModalAddUser({
    showAddUser,
    setShowAddUser,
    retrieveUser,
    tokenUser
}) {

    const { theme } = useContext(ThemeContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [division, setDivision] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setShowAddUser(false);
        setFirstName('');
        setLastName('');
        setUserName('');
        setDivision('');
        setEmail('');
        setPassword('');
    };

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const handleSubmitUser = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const data = {
            first_name: firstName,
            last_name: lastName,
            username: userName,
            division: division,
            email: email,
            password: password
        };
        setDisabled(true);
        try {
            const response = await axios.post(`/register/`, data,
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
            Swal.fire({
                icon: 'success',
                title: 'Berhasil menambahkan user',
                showConfirmButton: true,
            })
            retrieveUser();
            setIsSubmitting(false);
            setDisabled(false);
        } catch (err) {
            console.error(err);
            handleClose();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat menambahkan user',
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
            show={showAddUser}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            data-bs-theme={theme === 'light' ? 'dark' : ''}
        >
            <Modal.Header closeButton >
                <Modal.Title style={{ fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' }}>
                    Tambah User
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitUser}>
                    <Form.Group className="mb-3">
                        <Form.Label style={formStyles.label} htmlFor='first_name'>Nama Depan*</Form.Label>
                        <Form.Control
                            id='first_name'
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                            placeholder="Masukkan nama depan"
                            style={formStyles.input}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={formStyles.label} htmlFor='last_name'>Nama Belakang*</Form.Label>
                        <Form.Control
                            id='last_name'
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            required
                            placeholder="Masukkan nama belakang"
                            style={formStyles.input}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={formStyles.label} htmlFor='division'>Divisi*</Form.Label>
                        <Form.Control
                            id='division'
                            type="text"
                            onChange={(e) => setDivision(e.target.value)}
                            value={division}
                            required
                            placeholder="Masukkan divisi"
                            style={formStyles.input}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={formStyles.label} htmlFor='email'>Email*</Form.Label>
                        <Form.Control
                            id='email'
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            placeholder="Masukkan email"
                            style={formStyles.input}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={formStyles.label} htmlFor='username'>Username*</Form.Label>
                        <Form.Control
                            id='username'
                            type="text"
                            onChange={(e) => setUserName(e.target.value)}
                            value={userName}
                            required
                            placeholder="Masukkan username"
                            style={formStyles.input}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={formStyles.label} htmlFor='password'>Password*</Form.Label>
                        <Form.Control
                            id='password'
                            type={passwordShown ? "text" : "password"}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            placeholder="Masukkan password"
                            style={formStyles.input}
                        />
                        <p className='mt-2'
                            onClick={togglePassword}
                            style={{ fontFamily: 'Poppins-Regular', cursor: 'pointer', maxWidth: '170px', color: theme === 'light' ? '#FFFFFF' : '#222' }}
                        >
                            {passwordShown ? "Hide" : "Show"} password <span >{passwordShown ? <Icon path={mdiEyeOff} size={0.8} /> : <Icon path={mdiEye} size={0.8} />} </span></p>
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
                                disabled={disabled || !firstName || !lastName || !email || !userName || !password}
                            >
                                Simpan
                            </Button>
                        )}
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default ModalAddUser
