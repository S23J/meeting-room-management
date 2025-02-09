import React, { useContext, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../../../auth';
import axios from '../../../../api/axios';
import { FaInfoCircle } from 'react-icons/fa';


function TabsTodaysMeetingDark() {
    const { tokens } = useContext(AuthContext);
    const [listMeeting, setListMeeting] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const tokenUser = tokens?.token;
    const navigate = useNavigate();
    const detailMeeting = (row) => {
        navigate("/detail-meeting/" + row)
    }

    const retrieveMeeting = () => {
        setLoading(true);
        axios.get(`/manage/requests/`,
            {
                headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            })
            .then(res => {

                const filterData = res.data.filter(item => item.status === "approved" && item.finished === false);
                setListMeeting(filterData);
                setLoading(false);

            }).catch(err => {
                setLoading(false);
                if (err.response?.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Sesi Anda telah berakhir. Silahkan Login kembali.',
                        confirmButtonText: 'Login',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/');
                        }
                    });

                } else (console.error(err))
            })
    }

    const retrieveUser = () => {
        setLoading(true);
        axios.get(`/users/`,
            {
                headers:
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            })
            .then(res => {

                setListUser(res.data);
                setLoading(false);

            }).catch(err => {
                setLoading(false);
                if (err.response?.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Sesi Anda telah berakhir. Silahkan Login kembali.',
                        confirmButtonText: 'Login',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/');
                        }
                    });

                } else (console.error(err))
            })
    }


    useEffect(() => {
        if (tokenUser !== undefined) retrieveMeeting()
        if (tokenUser !== undefined) retrieveUser()
    }, [tokenUser]);

    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        const dataTableFilter = listMeeting.map(({ ...rest }) => rest);

        setDataTable(
            dataTableFilter.map((data) => {
                const user = listUser.find((user) => user.id === data.user);
                const userName = user ? user.first_name + ' ' + user.last_name : '';

                return {
                    ...data,
                    user_name: userName,
                    meetingTypeRaw: data.online === true ? 'Online' : 'Offline',
                };
            })
        );
    }, [listMeeting, listUser]);

    const columns = useMemo(
        () => [
            {
                header: 'Info',
                accessorFn: row => (
                    <div >
                        <Button variant='btn' onClick={() => detailMeeting(row.id)}>
                            &nbsp;<FaInfoCircle size={20} color='#FFF471' />&nbsp;
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
                header: 'Permintaan dari',
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
                accessorFn: (row) => new Date(row.waktu_mulai),
                id: 'tanggal',
                filterVariant: 'date-range',
                Cell: ({ cell }) => {
                    const date = cell.getValue();
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                    const year = date.getUTCFullYear();
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
                    <div style={{ marginBottom: '0px', marginTop: '0px' }}>
                        {row.waktu_mulai.split('T')[1].split('Z')[0].slice(0, 5)}
                    </div>
                ),
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',
                },
            },
            {
                header: 'Waktu Selesai',
                accessorFn: row => (
                    <div style={{ marginBottom: '0px', marginTop: '0px' }}>
                        {row.waktu_selesai.split('T')[1].split('Z')[0].slice(0, 5)}
                    </div>
                ),
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',
                },
            },
        ],
        [],
    );

    const tableTodayMeeting = useMantineReactTable({
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
    });

    return (
        <>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                    <Spinner animation='border' style={{ color: '#FFF471' }} />
                </div>
            ) : (
                <MantineReactTable
                    table={tableTodayMeeting}
                />
            )}
        </>
    )
}

export default TabsTodaysMeetingDark
