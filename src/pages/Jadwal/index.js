import React, { useContext } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { HeaderMobile, HeaderWeb, SidebarComponent } from '../../components';
import { Col, Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';

function Jadwal ()
{
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, userInfo } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerApp' : 'containerApp' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '94vw' : '84.5vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular' } }>
                                Jadwal Meeting
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
                <hr className='text-end' style={ { maxWidth: showSidebar ? '93vw' : '84vw', border: '1px solid', borderColor: '#000A2E', marginTop: '5px' } } />
                <div className='pt-4'>
                </div>
            </Container>
        </div>
    )
}

export default Jadwal
