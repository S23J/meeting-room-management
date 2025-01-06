import React, { useEffect, useState, useContext } from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useMediaQuery } from 'react-responsive';
import AuthContext from '../../auth/Context/AuthContext';
import { ThemeContext } from '../../auth';
import axios from '../../api/axios';
import { Form } from 'react-bootstrap';



ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartComponent() {
    const { tokens } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const tokenUser = tokens?.token;
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [dataChart, setDataChart] = useState([]);

    const today = new Date();
    const year = today.getFullYear();
    const [selectedYear, setSelectedYear] = useState(year);

    const retrieveMeetingCostYear = () => {
        axios.get(`/manage/requests/bar_chart/?year=${selectedYear}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ${tokenUser}`,
            },
        })
            .then(res => {

                const processedData = res.data.map(item => item.total_cost);
                setDataChart(processedData);
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (selectedYear && tokenUser) {
            retrieveMeetingCostYear();
        }
    }, [selectedYear, tokenUser]);

    const numberFormat = (value) =>
        new Intl.NumberFormat('IN-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);

    const dataMobile = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des'
        ],
        datasets: [
            {
                // label: `Meeting Cost:`,
                backgroundColor: [
                    theme === 'light' ? '#FFF471' : '#006CB8',
                ],
                borderColor: [
                    theme === 'light' ? '#FFF471' : '#006CB8',
                ],
                borderWidth: 1,
                data: dataChart,
                barThickness: 15,
                borderRadius: {
                    topLeft: 0,
                    topRight: 10,
                    bottomLeft: 0,
                    bottomRight: 10
                },
            },
        ],
    };

    const optionsMobile = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    callbacks: {
                        label: function (context) {
                            // Combine label and formatted currency value
                            return `Total Biaya: ${numberFormat(context.raw)}`;
                        },
                    },
                },
            },
        },
        scales: {
            x: {
                display: false,

            },
            y: {
                ticks: {
                    color: theme === 'light' ? 'white' : '#222',
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            }
        },
        indexAxis: 'y'
    };

    const dataDekstop = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des'
        ],
        datasets: [
            {
                // label: `Meeting Cost:`,
                backgroundColor: [
                    theme === 'light' ? '#FFF471' : '#006CB8',
                ],
                borderColor: [
                    theme === 'light' ? '#FFF471' : '#006CB8',
                ],
                borderWidth: 1,
                data: dataChart,
                barThickness: 15,
                borderRadius: {
                    topLeft: 10,
                    topRight: 10,
                    bottomLeft: 0,
                    bottomRight: 0
                },
            },
        ],
    };

    const optionsDekstop = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        // Combine label and formatted currency value
                        return `Total Biaya: ${numberFormat(context.raw)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: theme === 'light' ? 'white' : '#222',
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            y: {
                display: false,
            }
        },
        indexAxis: isMobile ? 'y' : 'x',
    };

    return (
        // onChange={(e) => setSelectedRuangan(e.target.value ? parseInt(e.target.value) : null)}

        <div>
            <h5 className='text-center py-3' style={{ fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '#222' }}>Total biaya Meeting</h5>
            <div className='my-2 d-flex justify-content-center'>
                <Form.Select
                    id={theme === 'light' ? 'select-chart-dark' : 'select-chart-light'}
                    onChange={(e) => {
                        const year = parseInt(e.target.value, 10);
                        setSelectedYear(year); // Trigger useEffect when this changes
                    }}
                    defaultValue=""
                    style={{
                        width: 'auto',
                        maxWidth: '160px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        fontSize: '15px'
                    }}
                >
                    <option value="">Pilih Tahun</option>
                    <option value={year}>{year}</option>
                    <option value={year - 1}>{year - 1}</option>
                    <option value={year - 2}>{year - 2}</option>
                    <option value={year - 3}>{year - 3}</option>
                    <option value={year - 4}>{year - 4}</option>
                </Form.Select>
            </div>
            {
                isMobile ?
                    (
                        <Bar data={dataMobile} options={optionsMobile} height={500} className='py-3 px-3' />
                    )
                    :
                    (
                        <Bar data={dataDekstop} options={optionsDekstop} height={140} className='py-3 px-3' />
                    )
            }

        </div>
    )
}

export default ChartComponent
