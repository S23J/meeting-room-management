import React, { useMemo, useState } from 'react'
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { CiEdit, CiRead, CiTrash } from 'react-icons/ci';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mantine/core';
import axios from '../../../../api/axios';
import { ModalAddRuangan, ModalEditRuangan } from '../../../Modal';


function TableRuanganLight ( { listRuangan, retrieveRuangan, tokenUser } )
{


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
                    onClick={ handleShowAddRuangan }
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

export default TableRuanganLight