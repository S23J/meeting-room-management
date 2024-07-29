import React, { useContext } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { HeaderDetailPage, HeaderMobile2, SidebarComponent } from '../../components';
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
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '94vw' : '84.5vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '' } }>
                                Daftar Meeting
                            </h3>
                        </Col>
                        <Col xs={ 6 } lg={ 6 } className={ isMobile === false ? 'text-end my-auto' : 'my-auto' }>
                            { isMobile === false ? (
                                <HeaderDetailPage />
                            ) : (
                                    <HeaderMobile2 />
                            ) }
                        </Col>
                    </Row>
                </div>
                <hr className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw', border: '1px solid', borderColor: theme === 'light' ? '#FFFFFF' : '#000A2E', marginTop: '5px' } } />
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91.5vw' : '81.7vw' } }>
                    <Tabs
                        id="controlled-tab-meeting"
                        defaultActiveKey="request"
                        className="mb-3"
                        fill
                        style={ { fontFamily: 'Poppins-Regular' } }
                    >
                        <Tab eventKey="request" title="Request" >
                            {
                                theme === 'light' ?
                                    <TabsRequestMeetingDark />
                                    :
                                    <TabsRequestMeetingLight />
                            }
                        </Tab>
                        <Tab eventKey="meeting" title="Meeting">
                            {
                                theme === 'light' ?
                                    <TabsTodaysMeetingDark />
                                    :
                                    <TabsTodaysMeetingLight />
                            }
                        </Tab>
                        <Tab eventKey="history" title="History">
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
