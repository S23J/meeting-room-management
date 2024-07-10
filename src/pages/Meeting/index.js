import React, { useContext } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { HeaderMobile, HeaderWeb, SidebarComponent } from '../../components';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { TabsHistoryMeeting, TabsRequestMeeting, TabsTodaysMeeting } from '../../components/TabsComponent';

function Meeting ()
{
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerApp' : 'containerApp' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '94vw' : '84.5vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular' } }>
                                Daftar Meeting
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
                <hr className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw', border: '1px solid', borderColor: '#000A2E', marginTop: '5px' } } />
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw' } }>
                    <Tabs
                        id="controlled-tab-meeting"
                        defaultActiveKey="request"
                        className="mb-3"
                    >
                        <Tab eventKey="request" title="Request">
                            <TabsRequestMeeting />
                        </Tab>
                        <Tab eventKey="meeting" title="Meeting">
                            <TabsTodaysMeeting />
                        </Tab>
                        <Tab eventKey="history" title="History">
                            <TabsHistoryMeeting />
                        </Tab>
                    </Tabs>
                </div>
            </Container>
        </div>
    )
}

export default Meeting
