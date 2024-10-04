import React, { useContext, useEffect, useState } from 'react'
import { ChartComponent, HeaderMobile, HeaderWeb, SidebarComponent } from '../../components'
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { AuthContext, ThemeContext } from '../../auth';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/axios';
import { FaDoorOpen } from 'react-icons/fa';
import { MdLibraryBooks, MdWorkHistory } from 'react-icons/md';
import { IoCalendar, IoTime } from 'react-icons/io5';


function Dashboard ()
{
    const { theme } = useContext( ThemeContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { userInfo, showSidebar, tokens } = useContext( AuthContext );
    const [ listMeeting, setListMeeting ] = useState( [] );
    const [ meetingToday, setMeetingToday ] = useState( [] );
    const [ historyMeeting, setHistoryMeeting ] = useState( [] );
    const [ listRuangan, setListRuangan ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const tokenUser = tokens?.token;

    const retrieveMeeting = () =>
    {
        setLoading( true );
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
                const filterData = res.data.filter( item => item.status === "processing" );
                setListMeeting( filterData );

                const onGoingMeeting = res.data.filter( item => item.status === "approved" && item.finished === false );
                setMeetingToday( onGoingMeeting );

                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const currentMonthMeetings = res.data.filter( item =>
                {
                    const isApprovedAndFinished = item.status === "approved" && item.finished === true;

                    if ( item.waktu_selesai && isApprovedAndFinished ) {
                        const endDate = new Date( item.waktu_selesai );
                        return (
                            endDate.getMonth() === currentMonth &&
                            endDate.getFullYear() === currentYear
                        );
                    }
                    return false;
                } );

                setHistoryMeeting( currentMonthMeetings );
                setLoading( false );
            } ).catch( err =>
            {
                setLoading( false );
                console.error( err );
            } )
    }

    const retrieveRuangan = () =>
    {
        setLoading( true );
        axios.get( `/manage/ruangan/`,
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

                setListRuangan( res.data );
                setLoading( false );
            } ).catch( err =>
            {
                console.error( err );
                setLoading( false );
            } )
    }

    useEffect( () =>
    {
        const interval = setInterval( () =>
        {
            if ( tokenUser !== undefined ) retrieveMeeting();
            if ( tokenUser !== undefined ) retrieveRuangan();
        }, 5000 );
        return () => clearInterval( interval );
    }, [ tokenUser ] );

    // console.log( meetingToday );

    const dataOngoingMeeting = meetingToday.map( ( data, index ) =>
    {
        const dateTime = new Date( data?.waktu_mulai );
        const formattedDate = dateTime.toLocaleDateString( 'en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        } );

        return (
            <div className='mt-3' key={ index }>
                <Row>
                    <Col xs={ 6 } className='text-start'>
                        <div style={ { display: 'flex', alignItems: 'flex-start' } }>
                            <div className='my-auto'
                                style={ {
                                    width: '40px',          // Adjust the size as needed
                                    height: '40px',
                                    borderRadius: '50%',    // Makes it circular
                                    border: '2px solid #2f4b7c', // Gray border for the hollow effect
                                    backgroundColor: 'transparent', // Transparent center
                                    display: 'flex',
                                    alignItems: 'center',    // Center vertically
                                    justifyContent: 'center', // Center horizontally
                                    marginRight: '8px',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '16px',        // Adjust font size to fit inside the circle
                                    color: '#2f4b7c'            // Gray text color for contrast with border
                                } }
                            >
                                { index + 1 }
                            </div>
                            <div className='pt-3'>
                                <p style={ { fontFamily: 'Poppins-Regular', fontSize: '18px', marginBottom: '0px' } }>
                                    { data?.nama_meeting }
                                </p>
                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', color: '#707070', marginTop: '0px' } }>
                                    { formattedDate }
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={ 6 } className='text-end'>
                        <p className='pt-3' style={ { fontFamily: 'Poppins-Light', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: 0 } }>
                            <IoTime size={ 18 } color='#2f4b7c' style={ { marginRight: '8px' } } />
                            { data?.waktu_mulai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }
                        </p>
                    </Col>
                </Row>
            </div>
        );
    } );

    return (
        <div style={ { overflowX: 'hidden', maxWidth : '100vw' } }>
                <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <Row className='mb-3' style={ { maxWidth: isMobile ? '92vw' : showSidebar ? '93vw' : '84vw' } }>
                    <Col xs={ 12 } md={ 6 }>
                        <Row >
                            <Col xs={ 6 } lg={ 6 } className='text-start'>
                                <h3 className='pt-4' style={ { fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' } }>
                                    Dashboard
                                </h3>
                                <p style={ { fontFamily: 'Poppins-Light', color: theme === 'light' ? '#FFFFFF' : '#707070', marginTop: '0px', marginBottom: '0px' } }>
                                    Welcome, { userInfo?.first_name }  { userInfo?.last_name }
                                </p>
                            </Col>
                            <Col xs={ 6 } lg={ 6 } className={ isMobile === false ? 'text-end my-auto' : 'mt-auto' }>
                                { isMobile === false ? (
                                    <HeaderWeb />
                                ) : (
                                    <HeaderMobile />
                                ) }
                            </Col>
                        </Row>
                        <div className='py-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91.5vw' : '82vw' } }>
                            <ChartComponent />
                        </div>
                    </Col>
                    <Col xs={ 12 } md={ 1 }>

                    </Col>
                    <Col xs={ 12 } md={ 5 }>
                        <h4 className='text-center pt-4' style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '' } }>
                            Meeting sedang berjalan
                        </h4>
                        { loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={ { height: '200px' } }>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <div style={ { overflowY: 'auto', overflowX: 'hidden', maxHeight: '340px' } }>
                                { dataOngoingMeeting }
                            </div>
                            ) }
                    </Col>
                </Row>

                <div className='mb-3' style={ {
                    backgroundColor: 'rgba(52, 80, 133, 0.15)',
                    minHeight: '250px',
                    borderRadius: '30px',
                    maxWidth: isMobile ? '92vw' : showSidebar ? '91.5vw' : '82.5vw'
                } }>
                    <Row className='pe-5' style={ { minHeight: '250px' } }>
                        <Col xs={ 12 } md={ 4 } className="my-auto text-center">
                            <h4 style={ { fontFamily: 'Poppins-Medium', color: '#2f4b7c' } }>
                                Meetings
                            </h4>
                            <p style={ { fontFamily: 'Poppins-Light', color: '#707070' } }>
                                Informasi terkait meeting
                            </p>
                        </Col>
                        <Col md={ 1 }>

                        </Col>
                        <Col xs={ 12 } md={ 7 } className="my-auto text-center">
                            <Row>
                                <Col xs={ 12 } md={ 3 }>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboard1-Dark' : 'cardDashboard1-Light' }
                                        style={ { minHeight: '150px', maxWidth: '150px' } }
                                    >

                                    </Card>
                                </Col>
                                <Col xs={ 12 } md={ 3 }>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboard2-Dark' : 'cardDashboard2-Light' }
                                        style={ { minHeight: '150px', maxWidth: '150px' } }
                                    >

                                    </Card>
                                </Col>
                                <Col xs={ 12 } md={ 3 }>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboar3-Dark' : 'cardDashboard3-Light' }
                                        style={ { minHeight: '150px', maxWidth: '150px' } }
                                    >

                                    </Card>
                                </Col>
                                <Col xs={ 12 } md={ 3 }>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboard4-Dark' : 'cardDashboard4-Light' }
                                        style={ { minHeight: '150px', maxWidth: '150px' } }
                                    >

                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                {/* <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91.5vw' : '82vw' } }>
                    <Row>
                            <Col xs={ 12 } md={ 6 } lg={ 3 } className='my-3'>
                                <Card
                                    id={ theme === 'light' ? 'cardDashboard1-Dark' : 'cardDashboard1-Light' }
                                    style={ { minHeight: '80px' } }
                                >
                                    <Row>
                                        <Col >
                                            <div
                                                className='icon-box'
                                                style={ {
                                                    background: '#0079FF'
                                                } }
                                            >
                                            <span >
                                                <IoCalendar size={ 30 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                        <div className='me-3 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                Request
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { listMeeting?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                <hr className='mx-1' style={ { marginTop: '0px', color: theme === 'light' ? 'white' : '#222222' } } />
                                <div className='ms-3 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                        Jumlah request Meeting.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={ 12 } md={ 6 } lg={ 3 } className='my-3'>
                                <Card
                                    id={ theme === 'light' ? 'cardDashboard2-Dark' : 'cardDashboard2-Light' }
                                    style={ { minHeight: '80px' } }
                                >
                                    <Row>
                                        <Col >
                                            <div
                                                className='icon-box'
                                                style={ {
                                                    background: '#059212'
                                                } }
                                            >
                                            <span >
                                                <MdLibraryBooks size={ 28 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                        <div className='me-3 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                Meeting
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { meetingToday?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                <hr className='mx-1' style={ { marginTop: '0px', color: theme === 'light' ? 'white' : '#222222' } } />
                                <div className='ms-3 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                        Jumlah Meeting berjalan.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={ 12 } md={ 6 } lg={ 3 } className='my-3'>
                                <Card
                                    id={ theme === 'light' ? 'cardDashboard3-Dark' : 'cardDashboard3-Light' }
                                    style={ { minHeight: '80px' } }
                                >
                                    <Row>
                                        <Col >
                                            <div
                                                className='icon-box'
                                                style={ {
                                                    background: '#FF0060'
                                                } }
                                            >
                                            <span >
                                                <MdWorkHistory size={ 30 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                        <div className='me-3 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                History
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { historyMeeting?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                <hr className='mx-1' style={ { marginTop: '0px', color: theme === 'light' ? 'white' : '#222222' } } />
                                <div className='ms-3 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                        Jumlah Meeting selesai.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={ 12 } md={ 6 } lg={ 3 } className='my-3'>
                                <Card
                                    id={ theme === 'light' ? 'cardDashboard4-Dark' : 'cardDashboard4-Light' }
                                    style={ { minHeight: '80px' } }
                                >
                                    <Row>
                                        <Col >
                                            <div
                                                className='icon-box'
                                                style={ {
                                                    background: '#7C00FE'
                                                } }
                                            >
                                            <span >
                                                <FaDoorOpen size={ 30 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                        <div className='me-3 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                Ruangan
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { listRuangan?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                <hr className='mx-1' style={ { marginTop: '0px', color: theme === 'light' ? 'white' : '#222222' } } />
                                <div className='ms-3 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                        Jumlah keseluruhan Ruangan.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                    </Row>
                    </div>
                <div className='py-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91.5vw' : '82vw' } }>
                    <ChartComponent />
                </div> */}
                </Container>
        </div>
    )
}

export default Dashboard
