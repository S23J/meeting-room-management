import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { HeaderWeb, HeaderMobile, ModalAddRuangan, ModalEditRuangan, SidebarComponent } from '../../components';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Box } from '@mantine/core';
import { CiEdit, CiRead, CiTrash } from 'react-icons/ci';

function Ruangan ()
{
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const [ listRuangan, setListRuangan ] = useState( [] );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();
    const [ showAddRuangan, setShowAddRuangan ] = useState( false );
    const handleShowAddRuangan = () =>
    {
        setShowAddRuangan( true );
    };
    const [ rowSelected, setRowSelected ] = useState();
    const [ showEditRuangan, setShowEditRuangan ] = useState( false );
    const handleShowEditRuangan = ( row ) =>
    {
        setShowEditRuangan( true );
        setRowSelected( row )
    };
    const detailRuangan = ( row ) =>
    {
        navigate( "/detail-ruangan/" + row )
    }

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


    const handleDelete = async ( rowId ) =>
    {

        const result = await Swal.fire( {
            title: 'Apakah anda yakin ingin menghapus ruangan ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus ruangan ini!',
            cancelButtonText: 'Batalkan',
        } );

        if ( result.isConfirmed ) {
            try {

                const responseDelete = await axios.delete( `/manage/ruangan/${rowId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                } );
                Swal.fire( 'Terhapus!', 'Ruangan berhasil dihapus', 'success' );
                retrieveRuangan();
            } catch ( err ) {
                console.log( err );
                Swal.fire( 'Error', 'Terjadi kesalahan saat menghapus!', 'error' );

            }
        } else {

            Swal.fire( 'Dibatalkan', '', 'info' );
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Detail',
                accessorFn: row => (
                    <div >
                        <Button variant='btn' id='buttonDetailTableLight' onClick={ () => detailRuangan( row.id ) }>
                            &nbsp;<CiRead size={ 28 } />&nbsp;
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
                header: 'Nama Gedung',
                accessorKey: 'gedung',
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                header: 'No. Ruangan',
                accessorKey: 'no_ruangan',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Nama Ruangan',
                accessorKey: 'nama_ruangan',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Kapasitas Ruangan',
                accessorKey: 'kapasitas',
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
                        <Button variant='btn' id='buttonEditTableLight' onClick={ () => handleShowEditRuangan( row ) }>
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
            // sorting: [
            //     {
            //         id: 'username', //sort by age by default on page load
            //         asc: true,
            //     },
            // ],
        },
        data: listRuangan,
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
                    onClick={ handleShowAddRuangan }
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
                                Daftar Ruangan
                            </h3>
                        </Col>
                        <Col xs={ 6 } lg={ 6 } className={ isMobile === false ? 'text-end my-auto' : 'my-auto' }>
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
                <br />
                <br />
                <br />
                <br />
                <br />
            </Container>
            <ModalAddRuangan
                showAddRuangan={ showAddRuangan }
                setShowAddRuangan={ setShowAddRuangan }
                retrieveRuangan={ retrieveRuangan }
                tokenUser={ tokenUser }
            />
            <ModalEditRuangan
                showEditRuangan={ showEditRuangan }
                setShowEditRuangan={ setShowEditRuangan }
                rowSelected={ rowSelected }
                retrieveRuangan={ retrieveRuangan }
                tokenUser={ tokenUser }
            />
        </div>
    )
}

export default Ruangan
