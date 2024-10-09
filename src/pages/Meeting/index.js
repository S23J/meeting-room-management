import React, { useContext } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { SidebarComponent } from '../../components';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import
    {
        TabsHistoryMeetingDark,
        TabsHistoryMeetingLight,
        TabsRequestMeetingDark,
        TabsRequestMeetingLight,
        TabsTodaysMeetingDark,
        TabsTodaysMeetingLight
    } from '../../components/TabsComponent';

function Meeting ()
{
    const isMobile = useMediaQuery( { maxWidth: 1024 } );
    const { showSidebar } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div className='ms-3'>
                    <Row style={ { maxWidth: isMobile ? '100vw' : showSidebar ? '93.5vw' : '81vw' } }>
                        <Col xs={ 12 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' } }>
                                Daftar Meeting
                            </h3>
                        </Col>
                    </Row>
                </div>
                <div className='ms-3 pt-4' style={ { maxWidth: isMobile ? '100vw' : showSidebar ? '90vw' : '81vw' } }>
                    <Tabs
                        id="controlled-tab-meeting"
                        defaultActiveKey="request"

                        fill
                        style={ { fontFamily: 'Poppins-Regular' } }
                    >
                        <Tab eventKey="request" title="Permintaan">
                            {
                                theme === 'light' ?
                                    <TabsRequestMeetingDark />
                                    :
                                    <TabsRequestMeetingLight />
                            }
                        </Tab>
                        <Tab eventKey="meeting" title="Jadwal">
                            {
                                theme === 'light' ?
                                    <TabsTodaysMeetingDark />
                                    :
                                    <TabsTodaysMeetingLight />
                            }
                        </Tab>
                        <Tab eventKey="history" title="Riwayat">
                            {
                                theme === 'light' ?
                                    <TabsHistoryMeetingDark />
                                    :
                                    <TabsHistoryMeetingLight />
                            }
                        </Tab>
                    </Tabs>
                    <br />
                    <br />
                </div>
            </Container>
        </div>
    )
}

export default Meeting
