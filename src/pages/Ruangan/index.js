import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { SidebarComponent, HeaderDetailPage, HeaderMobile2, TableRuanganDark, TableRuanganLight } from '../../components';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function Ruangan ()
{
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const [ listRuangan, setListRuangan ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();

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
                // console.log( res.data )
            } ).catch( err =>
            {
                setLoading( false ); 
                if ( err.response?.status === 401 ) {
                    Swal.fire( {
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Sesi Anda telah berakhir. Silahkan Login kembali.',
                        confirmButtonText: 'Login',
                    } ).then( ( result ) =>
                    {
                        if ( result.isConfirmed ) {
                            navigate( '/' );
                        }
                    } );

                } else ( console.error( err ) )
            } )
    }

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) retrieveRuangan()
    }, [ tokenUser ] );


    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '93.5vw' : '84vw' } }>
                        <Col xs={ 12 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' } }>
                                Daftar Ruangan
                            </h3>
                        </Col>
                        <Col xs={ 12 } lg={ 6 } className={ isMobile === false ? 'text-end my-auto' : 'my-auto' }>
                            { isMobile === false ? (
                                <HeaderDetailPage />
                            ) : (
                                    <></>
                            ) }
                        </Col>
                    </Row>
                </div>
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91vw' : '81vw' } }>
                    { loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={ { height: '200px' } }>
                            <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                        </div>
                    ) : (
                        theme === 'light' ? (
                            <TableRuanganDark
                                listRuangan={ listRuangan }
                                retrieveRuangan={ retrieveRuangan }
                                tokenUser={ tokenUser }
                            />
                            ) : (
                                <TableRuanganLight
                                    listRuangan={ listRuangan }
                                    retrieveRuangan={ retrieveRuangan }
                                    tokenUser={ tokenUser }
                                />
                        )
                    ) }
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
            </Container>
        </div>
    )
}

export default Ruangan
