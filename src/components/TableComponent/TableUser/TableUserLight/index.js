import React, { useMemo, useState } from 'react'
import Swal from 'sweetalert2';
import axios from '../../../../api/axios';
import { Button } from 'react-bootstrap';
import { CiEdit, CiTrash } from 'react-icons/ci';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Box } from '@mantine/core';
import { ModalAddUser, ModalEditUser } from '../../../Modal';

function TableUserLight ( { tokenUser, listUser, retrieveUser } )
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

            Swal.fire( 'Dibatalkan', 'Data kamu tidak terhapus', 'info' );
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Nama User',
                id: 'nama_user',
                accessorFn: row => (
                    <>
                        { row.first_name } { row.last_name }
                    </>
                ),
                mantineTableHeadCellProps: {
                    align: 'left',
                },
                mantineTableBodyCellProps: {
                    align: 'left',
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
                            &nbsp;<CiTrash size={ 28 } color='red' />&nbsp;
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
                    id: 'nama_user', //sort by age by default on page load
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
                    id='buttonTambahTableLight'
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

export default TableUserLight
