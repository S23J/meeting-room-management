import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { AuthContext, ThemeContext } from '../../auth';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { SidebarComponent, TableFoodDark, TableFoodLight } from '../../components';
import { Col, Container, Row, Spinner } from 'react-bootstrap';

function Food() {

    const isMobile = useMediaQuery({ maxWidth: 1024 });
    const { showSidebar, tokens } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const [listFood, setListFood] = useState([]);
    const [loading, setLoading] = useState(true);
    const tokenUser = tokens?.token;
    const navigate = useNavigate();


    const retrieveFood = () => {
        setLoading(true);
        axios.get(`/manage/food/`,
            {
                headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            })
            .then(res => {

                setListFood(res.data);
                // console.log(res.data)
                setLoading(false);

            }).catch(err => {
                setLoading(false);
                if (err.response?.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Sesi Anda telah berakhir. Silahkan Login kembali.',
                        confirmButtonText: 'Login',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/');
                        }
                    });

                } else (console.error(err))
            })
    }

    useEffect(() => {
        if (tokenUser !== undefined) retrieveFood()
    }, [tokenUser]);

    return (
        <div style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
            <SidebarComponent />
            <Container fluid id={theme === 'light' ? 'containerAppDark' : 'containerAppLight'} style={{ marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' }}>
                <div className='ms-3'>
                    <Row style={{ maxWidth: isMobile ? '100vw' : showSidebar ? '93.5vw' : '84vw' }}>
                        <Col xs={12} lg={6} className='text-start'>
                            <h3 className='pt-4' style={{ fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' }}>
                                Daftar Paket Makanan
                            </h3>
                        </Col>
                    </Row>
                </div>
                <div className='ms-3 pt-4' style={{ maxWidth: isMobile ? '100vw' : showSidebar ? '91vw' : '81vw' }}>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                            <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                        </div>
                    ) : (
                        theme === 'light' ? (
                            <TableFoodDark
                                listFood={listFood}
                                retrieveFood={retrieveFood}
                                tokenUser={tokenUser}
                            />
                        ) : (
                            <TableFoodLight
                                listFood={listFood}
                                retrieveFood={retrieveFood}
                                tokenUser={tokenUser}
                            />
                        )
                    )}
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
            </Container>
        </div>
    )
}

export default Food
