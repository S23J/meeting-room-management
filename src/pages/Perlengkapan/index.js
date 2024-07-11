import React, { useContext, useEffect, useMemo, useState } from 'react'
import { HeaderMobile, HeaderWeb, ModalAddPerlengkapan, ModalEditPerlengkapan, SidebarComponent } from '../../components'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive';
import { AuthContext, ThemeContext } from '../../auth';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { CiEdit, CiTrash } from 'react-icons/ci';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Box } from '@mantine/core';

function Perlengkapan ()
{
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, userInfo, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const [ listAlat, setListAlat ] = useState( [] );
    const [ listRuangan, setListRuangan ] = useState( [] );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();
    const [ showAddAlat, setShowAddAlat ] = useState( false );
    const handleShowAddAlat = () =>
    {
        setShowAddAlat( true );
    };
    const [ rowSelected, setRowSelected ] = useState();
    const [ showEditAlat, setShowEditAlat ] = useState( false );
    const handleShowEditAlat = ( row ) =>
    {
        setShowEditAlat( true );
        setRowSelected( row )
    };

    const retrieveAlat = () =>
    {
        axios.get( `/manage/equipment/`,
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

                setListAlat( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {
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

                } else ( console.log( err ) )
            } )
    }

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) retrieveAlat()
    }, [ tokenUser ] );

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

                } else ( console.log( err ) )
            } )
    }

    useEffect( () =>
    {
        if ( tokenUser !== undefined ) retrieveRuangan()
    }, [ tokenUser ] );


    const [ dataTable, setDataTable ] = useState( [] );

    useEffect( () =>
    {
        const dataTableFilter = listAlat.map( ( { ...rest } ) => rest );
        setDataTable(
            dataTableFilter.map( ( data ) =>
            {
                const ruanganInfo = listRuangan.find( ( ruangan ) => ruangan.id === data.ruangan );
                const ruanganNama = ruanganInfo ? ruanganInfo.nama_ruangan : '';

                return {
                    ...data,
                    nama_ruangan: ruanganNama,
                };
            } )
        );
    }, [ listAlat, listRuangan ] );

    // console.log( dataTable )

    const handleDelete = async ( rowId ) =>
    {

        const result = await Swal.fire( {
            title: 'Apakah anda yakin ingin menghapus peralatan ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus peralatan ini!',
            cancelButtonText: 'Batalkan',
        } );

        if ( result.isConfirmed ) {
            try {

                const responseDelete = await axios.delete( `/manage/equipment/${rowId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                } );
                Swal.fire( 'Terhapus!', 'Peralatan berhasil dihapus', 'success' );
                retrieveAlat();
            } catch ( err ) {
                console.log( err );
                Swal.fire( 'Error', 'Terjadi kesalahan saat menghapus!', 'error' );

            }
        } else {

            Swal.fire( 'Dibatalkan', 'Data kamu tidak terhapus', 'info' );
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Nama Peralatan',
                accessorKey: 'nama_equipment',
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                header: 'Ruangan',
                accessorKey: 'nama_ruangan',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Ubah',
                accessorFn: row => (
                    <div >
                        <Button variant='btn' id='buttonEditTableLight' onClick={ () => handleShowEditAlat( row ) }>
                            &nbsp;<CiEdit size={ 28 } />&nbsp;
                        </Button>
                    </div>
                ),
                size: 50,
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Hapus',
                accessorFn: row => (
                    <div >
                        <Button variant='btn' id='buttonDeleteTableLight' onClick={ () => handleDelete( row.id ) }>
                            &nbsp;<CiTrash size={ 28 } />&nbsp;
                        </Button>
                    </div>
                ),
                size: 50,
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',

                },
            }

        ],
        [],
    );


    const table = useMantineReactTable( {
        columns,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        initialState: {
            density: 'xs',
            sorting: [
                {
                    id: 'nama_ruangan', //sort by age by default on page load
                    asc: true,
                },
            ],
        },
        data: dataTable,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        isMultiSortEvent: () => true,
        mantineTableProps: { striped: true, highlightOnHover: false },
        renderTopToolbarCustomActions: ( { table } ) => (
            <Box
                sx={ {
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                } }
            >
                <Button
                    id={ theme === 'light' ? 'tableButtonDark' : 'tableButtonLight' }
                    variant="btn"
                    onClick={ handleShowAddAlat }
                >
                    Tambah

                </Button>
            </Box>
        ),
    } );


    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerApp' : 'containerApp' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '94vw' : '84.5vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular' } }>
                                Daftar Perlengkapan
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
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91.5vw' : '81.7vw' } }>
                    <MantineReactTable
                        table={ table }
                    />
                </div>
            </Container>
            <br />
            <br />
            <ModalAddPerlengkapan
                showAddAlat={ showAddAlat }
                setShowAddAlat={ setShowAddAlat }
                listRuangan={ listRuangan }
                retrieveAlat={ retrieveAlat }
                retrieveRuangan={ retrieveRuangan }
                tokenUser={ tokenUser }
            />

            <ModalEditPerlengkapan
                showEditAlat={ showEditAlat }
                setShowEditAlat={ setShowEditAlat }
                rowSelected={ rowSelected }
                listRuangan={ listRuangan }
                retrieveAlat={ retrieveAlat }
                retrieveRuangan={ retrieveRuangan }
                tokenUser={ tokenUser }
            />
        </div>
    )
}

export default Perlengkapan
