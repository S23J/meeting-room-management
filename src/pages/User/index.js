import React, { useContext, useEffect, useState } from 'react'
import { HeaderDetailPage, HeaderMobile2, SidebarComponent, TableUserDark, TableUserLight } from '../../components'
import { Col, Container, Row, Spinner } from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive';
import { AuthContext, ThemeContext } from '../../auth';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Swal from 'sweetalert2';


function User ()
{
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const [ listUser, setListUser ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();


    const retrieveUser = () =>
    {
        setLoading( true );
        axios.get( `/auth/users/`,
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
                const validData = res.data.filter( item => item.is_superuser === false );
                setListUser( validData );
                setLoading( false ); 
                // console.log( res.data );

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
        if ( tokenUser !== undefined ) retrieveUser()
    }, [ tokenUser ] );


    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '93.5vw' : '84vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '' } }>
                                Daftar User
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
                <hr className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92vw' : '83vw', border: '1px solid', borderColor: theme === 'light' ? '#FFFFFF' : '#000A2E', marginTop: '5px' } } />
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92vw' : '83vw' } }>
                    { loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={ { height: '200px' } }>
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        theme === 'light' ? (
                            <TableUserDark tokenUser={ tokenUser } listUser={ listUser } retrieveUser={ retrieveUser } />
                        ) : (
                            <TableUserLight tokenUser={ tokenUser } listUser={ listUser } retrieveUser={ retrieveUser } />
                        )
                    ) }
                </div>
                <br />
                <br />
            </Container>
        </div>
    )
}

export default User
