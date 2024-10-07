import React, { useContext, useEffect, useState } from 'react'
import { ChartComponent, HeaderMobile, HeaderWeb, SidebarComponent } from '../../components'
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { AuthContext, ThemeContext } from '../../auth';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/axios';
import { FaDoorOpen } from 'react-icons/fa';
import { MdLibraryBooks, MdWorkHistory } from 'react-icons/md';
import { IoCalendar, IoTime } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


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
    const navigate = useNavigate();

    const retrieveMeeting = ( showLoading = true ) =>
    {
        if ( showLoading ) setLoading( true );

        axios
            .get( `/manage/requests/`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },
            } )
            .then( ( res ) =>
            {
                const filterData = res.data.filter( ( item ) => item.status === 'processing' );
                setListMeeting( filterData );

                const onGoingMeeting = res.data.filter(
                    ( item ) => item.status === 'approved' && item.finished === false
                );
                setMeetingToday( onGoingMeeting );

                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const currentMonthMeetings = res.data.filter( ( item ) =>
                {
                    const isApprovedAndFinished = item.status === 'approved' && item.finished === true;

                    if ( item.waktu_selesai && isApprovedAndFinished ) {
                        const endDate = new Date( item.waktu_selesai );
                        return (
                            endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear
                        );
                    }
                    return false;
                } );

                setHistoryMeeting( currentMonthMeetings );
                if ( showLoading ) setLoading( false );
            } )
            .catch( ( err ) =>
            {
                if ( showLoading ) setLoading( false );
                console.error( err );
            } );
    };

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
        if ( tokenUser !== undefined ) retrieveMeeting( true );
        if ( tokenUser !== undefined ) retrieveRuangan( true );
    }, [ tokenUser ] );

    useEffect( () =>
    {
        const interval = setInterval( () =>
        {
            if ( tokenUser !== undefined ) retrieveMeeting( false ); 
        }, 5000 );

        return () => clearInterval( interval ); 
    }, [ tokenUser ] );

    const dataOngoingMeeting = meetingToday.map( ( data, index ) =>
    {
        const dateTime = new Date( data?.waktu_mulai );
        const formattedDate = dateTime.toLocaleDateString( 'en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        } );

        if ( index > 2 ) {
            return null; // Skip rendering for indices greater than 3
        }

        return (
            <div key={ index }>
                <Row>
                    <Col xs={ 8 } className='text-start'>
                        <div style={ { display: 'flex', alignItems: 'flex-start' } }>
                            <div
                                className='my-auto'
                                style={ {
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: theme === 'light' ? '2px solid #FFF471' : '2px solid #006CB8',
                                    backgroundColor: 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '8px',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '16px',
                                    color: theme === 'light' ? '#FFF471' : '#006CB8',
                                } }
                            >
                                { index + 1 }
                            </div>
                            <div className='pt-3'>
                                <p
                                    style={ {
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: '18px',
                                        marginBottom: '0px',
                                        color: theme === 'light' ? '#FFFFFF' : '#222'
                                    } }
                                >
                                    { data?.nama_meeting }
                                </p>
                                <p
                                    style={ {
                                        fontFamily: 'Poppins-Light',
                                        fontSize: '15px',
                                        color: '#707070',
                                        marginTop: '0px',
                                    } }
                                >
                                    { formattedDate }
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={ 4 } className='text-end'>
                        <p
                            className='pt-3'
                            style={ {
                                fontFamily: 'Poppins-Light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                color: theme === 'light' ? '#FFFFFF' : '#222',
                                margin: 0,
                            } }
                        >
                            <IoTime size={ 18 } color={ theme === 'light' ? '#FFF471' : '#006CB8' } style={ { marginRight: '8px' } } />
                            { data?.waktu_mulai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }
                        </p>
                    </Col>
                </Row>
                {/* Show "lihat selengkapnya" if index is 3 */ }
                { index === 2 && (
                    <div className='text-center mt-2'>
                        <button
                            onClick={ () => navigate( '/meeting/' ) }
                            style={ {
                                background: 'none',
                                border: 'none',
                                color: theme === 'light' ? '#FFF471' : '#006CB8',
                                fontFamily: 'Poppins-Regular',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            } }
                        >
                            lihat selengkapnya
                        </button>
                    </div>
                ) }
            </div>
        );
    } );

    return (
        <div style={ { overflowX: 'hidden', maxWidth : '100vw' } }>
                <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <Row className='mb-2 pt-2' style={ { maxWidth: isMobile ? '100vw' : showSidebar ? '93vw' : '84vw' } }>
                    <Col xs={ 12 } md={ 6 } className='mt-3'>
                        <Row >
                            <Col xs={ 8 } lg={ 8 } className='text-start'>
                                <h3 style={ { fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' } }>
                                    Dashboard
                                </h3>
                                <p style={ { fontFamily: 'Poppins-Light', color: theme === 'light' ? '#FFFFFF' : '#707070', marginTop: '0px', marginBottom: '0px' } }>
                                    Welcome, { userInfo?.first_name }  { userInfo?.last_name }
                                </p>
                            </Col>
                            <Col xs={ 4 } lg={ 4 } className={ isMobile === false ? 'text-end my-auto' : 'text-end my-auto' }>
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
                    {
                        isMobile ?
                            (
                                <></>
                            )
                            :
                            (
                                <>
                                    <Col xs={ 12 } md={ 1 } className='mt-3'></Col>
                                </>
                            )
                    }
                    <Col xs={ 12 } md={ 5 } className='mt-3'>
                        <h4
                            className='text-center'
                            style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFFFFF' : '' } }
                        >
                            Meeting sedang berjalan
                        </h4>
                        { loading ? (
                            <div
                                className='d-flex justify-content-center align-items-center'
                                style={ { height: '200px' } }
                            >
                                <Spinner animation='border' style={ { color: theme === 'light' ? '#F3C623' : '#2f4b7c' } } />
                            </div>
                        ) : (
                                <div style={ { overflowY: 'hidden', overflowX: 'hidden', maxHeight: '340px' } }>
                                { dataOngoingMeeting }
                            </div>
                        ) }
                    </Col>
                </Row>

                <div className='mt-4' style={ {
                    backgroundColor: theme === 'light' ? 'rgba(52,58,64, 0.4)' : 'rgba(52, 80, 133, 0.15)',
                    minHeight: '250px',
                    borderRadius: '30px',
                    maxWidth: isMobile ? '100vw' : showSidebar ? '91.5vw' : '82.5vw'
                } }>
                    <Row className="justify-content-center align-items-center" style={ { minHeight: '250px' } }>
                        <Col xs={ 12 } md={ 4 } className="my-auto text-center">
                            <h4 className={ isMobile ? 'mt-3' : 'pt-3' } style={ { fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFF471' : '#006CB8' } }>
                                Meetings
                            </h4>
                            <p style={ { fontFamily: 'Poppins-Light', color: '#707070' } }>
                                Informasi terkait meeting
                            </p>
                        </Col>
                        <Col xs={ 12 } md={ 8 } className="d-flex justify-content-center my-3">
                            <Row style={ { maxWidth: isMobile ? '200px' : '' } }>
                                <Col xs={ 12 } md={ 3 } className='my-4'>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboard1-Dark' : 'cardDashboard1-Light' }
                                        style={ { minHeight: '150px', minWidth: isMobile ? '80px' : '150px' } }
                                    >
                                        <div
                                            className='icon-box'
                                            style={ {
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            } }
                                        >
                                            <span>
                                                <IoCalendar size={ 25 } color={ theme === 'light' ? '#121212' : '#FFFFFF' } />
                                            </span>
                                        </div>

                                        { loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={ {
                                                            fontFamily: 'Poppins-Regular',
                                                            fontSize: '18px',
                                                            marginBottom: '0px',
                                                            color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                        } }
                                                    >
                                                        Permintaan
                                                </p>

                                                    <h2 className='mt-2 text-center' style={ { fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' } }>
                                                        { listMeeting?.length || '0' }
                                                    </h2>
                                            </div>
                                        ) }
                                    </Card>
                                </Col>
                                <Col xs={ 12 } md={ 3 } className='my-4'>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboard2-Dark' : 'cardDashboard2-Light' }
                                        style={ { minHeight: '150px', minWidth: isMobile ? '80px' : '150px' } }
                                    >
                                        <div
                                            className='icon-box'
                                            style={ {
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            } }
                                        >
                                            <span >
                                                <MdLibraryBooks size={ 25 } color={ theme === 'light' ? '#121212' : '#FFFFFF' } />
                                            </span>
                                        </div>

                                        { loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={ {
                                                        fontFamily: 'Poppins-Regular',
                                                        fontSize: '18px',
                                                        marginBottom: '0px',
                                                        color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                    } }
                                                >
                                                    Meeting
                                                </p>
                                                    <h2 className='mt-2 text-center' style={ { fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' } }>
                                                        { meetingToday?.length || '0' }
                                                    </h2>
                                            </div>
                                        ) }

                                    </Card>
                                </Col>
                                <Col xs={ 12 } md={ 3 } className='my-4'>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboard3-Dark' : 'cardDashboard3-Light' }
                                        style={ { minHeight: '150px', minWidth: isMobile ? '80px' : '150px' } }
                                    >
                                        <div
                                            className='icon-box'
                                            style={ {
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            } }
                                        >
                                            <span >
                                                <MdWorkHistory size={ 25 } color={ theme === 'light' ? '#121212' : '#FFFFFF' } />
                                            </span>
                                        </div>

                                        { loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={ {
                                                        fontFamily: 'Poppins-Regular',
                                                        fontSize: '18px',
                                                        marginBottom: '0px',
                                                        color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                    } }
                                                >
                                                    Riwayat
                                                </p>
                                                    <h2 className='mt-2 text-center' style={ { fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' } }>
                                                        { historyMeeting?.length || '0' }
                                                    </h2>
                                            </div>
                                        ) }

                                    </Card>
                                </Col>
                                <Col xs={ 12 } md={ 3 } className='my-4'>
                                    <Card
                                        id={ theme === 'light' ? 'cardDashboard4-Dark' : 'cardDashboard4-Light' }
                                        style={ { minHeight: '150px', minWidth: isMobile ? '80px' : '150px' } }
                                    >
                                        <div
                                            className='icon-box'
                                            style={ {
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            } }
                                        >
                                            <span >
                                                <FaDoorOpen size={ 25 } color={ theme === 'light' ? '#121212' : '#FFFFFF' } />
                                            </span>
                                        </div>

                                        { loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={ {
                                                        fontFamily: 'Poppins-Regular',
                                                        fontSize: '18px',
                                                        marginBottom: '0px',
                                                        color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                    } }
                                                >
                                                    Ruangan
                                                </p>
                                                    <h2 className='mt-2 text-center' style={ { fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' } }>
                                                        { listRuangan?.length || '0' }
                                                    </h2>
                                            </div>
                                        ) }

                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <br />
                </Container>
        </div>
    )
}

export default Dashboard
