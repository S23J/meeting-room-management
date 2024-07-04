import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { AuthContext, ThemeContext } from '../../auth';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderMobile, HeaderWeb, SidebarComponent } from '../../components';
import { Card, Col, Container, Row } from 'react-bootstrap';
import axios from '../../api/axios';
import Swal from 'sweetalert2';

function RuanganDetail ()
{
    const { ruangid } = useParams();
    // console.log( ruangid );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();

    const [ detailRuangan, setDetailRuangan ] = useState( {} );

    const retrieveDetailRuangan = () =>
    {
        axios.get( `/manage/ruangan/${ruangid}/`,
            {
                headers:
                {
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {
                setDetailRuangan( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {
                if ( err.response?.status === 401 ) {
                    Swal.fire( {
                        icon: 'error',
                        title: 'Sesi telah habis',
                        text: 'Sesi anda telah berakhir. Silahkan login kembali.',
                        confirmButtonText: 'Log In',
                    } ).then( ( result ) =>
                    {
                        if ( result.isConfirmed ) {

                            navigate( '/' );
                        }
                    } );

                } else ( console.log( err ) )
            } )
    }
    useEffect( () =>
    {
        if ( ruangid !== undefined ) {
            retrieveDetailRuangan()
        } else if ( tokenUser !== undefined ) {
            retrieveDetailRuangan()
        }

    }, [ ruangid, tokenUser ] )



    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerApp' : 'containerApp' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '94vw' : '84.5vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular' } }>
                                Detail Ruangan
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
                    <Row>
                        <Col xs={ 12 } md={ 6 } lg={ 6 }>
                            <Card>
                                <Card.Body>
                                    <p>
                                        { detailRuangan?.nama_ruangan }

                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={ 12 } md={ 6 } lg={ 6 }>
                            <Card>
                                <Card.Body>
                                    <p>
                                        { detailRuangan?.nama_ruangan }

                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {/* <MantineReactTable
                        table={ table }
                    /> */}
                </div>
            </Container>
        </div>
    )
}

export default RuanganDetail
