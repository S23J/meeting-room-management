import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Container, Spinner, Table } from 'react-bootstrap';
import axios from '../../api/axios';

function PrintMeetingDivisiPage() {

    const { tokens } = useContext(AuthContext);
    const tokenUser = tokens?.token;
    const navigate = useNavigate();
    const [done, setDone] = useState(undefined);
    const [dataChart, setDataChart] = useState([]);

    useEffect(() => {
        if (done) {
            window.print();
        }
    }, [done]);

    useEffect(() => {
        const handleAfterPrint = () => {
            navigate(-1);
        };

        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [navigate]);

    const numberFormat = (value) =>
        new Intl.NumberFormat('IN-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);

    const fetchListDataMeeting = () => {
        axios.get(`/manage/requests/doughnut_chart/`,
            {
                headers:
                {
                    withCredentials: true,
                    Authorization: `Token ${tokens?.token}`,
                },

            })
            .then(res => {
                setDataChart(res.data)
                setTimeout(() => {
                    setDone(true);
                }, 2000);
            }).catch(err => {

                handleApiError(err);
            })
    };

    useEffect(() => {
        if (tokenUser) fetchListDataMeeting()
    }, [tokenUser]);

    const handleApiError = (err) => {
        if (err.response?.status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Sesi telah habis',
                text: 'Sesi anda telah berakhir. Silahkan login kembali.',
                confirmButtonText: 'Log In',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
        } else {
            console.log(err);
        }
    };

    return (
        <Container fluid style={{ minHeight: '100vh', overflowX: 'hidden', backgroundColor: '#E1ECF2' }}>
            <div className='text-start'>
                <h1 className='mt-2' style={{ fontFamily: 'Poppins-Medium' }}>Total biaya Meeting per Divisi</h1>
            </div>
            {!done ? (
                <Container className='text-center mb-3'>
                    <div className='my-5'>
                        <Spinner animation="border" size='lg' style={customSpinnerStyle} />
                    </div>
                </Container>
            ) : (
                <Table responsive>
                    <thead>
                        <tr style={{ fontFamily: 'Poppins-Regular' }}>
                            <th>Divisi</th>
                            <th>Total Biaya</th>
                        </tr>
                    </thead>
                    <tbody >
                        {
                            dataChart?.map((data, index) => {
                                return (

                                    <tr key={index} style={{ fontFamily: 'Poppins-Light' }}>
                                        <td>{data?.division}</td>
                                        <td>{numberFormat(data?.total_cost)}</td>
                                    </tr>

                                )
                            })
                        }
                    </tbody>
                </Table>
            )}
        </Container>
    )
}

export default PrintMeetingDivisiPage


const customSpinnerStyle = {
    color: '#007bff',
};

