import React, { useContext, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { CiRead } from 'react-icons/ci';
import { AuthContext } from '../../../../auth';
import axios from '../../../../api/axios';


function TabsTodaysMeetingLight ()
{
    const { tokens } = useContext( AuthContext );
    const [ listMeeting, setListMeeting ] = useState( [] );
    const [ listUser, setListUser ] = useState( [] );
    const tokenUser = tokens?.token;
    const navigate = useNavigate();
    const detailMeeting = ( row ) =>
    {
        navigate( "/detail-meeting/" + row )
    }

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

                const filterData = res.data.filter( item => item.status === "approved" && item.finished === false );
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

    const columns = useMemo(
        () => [
            {
                header: 'Detail',
                accessorFn: row => (
                    <div >
                        <Button variant='btn' id='buttonDetailTableLight' onClick={ () => detailMeeting( row.id ) }>
                            &nbsp;<CiRead size={ 28 } />&nbsp;
                        </Button>
                    </div>
                ),
                size: 50,
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                header: 'Request by',
                accessorKey: 'user_name',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
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
                header: 'Tipe Meeting',
                accessorFn: row => (
                    <div style={ { marginBottom: '0px', marginTop: '0px' } }>
                        { ( () =>
                        {
                            switch ( row?.online ) {
                                case false:
                                    return <span >Offline</span>;
                                case true:
                                    return <span >Online</span>;
                                default:
                                    return null;
                            }
                        } )() }
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

    const tableTodayMeeting = useMantineReactTable( {
        columns,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        initialState: {
            density: 'xs',
            sorting: [
                {
                    id: 'tanggal',
                    desc: true,
                },
            ],
        },
        data: dataTable,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        isMultiSortEvent: () => true,
        mantineTableProps: { highlightOnHover: false },
    } );

    // console.log( dataTable )

    return (
        <>
            <MantineReactTable
                table={ tableTodayMeeting }
            />
        </>
    )
}

export default TabsTodaysMeetingLight