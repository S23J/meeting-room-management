import React, { useMemo, useState } from 'react'
import Swal from 'sweetalert2';
import axios from '../../../../api/axios';
import { Button } from 'react-bootstrap';
import { CiEdit, CiTrash } from 'react-icons/ci';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Box } from '@mantine/core';
import { ModalAddPerlengkapan, ModalEditPerlengkapan } from '../../../Modal';

function TableEquipmentDark ( { dataTable, retrieveAlat, tokenUser, listRuangan, retrieveRuangan } )
{

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
                        <Button variant='btn' id='buttonEditTableDark' onClick={ () => handleShowEditAlat( row ) }>
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
                        <Button variant='btn' id='buttonDeleteTableDark' onClick={ () => handleDelete( row.id ) }>
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
                    onClick={ handleShowAddAlat }
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
            <ModalAddPerlengkapan
                showAddAlat={ showAddAlat }
                setShowAddAlat={ setShowAddAlat }
                listRuangan={ listRuangan }
                retrieveAlat={ retrieveAlat }
                retrieveRuangan={ listRuangan }
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

export default TableEquipmentDark
