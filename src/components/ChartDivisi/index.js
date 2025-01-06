import React, { useContext, useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { AuthContext, ThemeContext } from '../../auth';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/axios';
import { AspectRatio } from '@mantine/core';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartDivisi() {

    const { tokens } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const tokenUser = tokens?.token;
    const isMobile = useMediaQuery({ maxWidth: 767 });
    // Updated initial state for dataChart
    const [dataChart, setDataChart] = useState({ labels: [], dataValues: [] });

    const retrieveMeetingDivisi = () => {
        axios.get(`/manage/requests/doughnut_chart/`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ${tokenUser}`,
            },
        })
            .then(res => {

                const labels = res.data.map((item) => item.division || "Belum ada divisi");
                const dataValues = res.data.map((item) => item.total_cost || 0);
                setDataChart({ labels, dataValues });
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (tokenUser) {
            retrieveMeetingDivisi();
        }
    }, [tokenUser]);

    const data = {
        labels: dataChart.labels, // Use labels extracted from the API
        datasets: [
            {
                label: 'Total Biaya: ',
                Filler: true,
                backgroundColor: [
                    theme === 'light' ? '#FFF471' : '#006CB8',
                    '#816fc0',
                    '#e162aa',
                    '#ff6d68',
                    '#ffa600',
                ],
                borderColor: [
                    theme === 'light' ? '#FFF471' : '#006CB8',
                    '#816fc0',
                    '#e162aa',
                    '#ff6d68',
                    '#ffa600',
                ],
                borderWidth: 0,
                data: dataChart.dataValues, // Use the processed data array
            },
        ],
    };

    const numberFormat = (value) =>
        new Intl.NumberFormat('IN-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);

    const [hoveredData, setHoveredData] = useState({
        text: '',
        color: '#000',
        value: 0,
        percentage: 0,
    });

    let debounceTimer;

    const handleHover = (event, elements) => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            if (elements && elements.length > 0) {
                const index = elements[0]?.index;
                if (index !== undefined && index !== null) {
                    const value = data.datasets[0].data[index];
                    const label = data.labels[index];
                    const backgroundColor = data.datasets[0].backgroundColor[index];
                    const total = data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);

                    // Use Math.round to round percentage to the nearest whole number
                    const percentage = Math.round((value / total) * 100);

                    setHoveredData({
                        text: label,
                        value: value,
                        percentage: percentage, // Now an integer
                        color: backgroundColor,
                    });
                }
            } else {
                setHoveredData({ text: '', color: '#000', value: 0, percentage: 0 });
            }
        }, 70);
    };

    useEffect(() => {
        return () => {
            clearTimeout(debounceTimer);
            setHoveredData({ text: '', color: '#000', value: 0, percentage: 0 });
        };
    }, []);


    const config = {
        type: 'doughnut',
        cutout: '80%',
        data: data,
        maintainAspectRatio: false,
        width: 80,
        height: 80,
        elements: {
            arc: {
                borderWidth: 1,
            },
        },
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
        },
        Poppinsactions: {
            mode: 'index',
            Poppinssect: false,
        },

        onHover: handleHover,

    };

    const navigate = useNavigate();

    const cetakData = (row) => {
        navigate("/print-meeting-divisi/")
    }


    return (
        <div>
            <h5 className='text-center' style={{ fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '#222' }}>Total biaya Meeting per Divisi</h5>
            <div className='mx-auto'
                style={{ position: 'relative', width: '250px', height: '300px' }}
            >
                <Doughnut
                    data={data}
                    options={config}
                    id='doughnutChart2'
                />
                {hoveredData.text && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            color: hoveredData.color,
                        }}
                    >
                        <h5 style={{ fontFamily: 'Poppins-Medium' }}>{hoveredData.text}</h5>
                        <p style={{ fontFamily: 'Poppins-Regular' }}>{numberFormat(hoveredData.value)}</p>
                        <h2 style={{ fontFamily: 'Poppins-Regular' }}>{hoveredData.percentage}%</h2>
                    </div>
                )}
            </div>
            <div className='text-center'>
                <Button
                    variant='btn'
                    id={theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight'}
                    onClick={cetakData}
                >
                    Cetak
                </Button>
            </div>
        </div>

    )
}

export default ChartDivisi
