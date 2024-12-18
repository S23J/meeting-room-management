import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../../auth';
import { Button, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { Formik } from 'formik';
import Select from 'react-select';
import axios from '../../../../api/axios';
import { FaWindowClose } from 'react-icons/fa';
import Swal from 'sweetalert2';

function ModalUbahMakanan({
    showEditFood,
    setShowEditFood,
    rowSelected,
    retrieveFood,
    tokenUser
}) {

    const { theme } = useContext(ThemeContext);
    const [disabled, setDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setShowEditFood(false);
    };

    const formatToIDR = (value) => {
        const numericValue = parseFloat(value.replace(/[^\d]/g, '')) || 0;
        return `Rp ${numericValue.toLocaleString('id-ID')}`;
    };

    const parseInitialPrice = (value) => {
        return value ? parseFloat(value).toFixed(0) : "";
    };

    const defaultValue = {
        nama: rowSelected?.nama || "",
        food_type: rowSelected?.food_type || "",
        price: rowSelected?.price ? parseInitialPrice(rowSelected.price) : "",
    };

    const handleFoodPriceChange = (e, setFieldValue) => {
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^\d]/g, '');
        setFieldValue('price', numericValue);
    };

    const foodTypeOptions = [
        { value: 'snack', label: 'Snack' },
        { value: 'meal', label: 'Meal' },
        { value: 'fullset', label: 'Fullset' }
    ];

    const [filteredFoodTypeOptions, setFilteredFoodTypeOptions] = useState(foodTypeOptions);

    const handleSelectFoodType = (selectedOption, setFieldValue) => {
        setFieldValue("food_type", selectedOption ? selectedOption.value : "");
    };

    useEffect(() => {
        if (showEditFood) {

            const defaultFoodType = foodTypeOptions.find(
                (option) => option.value === rowSelected?.food_type
            );

            if (defaultFoodType) {
                setFilteredFoodTypeOptions(foodTypeOptions);
            }
        }
    }, [showEditFood, rowSelected]);

    const [detailFood, setDetailFood] = useState([]);

    const retrieveFoodDetail = () => {
        if (!rowSelected?.id) return;

        axios.get(`/manage/food-detail/?food_id=${rowSelected?.id}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ` + tokenUser,
            },
        })
            .then(res => {
                setDetailFood(res.data);
                // console.log(res.data);
            })
            .catch(err => {

                console.error(err);
            });
    };

    useEffect(() => {
        if (rowSelected?.id !== undefined) retrieveFoodDetail()
    }, [rowSelected?.id]);

    const handleDelete = async (itemId) => {

        const result = await Swal.fire({
            title: 'Apakah anda yakin ingin menghapus makanan ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus makanan ini!',
            cancelButtonText: 'Batalkan',
        });

        if (result.isConfirmed) {
            try {

                const responseDelete = await axios.delete(`/manage/food-detail/${itemId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                });
                Swal.fire('Terhapus!', 'Makanan berhasil dihapus', 'success');
                retrieveFoodDetail();
            } catch (err) {
                console.error(err)
                Swal.fire('Error', 'Terjadi kesalahan saat menghapus makanan!', 'error');
            }
        } else {
            Swal.fire('Dibatalkan', '', 'info');
        }
    };

    const handleSubmitFood = async (values) => {
        setIsSubmitting(true);
        setDisabled(true);

        try {
            const response = await axios.patch(`/manage/food/${rowSelected.id}/`, values,
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
                title: 'Berhasil mengubah paket makanan',
                showConfirmButton: true,
            })
            retrieveFood();
            setIsSubmitting(false);
            setDisabled(false);
        } catch (err) {
            console.error(err);
            handleClose();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan saat mengubah paket makanan',
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

    const selectStyles = {
        control: (cityided, state) => ({
            ...cityided,
            minHeight: '50px',
            border: state.isFocused ? '1px solid #80bdff' : '1px solid #ced4da',
            boxShadow: state.isFocused ? '0 0 0 0.3rem rgba(0, 123, 255, 0.25)' : null,
            '&:hover': {
                borderColor: '#80bdff',
            },
            textAlign: 'left',
            fontFamily: 'Poppins-Regular',
            background: theme === 'light' ? '#212529' : '#FFFFFF',
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#fff' : '#333',
            background: state.isSelected ? '#007bff' : state.isFocused ? '#f5f5f5' : '#fff',
            fontFamily: 'Poppins-Regular',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: theme === 'light' ? '#FFFFFF' : '#222',
            fontFamily: 'Poppins-Regular',
        }),
        input: (provided) => ({
            ...provided,
            color: theme === 'light' ? '#FFFFFF' : '#222',
            fontFamily: 'Poppins-Regular',
        }),
    };



    return (
        <Modal
            show={showEditFood}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            size='lg'
            data-bs-theme={theme === 'light' ? 'dark' : ''}
        >
            <Modal.Header closeButton style={{ fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' }}>
                <Modal.Title style={{ fontFamily: 'Poppins-Medium' }}>
                    Ubah Paket Makanan
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={defaultValue}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        const formValues = {
                            ...values,
                            price: parseFloat(values.price).toFixed(2),
                        };
                        handleSubmitFood(formValues);
                    }}

                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        setFieldValue,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={12} lg={6} className='mt-3'>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={formStyles.label} htmlFor='nama'>Nama Paket*</Form.Label>
                                        <Form.Control
                                            id='nama'
                                            type='text'
                                            value={values.nama}
                                            onChange={handleChange("nama")}
                                            style={formStyles.input}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={formStyles.label} htmlFor="food_type">
                                            Food Type*
                                        </Form.Label>
                                        <Select
                                            id="food_type"
                                            options={filteredFoodTypeOptions}
                                            required
                                            value={filteredFoodTypeOptions.find(
                                                (option) => option.value === values.food_type
                                            )}
                                            onChange={(option) =>
                                                handleSelectFoodType(option, setFieldValue)
                                            }
                                            styles={selectStyles}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={formStyles.label} htmlFor='price'>Total Harga Paket**</Form.Label>
                                        <Form.Control
                                            id='price'
                                            type='text'
                                            value={values.price ? formatToIDR(values.price) : ""}
                                            onChange={(e) => handleFoodPriceChange(e, setFieldValue)}
                                            required
                                            style={formStyles.input}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} lg={6} className='mt-3'>
                                    <Form.Label style={formStyles.label}>List Makanan</Form.Label>
                                    <Table bordered responsive>
                                        <thead>
                                            <tr style={{ fontFamily: 'Poppins-Regular' }}>
                                                <th>#</th>
                                                <th>Nama Makanan</th>
                                                <th>Hapus</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ fontFamily: 'Poppins-Regular' }}>
                                            {detailFood.length > 0 ? (
                                                detailFood.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.nama}</td> {/* Access name property */}
                                                        <td className="text-center">
                                                            <Button
                                                                variant='btn'
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                &nbsp;<FaWindowClose size={20} color='#FF0060' />&nbsp;
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center" style={{ fontFamily: 'Poppins-Light' }}>
                                                        Tidak ada makanan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
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
                                        variant='btn'
                                        id={theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight'}
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

export default ModalUbahMakanan
