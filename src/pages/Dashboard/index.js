import React, { useContext } from 'react'
import { Header, SidebarComponent } from '../../components'
import { Card, Col, Container,  Row } from 'react-bootstrap'
import { AuthContext, ThemeContext } from '../../auth';
import { useMediaQuery } from 'react-responsive';

function Dashboard ()
{
    const { theme } = useContext( ThemeContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, userInfo } = useContext( AuthContext );

    return (
        <div style={ { overflowX: 'hidden', maxWidth : '100vw' } }>
                <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerApp' : 'containerApp' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                   <div>
                    <Row style={ { maxWidth: showSidebar ? '93vw' : '84vw' }}>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular' } }>
                                Dashboard
                            </h3>
                        </Col>
                        <Col xs={ 6 } lg={ 6 } className='text-end my-auto'>
                        <Header/>
                        </Col>
                    </Row>
                   </div>
                <hr className='text-end' style={ { maxWidth: showSidebar ? '93vw' : '84vw', border: '1px solid', borderColor: '#000A2E', marginTop : '5px' } } />
                    <div className='pt-4'>
                        {/* <Row>
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
                                                    <Icon path={ mdiMessageBadge } size={ 1 } color={ "white" } />
                                                </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                    Request Meeting
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                    56
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                            Jumlah request untuk ruangan Meeting.
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
                                                    <Icon path={ mdiCalendarToday } size={ 1 } color={ "white" } />
                                                </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                    Meeting per Hari
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                    12
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                            Jumlah Meeting hari ini.
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
                                                    <Icon path={ mdiOfficeBuilding } size={ 1 } color={ "white" } />
                                                </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                    Jumlah Gedung
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                    3
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                            Keseluruhan jumlah Gedung.
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
                                                    <Icon path={ mdiDoorOpen } size={ 1 } color={ "white" } />
                                                </span>
                                            </div>
                                        </Col>
                                        <Col className='text-end'>
                                            <div className='me-2 mt-2'>
                                                <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px', marginBottom: '0px' } }>
                                                    Jumlah Ruangan
                                                </p>
                                                <h3 style={ { fontFamily: 'Poppins-SemiBold' } }>
                                                    18
                                                </h3>
                                            </div>
                                        </Col>
                                    </Row>
                                    <hr className='mx-1' style={ { marginTop: '0px', color: '#222222' } } />
                                    <div className='ms-2 my-auto'>
                                        <p style={ { fontFamily: 'Poppins-Light', fontSize: '15px' } }>
                                            Jumlah ruangan untuk Meeting.
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                        </Row> */}
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