import React, { useEffect, useState, useContext } from 'react'
import { Bar } from 'react-chartjs-2';
import
{
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



ChartJS.register( ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

function ChartComponent ()
{
    const { tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const tokenUser = tokens?.token;
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const [ meetingData, setMeetingData ] = useState( [] );
    const [ listRuangan, setListRuangan ] = useState( [] );
    const [ selectedRuangan, setSelectedRuangan ] = useState( null );
    const [ dataChart, setDataChart ] = useState( [] );

    const retrieveMeeting = () =>
    {
        axios.get( `/manage/requests/`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ${tokenUser}`,
            },
        } )
            .then( res =>
            {
                const currentYear = new Date().getFullYear();

                const historyFilter = res.data.filter( item =>
                {
                    const meetingDate = new Date( item.waktu_selesai );
                    const meetingYear = meetingDate.getFullYear();
                    return item.status === "approved" && item.finished === true && meetingYear === currentYear;
                } );

                setMeetingData( historyFilter );
            } )
            .catch( err =>
            {
                console.error( err );
            } );
    };

    const retrieveMRuangan = () =>
    {
        axios.get( `/manage/ruangan/`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ${tokenUser}`,
            },
        } )
            .then( res =>
            {
                setListRuangan( res.data );
            } )
            .catch( err =>
            {
                console.error( err );
            } );
    };

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) {
            retrieveMeeting();
            retrieveMRuangan();
        }
    }, [ tokenUser ] );

    useEffect( () =>
    {
        const meetingsPerMonth = Array( 12 ).fill( 0 );

        meetingData.forEach( meeting =>
        {
            const monthIndex = new Date( meeting.waktu_mulai ).getMonth();
            if ( !selectedRuangan || meeting.ruangan === selectedRuangan ) {
                meetingsPerMonth[ monthIndex ]++;
            }
        } );

        setDataChart( meetingsPerMonth );
    }, [ meetingData, selectedRuangan ] );

    const dataMobile = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des'
        ],
        datasets: [
            {
                label: `Jumlah Meeting`,
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
                label: `Jumlah Meeting`,
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

        <div>
            <h5 className='text-center py-3' style={ { fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '#222' } }>Jumlah Meeting per Ruangan</h5>
            <div className='my-2 d-flex justify-content-center'>
                <Form.Select
                    id={ theme === 'light' ? 'select-chart-dark' : 'select-chart-light' }
                    onChange={ ( e ) => setSelectedRuangan( e.target.value ? parseInt( e.target.value ) : null ) }
                    defaultValue=""
                    style={ {
                        width: 'auto',
                        maxWidth: '160px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        fontSize: '15px'
                    } }
                >
                    <option value="">Pilih Ruangan</option>
                    { listRuangan.map( ( ruangan ) => (
                        <option key={ ruangan.id } value={ ruangan.id }>
                            { ruangan.nama_ruangan }
                        </option>
                    ) ) }
                </Form.Select>
            </div>
            {
                isMobile ?
                    (
                        <Bar data={ dataMobile } options={ optionsMobile } height={ 500 } className='py-3 px-3' />
                    )
                    :
                    (
                        <Bar data={ dataDekstop } options={ optionsDekstop } height={ 90 } className='py-3 px-3' />
                    )
            }

        </div>
    )
}

export default ChartComponent
