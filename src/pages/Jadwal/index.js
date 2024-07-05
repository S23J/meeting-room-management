import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { HeaderMobile, HeaderWeb, SidebarComponent } from '../../components';
import { Col, Container, Row } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';

function Jadwal ()
{
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const [ listMeeting, setListMeeting ] = useState( [] );
    const [ listUser, setListUser ] = useState( [] );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();

    const retrieveMeeting = () =>
    {
        axios.get( `/manage/requests/`,
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

                const filterData = res.data.filter( item => item.status === "processing" );
                setListMeeting( filterData );
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

    const retrieveUser = () =>
    {
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

                // const filterData = res.data.filter( item => item.status === "processing" );
                setListUser( res.data );
                // console.log( res.data );
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
        if ( tokenUser !== undefined ) retrieveMeeting()
        if ( tokenUser !== undefined ) retrieveUser()
    }, [ tokenUser ] );

    const [ dataTable, setDataTable ] = useState( [] );

    useEffect( () =>
    {
        const dataTableFilter = listMeeting.map( ( { ...rest } ) => rest );

        setDataTable(
            dataTableFilter.map( ( data ) =>
            {
                const user = listUser.find( ( user ) => user.id === data.user );
                const userName = user ? user.first_name + ' ' + user.last_name : '';

                return {
                    ...data,
                    user_name: userName,
                };
            } )
        );
    }, [ listMeeting, listUser ] );

    // console.log( dataTable );

    const columns = useMemo(
        () => [
            {
                header: 'Request by',
                accessorKey: 'user_name',
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                header: 'Nama Meeting',
                accessorKey: 'nama_meeting',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Tanggal',
                accessorFn: ( row ) => new Date( row.waktu_mulai ),
                id: 'tanggal',
                filterVariant: 'date-range',
                Cell: ( { cell } ) =>
                {
                    const date = cell.getValue();
                    const day = String( date.getDate() ).padStart( 2, '0' );
                    const month = String( date.getMonth() + 1 ).padStart( 2, '0' );
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                },
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Waktu Mulai',
                accessorFn: row => (
                    <div style={ { marginBottom: '0px', marginTop: '0px' } }>
                        { row.waktu_mulai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }
                    </div>
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Waktu Selesai',
                accessorFn: row => (
                    <div style={ { marginBottom: '0px', marginTop: '0px' } }>
                        { row.waktu_selesai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }
                    </div>
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
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
        data: dataTable,
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
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw' } }>
                    <MantineReactTable
                        table={ table }
                    />
                </div>
            </Container>
        </div>
    )
}

export default Jadwal
