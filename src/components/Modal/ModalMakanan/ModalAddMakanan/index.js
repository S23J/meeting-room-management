import React, { useContext, useState } from 'react'
import { ThemeContext } from '../../../../auth';
import Select from 'react-select';
import { Button, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { FaWindowClose } from 'react-icons/fa';
import { CiCirclePlus } from 'react-icons/ci';

function ModalAddMakanan({
    showAddFood,
    setShowAddFood,
    retrieveFood,
    tokenUser
}) {

    const { theme } = useContext(ThemeContext);
    const [foodName, setFoodName] = useState('');
    const [selectedFoodType, setSelectedFoodType] = useState(null);
    const [foodPrice, setFoodPrice] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // States for second modal
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [tempFoodName, setTempFoodName] = useState('');

    // State for the array of makanan items
    const [makananList, setMakananList] = useState([]);

    const handleClose = () => {
        setShowAddFood(false);
        setFoodName('');
        setFoodPrice('');
        setSelectedFoodType(null);
        setMakananList([]);
    };

    const handleOpenSecondModal = () => {
        setShowSecondModal(true);
    };

    const handleCloseSecondModal = () => {
        setShowSecondModal(false);
        setTempFoodName('');
    };

    function handleChangeFoodPrice(e) {
        const inputValue = e.target.value;
        const numericValue = parseFloat(inputValue.replace(/[^\d]/g, '')) || 0;

        setFoodPrice(numericValue);

    };


    const handleAddMakanan = () => {
        if (tempFoodName) {
            // Add object with 'name' property instead of string
            setMakananList([...makananList, { nama: tempFoodName }]);
            handleCloseSecondModal();
        } else {
            Swal.fire({
                icon: 'warning',
                text: 'Nama makanan tidak boleh kosong!',
            });
        }
    };

    const handleDeleteMakanan = (index) => {
        const updatedList = makananList.filter((_, i) => i !== index);
        setMakananList(updatedList);
    };

    const foodTypeOptions = [
        { value: 'snack', label: 'Snack' },
        { value: 'meal', label: 'Meal' },
        { value: 'fullset', label: 'Fullset' }
    ];

    const handleSelectFoodType = selectedOption => {
        setSelectedFoodType(selectedOption);
    };

    // console.log(makananList)

    const handleSubmit = async (event) => {
        event.preventDefault();

        // console.log(makananList)
        setIsSubmitting(true);
        setDisabled(true);

        try {
            // Step 1: Prepare the main food package data
            const data = {
                nama: foodName,
                food_type: selectedFoodType?.value,
                price: foodPrice
            };

            // Step 2: Send main food package request
            const responsePaket = await axios.post(
                `/manage/food/`,
                data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                }
            );

            // Step 3: Prepare and send all table items asynchronously
            const foodId = responsePaket.data.id; // Assuming responsePaket.data contains the ID

            const foodDetailPromises = makananList.map(async (dataArrayTable) => {
                try {
                    const { ...restData } = dataArrayTable;

                    // Construct the payload for each table item
                    const finalDataTable = {
                        ...restData,
                        food: foodId, // Link to the newly created food package
                    };

                    // Send the food detail request
                    return await axios.post(
                        `/manage/food-detail/`,
                        finalDataTable,
                        {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                                withCredentials: true,
                                Authorization: `Token ` + tokenUser,
                            },
                        }
                    );
                } catch (err) {
                    console.error('Error adding food detail:', err);
                    throw err; // Optional: Throw error to handle it in Promise.all
                }
            });

            // Step 4: Wait for all food detail requests to complete
            await Promise.all(foodDetailPromises);

            // Step 5: Show success notification

            handleClose();

            Swal.fire({
                icon: 'success',
                title: 'Paket makanan berhasil di tambahkan',
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
                text: 'Terjadi kesalahan saat menambahkan paket makanan',
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
        <>
            {/* First Modal */}
            <Modal
                show={showAddFood}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                size='lg'
                data-bs-theme={theme === 'light' ? 'dark' : ''}
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' }}>
                        Tambah Paket Makanan
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} lg={6} className='mt-3'>
                                <Form.Group className="mb-3">
                                    <Form.Label style={formStyles.label}>Nama Paket*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={(e) => setFoodName(e.target.value)}
                                        value={foodName}
                                        required
                                        placeholder="Masukkan nama paket"
                                        style={formStyles.input}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label style={formStyles.label}>Tipe Makanan*</Form.Label>
                                    <Select
                                        options={foodTypeOptions}
                                        value={selectedFoodType}
                                        onChange={handleSelectFoodType}
                                        placeholder='Pilih tipe makanan'
                                        styles={selectStyles}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label style={formStyles.label}>Total Harga Paket*</Form.Label>
                                    <Form.Control
                                        id='food_price'
                                        type='text'
                                        onChange={handleChangeFoodPrice}
                                        value={`Rp ${foodPrice ? foodPrice.toLocaleString('id-ID') : ''}`}
                                        required
                                        placeholder="Masukkan harga paket"
                                        style={formStyles.input}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} lg={6}>
                                <Row>
                                    <Col xs={6} className='text-start my-auto'>
                                        <Form.Label style={formStyles.label}>Makanan*</Form.Label>
                                    </Col>
                                    <Col xs={6} className='text-end mb-3'>
                                        <Button
                                            variant='btn'
                                            id={theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight'}
                                            onClick={handleOpenSecondModal}
                                        >
                                            <CiCirclePlus size={25} />
                                        </Button>
                                    </Col>
                                </Row>

                                <Table bordered responsive>
                                    <thead>
                                        <tr style={{ fontFamily: 'Poppins-Regular' }}>
                                            <th>#</th>
                                            <th>Nama Makanan</th>
                                            <th>Hapus</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontFamily: 'Poppins-Regular' }}>
                                        {makananList.length > 0 ? (
                                            makananList.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.nama}</td> {/* Access name property */}
                                                    <td className="text-center">
                                                        <Button
                                                            variant='btn'
                                                            onClick={() => handleDeleteMakanan(index)}
                                                        >
                                                            &nbsp;<FaWindowClose size={20} color='#FF0060' />&nbsp;
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center" style={{ fontFamily: 'Poppins-Light' }}>
                                                    Tidak ada makanan ditambahkan
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
                                    disabled={disabled || !foodName || !selectedFoodType || !makananList.length > 0}
                                >
                                    Simpan
                                </Button>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Second Modal */}
            <Modal
                show={showSecondModal}
                onHide={handleCloseSecondModal}
                backdrop="static"
                keyboard={false}
                centered
                data-bs-theme={theme === 'light' ? 'dark' : ''}
                size='sm'
            >
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '#222222' }}>
                        Tambah Makanan
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label style={formStyles.label}>Nama Makanan</Form.Label>
                        <Form.Control
                            type="text"
                            value={tempFoodName}
                            onChange={(e) => setTempFoodName(e.target.value)}
                            placeholder="Masukkan nama makanan"
                            style={formStyles.input}
                        />
                    </Form.Group>
                    <div className="text-end">
                        <Button
                            variant="secondary"
                            onClick={handleCloseSecondModal}
                            className="me-2"
                            style={{ fontFamily: 'Poppins-Regular' }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddMakanan}
                            style={{ fontFamily: 'Poppins-Regular' }}
                        >
                            Tambah
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalAddMakanan
