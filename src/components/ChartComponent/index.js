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
import { Col, Form, Row } from 'react-bootstrap';
import { color } from 'chart.js/helpers';


ChartJS.register( ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

function ChartComponent ()
{
    const { tokens, userInfo } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const tokenUser = tokens?.token;
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const [ historyMeeting, setHistoryMeeting ] = useState( [] );
    const today = new Date();
    const year = today.getFullYear();
    const [ selectedYear, setSelectedYear ] = useState( year );

    const retrieveMeeting = () =>
    {
        axios.get( `/manage/requests/`,
            {
                headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {

                const historyFilter = res.data.filter( item => item.status === "approved" && item.finished === true );
                setHistoryMeeting( historyFilter );

                // console.log( res.data )
            } ).catch( err =>
            {
                console.error( err );
            } )
    };

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) retrieveMeeting();
    }, [ tokenUser ] );

    const handleYearChange = ( e ) =>
    {
        setSelectedYear( e.target.value );
    };

    const meetingsPerMonth = Array( 12 ).fill( 0 );

    historyMeeting.forEach( ( meeting ) =>
    {
        const meetingDate = new Date( meeting.waktu_mulai );
        const meetingYear = meetingDate.getFullYear();
        if ( meetingYear === parseInt( selectedYear ) ) {
            const meetingMonth = meetingDate.getMonth(); // Get the month (0 = January, 11 = December)
            meetingsPerMonth[ meetingMonth ] += 1; // Count meetings for the month
        }
    } );

    const data = {
        labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des'
        ],
        datasets: [
            {
                label: `Jumlah Meeting`,
                backgroundColor: [
                    '#2f4b7c',
                ],
                borderColor: [
                    '#2f4b7c',
                ],
                borderWidth: 1,
                data: meetingsPerMonth,
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

    const options = {
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

        <div >
            <h5 className='text-center py-3' style={ { fontFamily: 'Poppins-Regular' } }>Jumlah Meeting per Tahun</h5>
            <div className='my-2 ms-2' style={ { maxWidth: '160px' } }>
                <Form.Select
                    id={ theme === 'light' ? 'select-year-chart-dark' : 'select-year-chart-light' }
                    aria-label="Select Year"
                    onChange={ ( e ) => setSelectedYear( parseInt( e.target.value ) ) }
                    value={ selectedYear }
                >
                    <option value={ year }>{ year }</option>
                    <option value={ year - 1 }>{ year - 1 }</option>
                    <option value={ year - 2 }>{ year - 2 }</option>
                    <option value={ year - 3 }>{ year - 3 }</option>
                    <option value={ year - 4 }>{ year - 4 }</option>
                </Form.Select>
            </div>
            <Bar data={ data } options={ options } height={ isMobile ? 500 : 90 } className='py-3 px-3' />
        </div>
    )
}

export default ChartComponent
