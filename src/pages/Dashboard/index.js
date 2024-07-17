import React, { useContext, useEffect, useState } from 'react'
import { HeaderMobile, HeaderWeb, SidebarComponent } from '../../components'
import { Card, Col, Container,  Row } from 'react-bootstrap'
import { AuthContext, ThemeContext } from '../../auth';
import { useMediaQuery } from 'react-responsive';
import { CiCalendarDate, CiSliderVertical, CiViewList } from 'react-icons/ci';
import { VscHistory } from 'react-icons/vsc';
import axios from '../../api/axios';


function Dashboard ()
{
    const { theme } = useContext( ThemeContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const [ listMeeting, setListMeeting ] = useState( [] );
    const [ meetingToday, setMeetingToday ] = useState( [] );
    const [ historyMeeting, setHistoryMeeting ] = useState( [] );
    const [ listRuangan, setListRuangan ] = useState( [] );
    const tokenUser = tokens?.token;

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

                const filterData = res.data.filter( item => item.status === "processing" );
                setListMeeting( filterData );

                const onGoingMeeting = res.data.filter( item => item.status === "approved" && item.finished === false );
                setMeetingToday( onGoingMeeting );

                const historyFilter = res.data.filter( item =>
                {
                    return ( item.status === "approved" || item.status === "denied" ) && item.finished === true;
                } );
                setHistoryMeeting( historyFilter );
                // console.log( res.data )
            } ).catch( err =>
            {
                console.log( err )
            } )
    }

    const retrieveRuangan = () =>
    {
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
                // console.log( res.data )
            } ).catch( err =>
            {
                // console.log( err )
            } )
    }

    useEffect( () =>
    {
        const interval = setInterval( () =>
        {
            if ( tokenUser !== undefined ) retrieveMeeting();
            if ( tokenUser !== undefined ) retrieveRuangan()
        }, 5000 );
        return () => clearInterval( interval );
    }, [ tokenUser ] );



    return (
        <div style={ { overflowX: 'hidden', maxWidth : '100vw' } }>
                <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                   <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '94vw' : '84.5vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '' } }>
                                Dashboard
                            </h3>
                        </Col>
                        <Col xs={ 6 } lg={ 6 } className={ isMobile === false ? 'text-end my-auto' : 'mt-auto' }>
                            { isMobile === false ? (
                                <HeaderWeb />
                            ) : (
                                <HeaderMobile />
                            ) }
                        </Col>
                    </Row>
                   </div>
                <hr className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw', border: '1px solid', borderColor: theme === 'light' ? '#FFFFFF' : '#000A2E', marginTop: '5px' } } />
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw' } }>
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
                                                    background: theme === 'light' ? '#000A2E' : '#000A2E'
                                                } }
                                            >
                                            <span >
                                                <CiSliderVertical size={ 30 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                Request
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { listMeeting?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
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
                                                    background: theme === 'light' ? '#000A2E' : '#000A2E'
                                                } }
                                            >
                                            <span >
                                                <CiCalendarDate size={ 35 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                Meeting
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { meetingToday?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
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
                                                    background: theme === 'light' ? '#000A2E' : '#000A2E'
                                                } }
                                            >
                                            <span >
                                                <VscHistory size={ 30 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                History
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { historyMeeting?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
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
                                                    background: theme === 'light' ? '#000A2E' : '#000A2E'
                                                } }
                                            >
                                            <span >
                                                <CiViewList size={ 30 } color='#FFFFFF' />
                                            </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                Ruangan
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                { listRuangan?.length || '0' }
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                        Jumlah keseluruhan Ruangan.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                    </Row>
                    </div>
                </Container>
        </div>
        //         <>
        //    <Container
        //                 fluid
        //                 style={ { backgroundColor: theme === 'light' ? '#3D495F' : '#F1F1F1', minHeight: '90.4vh' } }
        //             >
        //                 <div>
                            
         //               </div>
        //             </Container>
        //       </>

    )
}

export default Dashboard
