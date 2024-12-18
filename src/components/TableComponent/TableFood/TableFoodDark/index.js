import React, { useMemo, useState } from 'react'
import axios from '../../../../api/axios';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { BsFillPencilFill } from 'react-icons/bs';
import { FaWindowClose } from 'react-icons/fa';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Box } from '@mantine/core';
import { ModalAddMakanan, ModalUbahMakanan } from '../../../Modal';

function TableFoodDark({ listFood, retrieveFood, tokenUser }) {

    const [showAddFood, setShowAddFood] = useState(false);
    const handleShowAddFood = () => {
        setShowAddFood(true);
    };
    const [rowSelected, setRowSelected] = useState();
    const [showEditFood, setShowEditFood] = useState(false);
    const handleShowEditFood = (row) => {
        setShowEditFood(true);
        setRowSelected(row)
    };

    const handleDelete = async (rowId) => {

        const result = await Swal.fire({
            title: 'Apakah anda yakin ingin menghapus paket ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus paket makanan ini!',
            cancelButtonText: 'Batalkan',
        });

        if (result.isConfirmed) {
            try {

                const responseDelete = await axios.delete(`/manage/food/${rowId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                });
                Swal.fire('Terhapus!', 'Paket berhasil dihapus', 'success');
                retrieveFood();
            } catch (err) {
                console.error(err)
                Swal.fire('Error', 'Terjadi kesalahan saat menghapus paket makanan!', 'error');
            }
        } else {
            Swal.fire('Dibatalkan', '', 'info');
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Nama Makanan',
                accessorKey: 'nama',
                mantineTableHeadCellProps: {
                    align: 'center',
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Tipe Makanan',
                accessorKey: 'food_type',
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
                        <Button variant='btn' onClick={() => handleShowEditFood(row)}>
                            &nbsp;<BsFillPencilFill size={20} color='#FFF471' />&nbsp;
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
                        <Button variant='btn' onClick={() => handleDelete(row.id)}>
                            &nbsp;<FaWindowClose size={20} color='#FF0060' />&nbsp;
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

    const table = useMantineReactTable({
        columns,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        initialState: {
            density: 'xs',
        },
        data: listFood,
        enableRowNumbers: true,
        rowNumberMode: 'static',
        isMultiSortEvent: () => true,
        mantineTableProps: { highlightOnHover: false },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    id='buttonTambahTableDark'
                    variant="btn"
                    onClick={handleShowAddFood}
                >
                    Tambah

                </Button>
            </Box>
        ),
    });

    return (
        <div>
            <MantineReactTable
                table={table}
            />
            <ModalAddMakanan
                showAddFood={showAddFood}
                setShowAddFood={setShowAddFood}
                retrieveFood={retrieveFood}
                tokenUser={tokenUser}
            />
            <ModalUbahMakanan
                showEditFood={showEditFood}
                setShowEditFood={setShowEditFood}
                rowSelected={rowSelected}
                retrieveFood={retrieveFood}
                tokenUser={tokenUser}
            />
        </div>
    )
}

export default TableFoodDark
