import React, { useMemo, useState } from 'react'
import Swal from 'sweetalert2';
import axios from '../../../../api/axios';
import { Button } from 'react-bootstrap';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Box } from '@mantine/core';
import { ModalAddUser, ModalEditUser } from '../../../Modal';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaWindowClose } from 'react-icons/fa';

function TableUserDark ( { tokenUser, listUser, retrieveUser } )
{

    const [ showAddUser, setShowAddUser ] = useState( false );
    const handleShowAddUser = () =>
    {
        setShowAddUser( true );
    };
    const [ rowSelected, setRowSelected ] = useState();
    const [ showEditUser, setShowEditUser ] = useState( false );
    const handleShowEditAlat = ( row ) =>
    {
        setShowEditUser( true );
        setRowSelected( row )
    };

    const handleDelete = async ( rowId ) =>
    {

        const result = await Swal.fire( {
            title: 'Apakah anda yakin ingin menghapus user ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus user ini!',
            cancelButtonText: 'Batalkan',
        } );

        if ( result.isConfirmed ) {
            try {

                const responseDelete = await axios.delete( `/auth/user-retrieve/${rowId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                } );
                Swal.fire( 'Terhapus!', 'User berhasil dihapus', 'success' );
                retrieveUser();
            } catch ( err ) {
                console.error( err )
                Swal.fire( 'Error', 'Terjadi kesalahan saat menghapus!', 'error' );

            }
        } else {

            Swal.fire( 'Dibatalkan', '', 'info' );
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Nama',
                id: 'nama_user',
                accessorFn: row => (
                    <>
                        { row.first_name } { row.last_name }
                    </>
                ),
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Username',
                accessorKey: 'username',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
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
                        <Button variant='btn' onClick={ () => handleShowEditAlat( row ) }>
                            &nbsp;<BsFillPencilFill size={ 20 } color='#FFF471' />&nbsp;
                        </Button>
                    </div>
                ),
                size: 50,
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',
                },
            },
            {
                header: 'Hapus',
                accessorFn: row => (
                    <div >
                        <Button variant='btn' onClick={ () => handleDelete( row.id ) }>
                            &nbsp;<FaWindowClose size={ 20 } color='#FF0060' />&nbsp;
                        </Button>
                    </div>
                ),
                size: 50,
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',

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
                    id: 'nama_user',
                    asc: true,
                },
            ],
        },
        data: listUser,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        isMultiSortEvent: () => true,
        mantineTableProps: { highlightOnHover: false },
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
                    id='buttonTambahTableDark'
                    variant="btn"
                    onClick={ handleShowAddUser }
                >
                    Tambah

                </Button>
            </Box>
        ),
    } );


    return (
        <div>
            <MantineReactTable
                table={ table }
            />
            <ModalAddUser
                showAddUser={ showAddUser }
                setShowAddUser={ setShowAddUser }
                retrieveUser={ retrieveUser }
                tokenUser={ tokenUser }
            />
            <ModalEditUser
                showEditUser={ showEditUser }
                setShowEditUser={ setShowEditUser }
                rowSelected={ rowSelected }
                retrieveUser={ retrieveUser }
                tokenUser={ tokenUser }
            />
        </div>
    )
}

export default TableUserDark
