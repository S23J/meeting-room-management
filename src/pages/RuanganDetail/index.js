import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { AuthContext, ThemeContext } from '../../auth';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderMobile, HeaderWeb, SidebarComponent } from '../../components';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';

function RuanganDetail ()
{
    const { ruangid } = useParams();
    // console.log( ruangid );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();

    const buttonBack = () =>
    {
        navigate( -1 )
    }

    const [ detailRuangan, setDetailRuangan ] = useState( {} );
    const [ detailEquipment, setDetailEquipment ] = useState( [] );

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( ruangid !== undefined && tokenUser !== undefined ) {

                await retrieveDetailRuangan();
                await retrieveDetailEquipment();
            }
        };

        fetchData();
    }, [ ruangid, tokenUser ] );

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

    const retrieveDetailEquipment = () =>
    {
        axios.get( `/manage/equipment/filter_by_ruangan/?ruangan_id=${ruangid}`,
            {
                headers:
                {
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {
                setDetailEquipment( res.data );
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


    const columns = useMemo(
        () => [
            {
                header: 'Nama Equipment',
                accessorKey: 'nama_equipment',
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
                },
            },
        ],
        [],
    );


    const table = useMantineReactTable( {
        columns,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        initialState: {
            density: 'xs',
            // sorting: [
            //     {
            //         id: 'username', //sort by age by default on page load
            //         asc: true,
            //     },
            // ],
        },
        data: detailEquipment,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        isMultiSortEvent: () => true,
        mantineTableProps: { striped: true, highlightOnHover: false },
    } );



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
                <div className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw' } }>
                    <Button variant='btn' id='actionButtonKembali' onClick={ buttonBack }>Kembali</Button>
                </div>
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw' } }>
                    <Row>
                        <Col xs={ 12 } md={ 6 } lg={ 6 } className='mb-3'>
                            <Card id='cardDetailRuangan'>
                                <Card.Body>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Detail Ruangan
                                    </p>
                                    <div>
                                        <Row>
                                            <Col xs={ 12 } md={ 6 } lg={ 6 } >
                                                <p className='label'>Nama Gedung:</p>
                                                <p className='content mb-3'>{ detailRuangan?.gedung }</p>
                                                <p className='label'>Nama Ruangan:</p>
                                                <p className='content mb-3'>{ detailRuangan?.nama_ruangan }</p>
                                                <p className='label'>Nomor Ruangan:</p>
                                                <p className='content mb-3'>{ detailRuangan?.no_ruangan }</p>
                                            </Col>
                                            <Col xs={ 12 } md={ 6 } lg={ 6 } >
                                                <p className='label'>Lantai:</p>
                                                <p className='content mb-3'>{ detailRuangan?.lantai }</p>
                                                <p className='label'>Kapasitas Ruangan:</p>
                                                <p className='content mb-3'>{ detailRuangan?.kapasitas }</p>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={ 12 } md={ 6 } lg={ 6 } className='mb-3'>
                            <Card id='cardDetailEquipment'>
                                <Card.Body>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Detail Perlengkapan
                                    </p>
                                    <div>
                                        <MantineReactTable
                                            table={ table }
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default RuanganDetail
