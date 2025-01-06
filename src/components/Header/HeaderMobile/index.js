import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, ThemeContext } from '../../../auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../../api/axios';
import { Badge, Button, Dropdown } from 'react-bootstrap';
import { CiLogout } from 'react-icons/ci';
import { BsGearFill } from 'react-icons/bs';
import { IoIosNotifications } from 'react-icons/io';

function HeaderMobile() {
    const { tokens, setTokens, setUserInfo } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const tokenUser = tokens?.token;
    const [meetingList, setMeetingList] = useState([]);
    const [previousFilteredData, setPreviousFilteredData] = useState([]);

    const navigate = useNavigate();

    const handleMeetingPage = (data) => {
        navigate("/detail-meeting/" + data)
    }

    const retrieveMeeting = () => {
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

                const filterData = res.data.filter(item => item.status === "processing");
                setMeetingList(filterData);

            }).catch(err => {
                console.error(err)
            });
    };


    useEffect(() => {
        const interval = setInterval(() => {
            if (tokenUser !== undefined) retrieveMeeting();
        }, 5000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (tokenUser !== undefined) retrieveMeeting()
    }, [tokenUser]);


    useEffect(() => {

        if (JSON.stringify(meetingList) !== JSON.stringify(previousFilteredData)) {

            Swal.fire({
                icon: 'info',
                title: 'Ada request masuk!',
                showConfirmButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    setPreviousFilteredData(meetingList.slice());
                }
            });
        }
    }, [meetingList, previousFilteredData]);

    // console.log( meetingList )

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };


    const LogoutSession = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Apakah anda yakin ingin keluar dari aplikasi?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Keluar',
            cancelButtonText: 'Batal',
        });

        if (!confirmDelete.isConfirmed) {

            return;
        }
        try {
            await axios.post(
                '/logout/',
                {},
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ${tokens.token}`,
                    },
                }
            );

            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('token');
            setTokens();
            setUserInfo();
            Swal.fire({
                icon: 'success',
                title: 'Proses keluar berhasil!',
                showConfirmButton: false,
                timer: 2000,
            });
            navigate('/');
        } catch (error) {
            console.error(error)
            Swal.fire({
                icon: 'error',
                title: 'Warning!',
                text: 'Proses keluar gagal!',
            });
        }
    };

    return (
        <>

            <span className="container-logout-web" style={{ fontFamily: 'Poppins-Regular' }}>
                <Dropdown drop='start' style={{ marginRight: '0px' }}>
                    <Dropdown.Toggle variant="btn" data-bs-theme={theme === 'light' ? 'dark' : ''} style={{ borderRight: theme === 'light' ? '1px solid #FFFFFF' : '1px solid #acacac', borderRadius: '0px', border: 'none', boxShadow: 'none' }}>
                        <IoIosNotifications size={22} color={theme === 'light' ? '#FFFFFF' : '#222222'} />
                        {
                            meetingList?.length === 0 ? (
                                <></>
                            ) : (
                                <div
                                    id='customBadge'
                                    style={{
                                        fontFamily: 'Poppins-Regular',
                                        backgroundColor: theme === 'light' ? '#F3C623' : '#2f4b7c',
                                        color: theme === 'light' ? '#121212' : '#FFFFFF',
                                    }}
                                >
                                    {meetingList?.length || 0}
                                </div>
                            )
                        }
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        id={theme === 'light' ? 'dropdownMenuDark' : 'dropdownMenuLight'}
                        style={{ overflowY: 'auto', maxHeight: '200px' }}
                    >
                        {
                            meetingList.map((data, index) => {

                                return (
                                    <Dropdown.Item
                                        id={theme === 'light' ? 'dropdownItem1Dark' : 'dropdownItem1Light'}
                                        className="d-flex align-items-center justify-content-center my-3"
                                        key={index}
                                        style={{ cursor: 'default' }}
                                    >
                                        <div
                                            style={{
                                                color: theme === 'light' ? '#FFFFFF' : '#707070',
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderBottom: theme === 'light' ? '2px dashed #FFFFFF' : '2px dashed #000A2E'
                                            }}
                                        >
                                            <p className="mb-3" style={{ margin: 0, marginRight: '10px' }}>
                                                {truncateText(data?.nama_meeting, 15)}
                                            </p>
                                            <Button
                                                id={theme === 'light' ? 'buttonTambahTableDark' : 'buttonTambahTableLight'}
                                                variant="btn"
                                                className="mb-3"
                                                onClick={() => handleMeetingPage(data.id)}
                                            >
                                                Proses
                                            </Button>
                                        </div>
                                    </Dropdown.Item>
                                )
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown drop='start' style={{ marginLeft: '0px' }}>
                    <Dropdown.Toggle variant="btn" data-bs-theme={theme === 'light' ? 'dark' : ''} style={{ borderRadius: '0px', border: 'none', boxShadow: 'none' }}>
                        <BsGearFill size={18} color={theme === 'light' ? '#FFFFFF' : '#222222'} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu id={theme === 'light' ? 'dropdownMenuDark' : 'dropdownMenuLight'}>
                        <Dropdown.Item
                            id={theme === 'light' ? 'dropdownItem1Dark' : 'dropdownItem1Light'}
                            className="d-flex align-items-center justify-content-center my-3"
                            onClick={LogoutSession}
                        >
                            <CiLogout size={25} className='me-2' color={theme === 'light' ? '#FFFFFF' : '#707070'} />
                            <span style={{ fontFamily: 'Poppins-Light', color: theme === 'light' ? '#FFFFFF' : '#707070' }}>Keluar</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </span>
            {/* <span className="container-logout-mobile" style={ { fontFamily: 'Poppins-Regular' } }>
                <Dropdown >
                    <Dropdown.Toggle variant="btn" data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                        <BsGearFill size={ 18 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
                    </Dropdown.Toggle>
                    <Dropdown.Menu id={ theme === 'light' ? 'dropdownMenuDark' : 'dropdownMenuLight' }>
                        <Dropdown.Item
                            id={ theme === 'light' ? 'dropdownItem1Dark' : 'dropdownItem1Light' }
                            className="d-flex align-items-center justify-content-center my-3"
                        >
                            <CiBellOn size={ 25 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } className='me-2' style={ { fontFamily: 'Poppins-Regular' } } />
                            <span style={ { fontFamily: 'Poppins-Light', color: theme === 'light' ? '#FFFFFF' : '#707070' } }>Notifikasi</span>
                            {
                                meetingList?.length === 0 ? (
                                    <></>
                                ) : (
                                        <Badge style={ { fontFamily: 'Poppins-Regular', position: 'absolute', right: '98px', top: '10px' } }>{ meetingList?.length }</Badge>
                                )
                            }
                        </Dropdown.Item>
                        <Dropdown.Item
                            id={ theme === 'light' ? 'dropdownItem1Dark' : 'dropdownItem1Light' }
                            className="d-flex align-items-center justify-content-center my-3"
                            onClick={ LogoutSession }
                        >
                            <CiLogout size={ 25 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } className='me-2' />
                            <span style={ { fontFamily: 'Poppins-Light', color: theme === 'light' ? '#FFFFFF' : '#707070' } }>Keluar</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </span> */}
        </>
    )
}

export default HeaderMobile
