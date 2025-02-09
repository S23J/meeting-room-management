import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext, ThemeContext } from '../../auth';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { SidebarComponent } from '../../components';
import { Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { FaWindowClose } from 'react-icons/fa';
import Select from 'react-select';

function MeetingDetail() {
    const { meetingid } = useParams();
    const { tokens, showSidebar } = useContext(AuthContext);
    const isMobile = useMediaQuery({ maxWidth: 1024 });
    const { theme } = useContext(ThemeContext);
    const tokenUser = tokens?.token;
    const [meeting, setMeeting] = useState({});
    const [listUser, setListUser] = useState([]);
    const [detailPeserta, setDetailPeserta] = useState([]);
    const [detailRuangan, setDetailRuangan] = useState();
    const [detailEquipment, setDetailEquipment] = useState([]);
    const [date, setDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [filteredUserObject, setFilteredUserObject] = useState({});
    const navigate = useNavigate();
    const [listAkun, setListAkun] = useState([]);
    const [listFood, setListFood] = useState([]);
    const [listFoodDetail, setListFoodDetail] = useState([]);
    const [snackChecked, setSnackChecked] = useState(false);
    const [fullMealChecked, setFullMealChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(true);

    const [meetingTopic, setMeetingTopic] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const buttonBack = () => {
        navigate(-1)
    }

    const retrieveDetailMeeting = () => {
        setLoading(true);
        axios.get(`/manage/requests/${meetingid}/`,
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

                setMeeting(res.data);
                setMeetingTopic(res.data.nama_meeting);
                setSnackChecked(res.data.snack);  // Set the checkbox based on meeting data
                setFullMealChecked(res.data.full_meal);  // Set the checkbox based on meeting data
                setDate(res?.data.waktu_mulai.split('T')[0])
                setStartTime(res?.data.waktu_mulai.split('T')[1].split('Z')[0].slice(0, 5));
                setEndTime(res?.data.waktu_selesai.split('T')[1].split('Z')[0].slice(0, 5));


                const formattedWaktuMulai = res.data.waktu_mulai.slice(0, -1);
                setMeetingStartTime(formattedWaktuMulai);

                const waktuMulai = new Date(res.data.waktu_mulai);
                const waktuSelesai = new Date(res.data.waktu_selesai);
                const durationInMinutes = (waktuSelesai - waktuMulai) / (1000 * 60);
                setMeetingDuration(durationInMinutes);

                setLoading(false);

                // console.log(res.data)

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
    };

    useEffect(() => {
        if (tokenUser !== undefined) {
            retrieveDetailMeeting();
        }
    }, [tokenUser]);

    const handleSnackChange = () => {
        setSnackChecked(prevState => !prevState);
    };

    const handleFullMealChange = () => {
        setFullMealChecked(prevState => !prevState);
    };

    const retrieveAkun = () => {
        setLoading(true);
        axios.get(`/manage/omplatform/filter_by_ruangan/?ruangan_id=${detailRuangan?.id}`,
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
                setListAkun(res.data);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.error(err);
            })
    };


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
                console.error(err);
            })
    };

    const retrieveFood = () => {
        setLoading(true);
        axios.get(`/manage/food/`,
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
                if (meeting.snack == true && meeting.full_meal == true) {
                    const validData = res.data.filter(item => item.food_type === "fullset");
                    setListFood(validData);
                } else if (meeting.snack == true) {
                    const validData = res.data.filter(item => item.food_type === "snack");
                    setListFood(validData);
                } else if (meeting.full_meal == true) {
                    const validData = res.data.filter(item => item.food_type === "meal");
                    setListFood(validData);
                }

                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.error(err);
            })
    };

    const retrieveFoodDetail = () => {
        if (!selectedFood?.value) return; // Exit if selectedFood is undefined/null
        setLoading(true);
        axios.get(`/manage/food-detail/?food_id=${selectedFood.value}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ` + tokenUser,
            },
        })
            .then(res => {
                setListFoodDetail(res.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
            });
    };


    const retrievePeserta = () => {
        setLoading(true);
        axios.get(`/manage/peserta/filter_by_request/?request_id=${meeting?.id}`,
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

                // console.log(res.data)
                setDetailPeserta(res.data);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.error(err);
            })
    };


    const retrieveRuangan = () => {
        setLoading(true);
        axios.get(`/manage/ruangan/${meeting?.ruangan}/`,
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

                setDetailRuangan(res.data);
                setLoading(false);

            }).catch(err => {
                setLoading(false);
                console.error(err);
            })
    };

    const retrieveDetailEquipment = () => {
        setLoading(true);
        axios.get(`/manage/equipment/filter_by_ruangan/?ruangan_id=${detailRuangan?.id}`,
            {
                headers:
                {
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            })
            .then(res => {
                setDetailEquipment(res.data);
                setLoading(false);

            }).catch(err => {
                setLoading(false);
                console.error(err);
            })
    };

    const [selectedFood, setSelectedFood] = useState(null);

    const foodOptions = listFood.map(food => ({
        value: food.id,
        label: food.nama,
        price: food.price
    }));

    const handleSelectFood = selectedOption => {
        setSelectedFood(selectedOption);
    };

    const formStyles = {
        label: {
            fontFamily: 'Poppins-Medium',
        },
        input: {

            fontFamily: 'Poppins-Regular',
            minHeight: '50px',
            borderColor: '#ced4da',
            backgroundColor: theme === 'light' ? '#222' : '#FFFFFF',
            color: theme === 'light' ? '#FFFFFF' : '#222'
        },
        inputTipeMeeting: {

            fontFamily: 'Poppins-Regular',
            minHeight: '50px',
            borderColor: '#ced4da',
            backgroundColor: theme === 'light' ? '#222' : '#FFFFFF',
            color: theme === 'light' ? '#FFFFFF' : '#222',
            textAlign: isMobile ? 'left' : 'center'
        },
        button: {
            height: '50px',
        },
    };

    const selectStyles = {
        control: (cityided, state) => ({
            ...cityided,
            minHeight: '50px',
            border: state.isFocused ? '1px solid #80bdff' : '1px solid #ced4da',
            boxShadow: state.isFocused ? '0 0 0 0.3rem rgba(0, 123, 255, 0.25)' : null,
            '&:hover': {
                borderColor: '#80bdff',
            },
            textAlign: 'left',
            fontFamily: 'Poppins-Regular',
            background: theme === 'light' ? '#212529' : '#FFFFFF',
        }),
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? '#fff' : '#333',
            background: state.isSelected ? '#007bff' : state.isFocused ? '#f5f5f5' : '#fff',
            fontFamily: 'Poppins-Regular',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: theme === 'light' ? '#FFFFFF' : '#222',
            fontFamily: 'Poppins-Regular',
        }),
        input: (provided) => ({
            ...provided,
            color: theme === 'light' ? '#FFFFFF' : '#222',
            fontFamily: 'Poppins-Regular',
        }),
    };

    useEffect(() => {
        const fetchData = async () => {
            if (tokenUser !== undefined) {

                await retrieveDetailMeeting();
                await retrieveUser();
                await retrieveFood();
                await retrieveFoodDetail();

                if (meeting?.ruangan !== undefined) {
                    await retrieveRuangan();
                }

                if (meeting?.id !== undefined) {
                    await retrievePeserta();
                }

                if (detailRuangan?.id !== undefined) {
                    await retrieveDetailEquipment();
                    await retrieveAkun();
                }

            }
        };

        fetchData();
    }, [tokenUser, meeting?.ruangan, detailRuangan?.id]);

    useEffect(() => {
        if (selectedFood?.value !== undefined) {
            retrieveFoodDetail();
        }
    }, [selectedFood?.value]);

    useEffect(() => {
        if (meeting && listUser.length > 0) {
            const filteredUsers = listUser.filter(user => user?.id === meeting?.user);
            const userObject = filteredUsers.reduce((obj, user) => {
                const userName = filteredUsers ? user.first_name + ' ' + user.last_name : '';
                return userName;
            }, {});
            setFilteredUserObject(userObject);
        }
    }, [meeting, listUser]);

    const [dataPeserta, setDataPeserta] = useState([]);

    useEffect(() => {
        const dataPesertaFilter = detailPeserta.map(({ ...rest }) => rest);

        setDataPeserta(
            dataPesertaFilter.map((data) => {
                const userInfo = listUser.find((sales) => sales.id === data.user);
                const userName = userInfo ? userInfo.first_name + ' ' + userInfo.last_name : '';

                return {
                    ...data,
                    user_name: userName,
                };
            })
        );
    }, [detailPeserta, listUser]);

    const handleApprove = async (event) => {

        const confirmApprove = await Swal.fire({
            title: 'Apakah anda yakin ingin menyetujui meeting?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Setuju',
            cancelButtonText: 'Batal',
        });

        event.preventDefault();
        const data = {
            status: "approved",
            food: selectedFood?.value,
            cost: totalCost
        };
        setIsSubmitting(true);
        if (!confirmApprove.isConfirmed) {

            return (
                setIsSubmitting(false)
            );
        }

        try {
            const response = await axios.patch(`/manage/requests/${meetingid}/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ${tokens.token}`,
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Berhasil menyetujui meeting',
                showConfirmButton: false,
                timer: 3000,
            });

            detailPeserta.forEach((peserta) => {
                try {
                    const dataNotification = {
                        "user_id": peserta.user,
                        "title": 'Pemberitahuan Meeting',
                        "body": `${peserta.nama_meeting} \nTanggal: ${peserta.waktu_mulai.split('T')[0]} \nWaktu: ${peserta.waktu_mulai.split('T')[1].split(':').slice(0, 2).join(':')}`,
                        "sound": "default",
                        "data": {
                            "type": "reminder"
                        }
                    }

                    const responseNotif = axios.post(`/send-notification/`, dataNotification,
                        {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                withCredentials: true,
                                Authorization: `Token ${tokens.token}`,
                            },
                        }
                    );
                    // console.log(responseNotif)
                } catch (error) {
                    console.error(error);
                }

            })

            navigate('/meeting/');
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Warning!',
                text: 'Gagal menyetujui meeting',
            });
            setIsSubmitting(false);
        }
    };

    const handleDenied = async (event) => {

        const confirmDenied = await Swal.fire({
            title: 'Apakah anda yakin ingin menolak meeting?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal',
        });

        event.preventDefault();
        const data = {
            status: "denied",
            finished: true,
        };

        setIsSubmitting(true);

        if (!confirmDenied.isConfirmed) {

            return;
        }
        try {
            const response = await axios.patch(`/manage/requests/${meetingid}/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ${tokens.token}`,
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Berhasil menolak meeting',
                showConfirmButton: false,
                timer: 3000,
            });
            navigate('/meeting/');
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Warning!',
                text: 'Gagal menolak meeting',
            });
            setIsSubmitting(false);
        }
    };

    const [selectedAccount, setSelectedAccount] = useState('');
    const [detailAkun, setDetailAkun] = useState({});
    const [fetching, setFetching] = useState(false);
    const [meetingStartTime, setMeetingStartTime] = useState('');
    const [meetingDuration, setMeetingDuration] = useState('');
    const [meetingAgenda, setMeetingAgenda] = useState('');

    const retrieveDetailAkun = async () => {
        try {
            setFetching(true);

            const res = await axios.get(`/manage/omplatform/${selectedAccount}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ${tokenUser}`,
                },
            });
            setDetailAkun(res.data);

        } catch (err) {

            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        if (tokenUser && selectedAccount) {
            retrieveDetailAkun();
        }
    }, [tokenUser, selectedAccount]);

    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (selectedAccount === value) {
            setSelectedAccount('');
        } else {
            setSelectedAccount(value);
        }
    };

    const dataSelectedAccount = listAkun.map((data, index) => {
        const isChecked = selectedAccount === String(data.id);
        const isDisabled = selectedAccount && selectedAccount !== String(data.id);

        return (
            <div className='mb-3' key={index} style={{ fontFamily: 'Poppins-Regular' }}>
                <Form.Check
                    type="checkbox"
                    id={`checkboxAccount-${data.id}`}
                    label={`${data.account} || ${data.platform}`}
                    onChange={handleCheckboxChange}
                    value={data.id}
                    checked={isChecked}
                    disabled={isDisabled}
                />
            </div>
        );
    });

    const redirectAuth = () => {

        if (detailAkun?.platform === "Google Meet") {

            const handleMessage = async (event) => {
                if (event.origin !== window.location.origin) return;

                const { refreshToken } = event.data;
                window.sessionStorage.setItem("new_refresh_token", JSON.stringify(refreshToken));

                const result = await Swal.fire({
                    title: 'Proses Otorisasi Berhasil!',
                    text: 'Harap mengupdate Otorisasi akun anda kembali dengan menekan tombol OK!',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'OK!',
                    cancelButtonText: 'Batalkan',
                });

                if (result.isConfirmed) {

                    const getDataNewRefreshToken = window.sessionStorage.getItem("new_refresh_token");
                    const getDataNewRefreshTokenParse = JSON.parse(getDataNewRefreshToken);

                    const updateData = {
                        auth_code: getDataNewRefreshTokenParse,
                    }

                    try {
                        const responseUpdate = await axios.patch(`/manage/omplatform/${detailAkun?.id}/`, updateData, {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                                withCredentials: true,
                                Authorization: `Token ` + tokenUser,
                            },
                        }
                        );

                        window.sessionStorage.removeItem('data-akun-meeting');
                        window.sessionStorage.removeItem('new_refresh_token');

                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil mengupdate Otorisasi Akun!',
                            text: 'Anda bisa membuat meeting kembali',
                            showConfirmButton: true,
                        });

                        retrieveAkun();
                        retrieveDetailAkun();

                        setDisabled(false);
                    } catch (err) {
                        console.error(err)
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Terjadi kesalahan saat mengupdate Otorisasi Akun!',
                        });
                        setDisabled(false);
                    }
                } else {
                    Swal.fire('Dibatalkan', 'Update Authentikasi dibatalkan', 'info');
                };

                window.removeEventListener("message", handleMessage);

            };

            const clientId = detailAkun?.client_id;
            const redirectUri = `http://localhost:3000/callback`;
            const scope = 'https://www.googleapis.com/auth/calendar';

            const GMeetAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

            window.open(GMeetAuthUrl, "_blank", "width=500,height=600");

            window.addEventListener("message", handleMessage);


        } else if (detailAkun?.platform === "Zoom") {

            const handleMessage = async (event) => {
                if (event.origin !== window.location.origin) return;

                const { refreshToken } = event.data;
                window.sessionStorage.setItem("new_refresh_token", JSON.stringify(refreshToken));

                const result = await Swal.fire({
                    title: 'Proses Otorisasi Berhasil!',
                    text: 'Harap mengupdate Otorisasi akun anda kembali dengan menekan tombol OK!',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'OK!',
                    cancelButtonText: 'Batalkan',
                });

                if (result.isConfirmed) {

                    const getDataNewRefreshToken = window.sessionStorage.getItem("new_refresh_token");
                    const getDataNewRefreshTokenParse = JSON.parse(getDataNewRefreshToken);

                    const updateData = {
                        auth_code: getDataNewRefreshTokenParse,
                    }

                    try {
                        const responseUpdate = await axios.patch(`/manage/omplatform/${detailAkun?.id}/`, updateData, {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                                withCredentials: true,
                                Authorization: `Token ` + tokenUser,
                            },
                        }
                        );

                        window.sessionStorage.removeItem('data-akun-meeting');
                        window.sessionStorage.removeItem('new_refresh_token');

                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil mengupdate Otorisasi Akun!',
                            text: 'Anda bisa membuat meeting kembali',
                            showConfirmButton: true,
                        });

                        retrieveAkun();
                        retrieveDetailAkun();

                        setDisabled(false);
                    } catch (err) {
                        console.error(err)
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Terjadi kesalahan saat mengupdate Otorisasi Akun!',
                        });
                        setDisabled(false);
                    }
                } else {
                    Swal.fire('Dibatalkan', 'Update Authentikasi dibatalkan', 'info');
                };

                window.removeEventListener("message", handleMessage);
            };

            const clientId = detailAkun?.client_id;
            const redirectUri = `http://localhost:3000/callback`;
            const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

            window.open(zoomAuthUrl, "_blank", "width=500,height=600");

            window.addEventListener("message", handleMessage);

        }

    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmitMeeting = async () => {

        setDisabled(true);
        setIsSubmitting(true);
        const calculateEndTime = (startTime, duration) => {
            const startDate = new Date(startTime);
            const durationMinutes = parseInt(duration, 10);
            const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
            return endDate;
        };

        try {
            if (detailAkun?.platform === "Google Meet") {

                const localStartDate = new Date(meetingStartTime);
                const endDate = calculateEndTime(localStartDate, meetingDuration);
                const utcStartDateString = localStartDate.toISOString();
                const utcEndDateString = endDate.toISOString();

                const formData = {
                    summary: meetingTopic,
                    description: meetingAgenda,
                    start: {
                        dateTime: utcStartDateString,
                        timeZone: "Asia/Jakarta"
                    },
                    end: {
                        dateTime: utcEndDateString,
                        timeZone: "Asia/Jakarta"
                    },
                    conferenceData: {
                        createRequest: {
                            requestId: "sample123",
                            conferenceSolutionKey: {
                                type: "hangoutsMeet"
                            }
                        }
                    }
                };

                const getAccessToken = window.sessionStorage.getItem("gmeet_new_access_token");
                const accessToken = JSON.parse(getAccessToken);

                try {

                    const response = await axios.post(`https://www.googleapis.com/calendar/v3/calendars/${detailAkun?.calendar_id}/events?conferenceDataVersion=1`, formData, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    window.sessionStorage.removeItem("gmeet_new_access_token");

                    const dataLink = {
                        link_meeting: response?.data.hangoutLink,
                    };

                    try {
                        await axios.patch(`/manage/requests/${meetingid}/`, dataLink, {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                                withCredentials: true,
                                Authorization: `Token ` + tokenUser,
                            },
                        });

                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil membuat Meeting',
                            showConfirmButton: true
                        });
                        setIsSubmitting(false);
                        setDisabled(false);
                        retrieveDetailMeeting();
                    } catch (err) {
                        console.error(err.response);
                        setIsSubmitting(false);
                        setDisabled(false);
                    }
                } catch (err) {
                    console.error(err.response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Warning',
                        text: 'Terjadi kesalahan saat membuat Meeting',
                        showConfirmButton: true
                    });
                    setIsSubmitting(false);
                    setDisabled(false);
                }

            } else if (detailAkun?.platform === "Zoom") {

                const localDate = new Date(meetingStartTime);
                const offsetInMinutes = localDate.getTimezoneOffset();
                const offsetInMilliseconds = offsetInMinutes * 60 * 1000;
                const utcDate = new Date(localDate.getTime() - offsetInMilliseconds);
                const utcDateString = utcDate.toISOString();

                const data = {
                    topic: meetingTopic,
                    type: 2,
                    start_time: utcDateString,
                    duration: meetingDuration,
                    timezone: 'Asia/Jakarta',
                    agenda: meetingAgenda
                };

                setIsSubmitting(true);

                try {
                    const getAccessToken = window.sessionStorage.getItem("zoom_new_access_token");
                    const accessToken = JSON.parse(getAccessToken);

                    const responseNewMeeting = await axios.post(`https://api.zoom.us/v2/users/me/meetings`, data, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    window.sessionStorage.removeItem("zoom_new_access_token");

                    const dataLink = {
                        link_meeting: responseNewMeeting?.data.join_url,
                    };

                    try {
                        await axios.patch(`/manage/requests/${meetingid}/`, dataLink, {
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json',
                                withCredentials: true,
                                Authorization: `Token ` + tokenUser,
                            },
                        });

                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil membuat Meeting',
                            showConfirmButton: true
                        });
                        setIsSubmitting(false);
                        setDisabled(false);
                        retrieveDetailMeeting();

                    } catch (err) {
                        console.error(err.response);
                        setIsSubmitting(false);
                        setDisabled(false);
                    }
                } catch (err) {
                    console.error(err.response);
                    Swal.fire({
                        icon: 'error',
                        title: 'Warning',
                        text: 'Terjadi kesalahan saat membuat Meeting',
                        showConfirmButton: true
                    });
                    setIsSubmitting(false);
                    setDisabled(false);
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
            setIsSubmitting(false);
            setDisabled(false);
        }
    };


    const handleSubmiNewToken = async () => {

        if (detailAkun?.platform === "Google Meet") {

            const dataBody = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: detailAkun?.auth_code,
            });

            let response;

            try {
                response = await axios.post('https://oauth2.googleapis.com/token', dataBody.toString(), {
                    headers: {
                        Authorization: `Basic ${btoa(`${detailAkun?.client_id}:${detailAkun?.client_secret}`)}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const winLocal = window.sessionStorage;
                winLocal.setItem("gmeet_new_access_token", JSON.stringify(response.data.access_token));

                handleSubmitMeeting();

            } catch (error) {

                if (error.response?.data?.error === "invalid_grant") {
                    const result = await Swal.fire({
                        title: 'Otorisasi akun yang anda pilih telah habis!',
                        text: 'Harap melakukan proses otorisasi kembali dengan menekan tombol OK!',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'OK!',
                        cancelButtonText: 'Batalkan',
                    });

                    if (result.isConfirmed) {
                        window.sessionStorage.setItem("data-akun-meeting", JSON.stringify(detailAkun));
                        redirectAuth();
                    } else {
                        Swal.fire('Dibatalkan', 'Proses Otorisasi dibatalkan', 'info');
                    };

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Terjadi kesalahan saat proses Otorisasi',
                    });
                };
            }

        } else if (detailAkun?.platform === "Zoom") {

            const dataBody = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: detailAkun?.auth_code,
            });

            try {
                const response = await axios.post('https://zoom.us/oauth/token', dataBody.toString(), {
                    headers: {
                        Authorization: `Basic ${btoa(`${detailAkun?.client_id}:${detailAkun?.client_secret}`)}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                const winLocal = window.sessionStorage
                winLocal.setItem("zoom_new_access_token", JSON.stringify(response.data.access_token));

                handleSubmitMeeting();

            } catch (error) {

                console.error(error.response);

                if (error.response?.data?.error === "invalid_grant") {
                    const result = await Swal.fire({
                        title: 'Otorisasi akun yang anda pilih telah habis!',
                        text: 'Harap melakukan proses otorisasi kembali dengan menekan tombol OK!',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'OK!',
                        cancelButtonText: 'Batalkan',
                    });
                    if (result.isConfirmed) {
                        window.sessionStorage.setItem("data-akun-meeting", JSON.stringify(detailAkun));
                        redirectAuth();
                    } else {
                        Swal.fire('Dibatalkan', 'Proses Otorisasi dibatalkan', 'info');
                    };
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Terjadi kesalahan saat proses Otorisasi',
                    });
                };

            };

        }

    };

    useEffect(() => {
        const handleToken = (event) => {
            if (event.data && event.data.accessToken) {
                const accessToken = event.data.accessToken;
                window.sessionStorage.setItem("new_refresh_token", JSON.stringify(accessToken));
            }
        };

        window.addEventListener('message', handleToken);

        return () => {
            window.removeEventListener('message', handleToken);
        };
    }, []);

    const handleDelete = async (dataId) => {

        const result = await Swal.fire({
            title: 'Hapus peserta meeting?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus peserta!',
            cancelButtonText: 'Batalkan',
        });

        if (result.isConfirmed) {
            try {

                const responseDelete = await axios.delete(`/manage/peserta/${dataId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                });
                Swal.fire('Terhapus!', 'Peserta berhasil dihapus', 'success');
                retrievePeserta();
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Terjadi kesalahan saat menghapus peserta!', 'error');

            }
        } else {

            Swal.fire('Dibatalkan', 'Data kamu tidak terhapus', 'info');
        }
    };

    const numberFormat = (value) =>
        new Intl.NumberFormat('IN-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(value);

    const totalCost = selectedFood?.price ? selectedFood.price * meeting.attendaces : '';

    // console.log(selectedFood)

    const [foodDetailRetrieve, setFoodDetailRetrieve] = useState({});
    const [foodItemRetrieve, ssetFoodDetailRetrieve] = useState([]);

    const retrieveFoodDetail2 = () => {
        if (meeting?.food === null || meeting?.food === undefined) {
            console.warn("meeting.food is null or undefined, skipping fetch");
            return;
        }

        axios.get(`/manage/food/${meeting.food}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ` + tokenUser,
            },
        })
            .then(res => {
                setFoodDetailRetrieve(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const retrieveFoodDetail3 = () => {
        if (foodDetailRetrieve?.id === null || foodDetailRetrieve?.id === undefined) {
            console.warn("foodDetailRetrieve.id is null or undefined, skipping fetch");
            return;
        }

        axios.get(`/manage/food-detail/?food_id=${foodDetailRetrieve.id}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                withCredentials: true,
                Authorization: `Token ` + tokenUser,
            },
        })
            .then(res => {
                ssetFoodDetailRetrieve(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    useEffect(() => {
        // Only call retrieveFoodDetail2 if meeting?.food is valid
        if (meeting?.food !== null && meeting?.food !== undefined) {
            retrieveFoodDetail2();
        }

        // Only call retrieveFoodDetail3 if foodDetailRetrieve?.id is valid
        if (foodDetailRetrieve?.id !== null && foodDetailRetrieve?.id !== undefined) {
            retrieveFoodDetail3();
        }

    }, [meeting?.food, foodDetailRetrieve?.id]);

    return (
        <div style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
            <SidebarComponent />
            <Container fluid id={theme === 'light' ? 'containerAppDark' : 'containerAppLight'} style={{ marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' }}>
                <div className='ms-3 pt-4'>
                    <Row style={{ maxWidth: isMobile ? '100vw' : showSidebar ? '91vw' : '81vw' }}>
                        <Col xs={6} md={6} lg={6} className='text-start'>
                            <h3 className='' style={{ fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' }}>
                                Informasi Meeting
                            </h3>
                        </Col>
                        <Col xs={6} md={6} lg={6} className={isMobile === false ? 'text-end my-auto' : 'my-auto'}>
                            <div className='text-end' style={{ maxWidth: isMobile ? '100vw' : showSidebar ? '91vw' : '81vw' }}>
                                {meeting?.status === 'processing' ? (
                                    <>
                                        {
                                            meeting?.online === true ?
                                                (
                                                    <>
                                                        {isSubmitting ? (
                                                            <Button
                                                                id={theme === 'light' ? 'actionButtonApproveDark' : 'actionButtonApproveLight'}
                                                                variant='btn'
                                                                className='me-3'
                                                                disabled
                                                                style={{ minWidth: '75px' }}
                                                            >
                                                                <Spinner
                                                                    animation="border"
                                                                    size='sm'
                                                                />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant='btn'
                                                                id={theme === 'light' ? 'actionButtonApproveDark' : 'actionButtonApproveLight'}
                                                                className='me-3'
                                                                onClick={handleApprove}
                                                                disabled={!meeting.link_meeting}
                                                            >
                                                                Setuju
                                                            </Button>
                                                        )}
                                                    </>
                                                )
                                                :
                                                (
                                                    <>
                                                        {isSubmitting ? (
                                                            <Button
                                                                id={theme === 'light' ? 'actionButtonApproveDark' : 'actionButtonApproveLight'}
                                                                variant='btn'
                                                                className='me-3'
                                                                disabled
                                                                style={{ minWidth: '75px' }}
                                                            >
                                                                <Spinner
                                                                    animation="border"
                                                                    size='sm'
                                                                />
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant='btn'
                                                                id={theme === 'light' ? 'actionButtonApproveDark' : 'actionButtonApproveLight'}
                                                                className='me-3'
                                                                disabled={
                                                                    (meeting.snack || meeting.full_meal) && !selectedFood
                                                                }
                                                                onClick={handleApprove} >
                                                                Setuju
                                                            </Button>

                                                        )}
                                                    </>

                                                )
                                        }
                                        <Button variant='btn' id={theme === 'light' ? 'actionButtonDeniedDark' : 'actionButtonDeniedLight'} className='me-3' onClick={handleDenied}>Tolak</Button>
                                        <Button variant='btn' id={theme === 'light' ? 'actionButtonKembaliDark' : 'actionButtonKembaliLight'} onClick={buttonBack}>Kembali</Button>
                                    </>
                                )
                                    :
                                    (
                                        <Button variant='btn' id={theme === 'light' ? 'actionButtonKembaliDark' : 'actionButtonKembaliLight'} className='me-1' onClick={buttonBack}>Kembali</Button>
                                    )
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className='ms-3 pt-4' style={{ maxWidth: isMobile ? '100vw' : showSidebar ? '89vw' : '79vw' }}>
                    <Row>
                        <Col xs={12} md={12} lg={5} className='my-2'>
                            <Card id={theme === 'light' ? 'cardDetailMeetingDark' : 'cardDetailMeetingLight'} >
                                <Card.Body style={{ minHeight: '620px', maxHeight: isMobile ? 'none' : '' }}>
                                    <>
                                        <Row>
                                            <Col xs={!meeting?.finished ? 6 : 6} className='text-start'>
                                                <p
                                                    className='head-content'
                                                >
                                                    Detail Meeting
                                                </p>
                                            </Col>
                                            <Col xs={6} className='text-end my-auto'>
                                                <p
                                                    className='head-content'
                                                >
                                                    {(() => {
                                                        switch (meeting?.status) {
                                                            case 'approved':
                                                                return <span style={{ color: '#84C38A' }}>Disetujui</span>;
                                                            case 'denied':
                                                                return <span style={{ color: '#FF0060' }}>Ditolak</span>;
                                                            default:
                                                                return null;
                                                        }
                                                    })()}
                                                </p>
                                            </Col>
                                        </Row>
                                    </>
                                    <div>
                                        <Form>
                                            <Row>
                                                {loading ? (
                                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                                        <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Col xs={12} md={8} lg={8} className="mb-3">
                                                            <Form.Group >
                                                                <Form.Label style={formStyles.label} htmlFor='namaMeeting'>Nama Meeting</Form.Label>
                                                                <Form.Control
                                                                    id='namaMeeting'
                                                                    type="text"
                                                                    value={meeting?.nama_meeting || ''}
                                                                    readOnly
                                                                    style={formStyles.input}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12} md={4} lg={4} className="mb-3">
                                                            <Form.Group >
                                                                <Form.Label style={formStyles.label} htmlFor='tipeMeeting'>Tipe Meeting</Form.Label>
                                                                <Form.Control
                                                                    id='tipeMeeting'
                                                                    type="text"
                                                                    value={
                                                                        (() => {
                                                                            switch (meeting?.online) {
                                                                                case false:
                                                                                    return "Offline";
                                                                                case true:
                                                                                    return "Online";
                                                                                default:
                                                                                    return "";
                                                                            }
                                                                        })()

                                                                        || ''
                                                                    }
                                                                    readOnly
                                                                    style={formStyles.inputTipeMeeting}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12} md={6} lg={6} className="mb-3">
                                                            <Form.Group >
                                                                <Form.Label style={formStyles.label} htmlFor='requestBy'>Permintaan dari</Form.Label>
                                                                <Form.Control
                                                                    id='requestBy'
                                                                    type="text"
                                                                    value={filteredUserObject || ''}
                                                                    readOnly
                                                                    style={formStyles.input}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={12} md={6} lg={6} className="mb-3">
                                                            <Form.Group>
                                                                <Form.Label style={formStyles.label} htmlFor='date'>Tanggal</Form.Label>
                                                                <Form.Control
                                                                    id='date'
                                                                    type="date"
                                                                    value={date || ''}
                                                                    readOnly
                                                                    style={formStyles.input}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={6} md={6} lg={6} className="mb-3">
                                                            <Form.Group >
                                                                <Form.Label style={formStyles.label} htmlFor='startTime'>Waktu Mulai</Form.Label>
                                                                <Form.Control
                                                                    id='startTime'
                                                                    type="time"
                                                                    value={startTime || ''}
                                                                    readOnly
                                                                    style={formStyles.input}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col xs={6} md={6} lg={6} className="mb-3">
                                                            <Form.Group >
                                                                <Form.Label style={formStyles.label} htmlFor='endTime'>Waktu Selesai</Form.Label>
                                                                <Form.Control
                                                                    id='endTime'
                                                                    type="time"
                                                                    value={endTime || ''}
                                                                    readOnly
                                                                    style={formStyles.input}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        {meeting.snack == false && meeting.full_meal == false ?
                                                            (
                                                                <></>
                                                            )
                                                            :
                                                            (
                                                                <>
                                                                    {meeting.status === 'approved' ?

                                                                        (
                                                                            <>
                                                                                <Col xs={12} md={12} lg={12} className="mb-3">
                                                                                    <Row>
                                                                                        <Col xs={6}>
                                                                                            <Form.Label style={formStyles.label} htmlFor='food-category'>Makanan Kategori*</Form.Label>
                                                                                            <div key="inline-checkbox" className="mb-3">
                                                                                                <Form.Check
                                                                                                    inline
                                                                                                    label="Snack"
                                                                                                    name="group1"
                                                                                                    type="checkbox"
                                                                                                    id="inline-checkbox-1"
                                                                                                    disabled={meeting.full_meal == true}
                                                                                                    checked={snackChecked}
                                                                                                    onChange={handleSnackChange}
                                                                                                    style={{ fontFamily: 'Poppins-Light' }}
                                                                                                />
                                                                                                <Form.Check
                                                                                                    inline
                                                                                                    label="Meal"
                                                                                                    name="group1"
                                                                                                    type="checkbox"
                                                                                                    id="inline-checkbox-2"
                                                                                                    disabled={meeting.snack == true}
                                                                                                    checked={fullMealChecked}
                                                                                                    onChange={handleFullMealChange}
                                                                                                    style={{ fontFamily: 'Poppins-Light' }}
                                                                                                />
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className='text-end'>
                                                                                            <Form.Label style={formStyles.label} htmlFor='attendances'>Jumlah Peserta</Form.Label>
                                                                                            <p className='mt-1' style={{ fontFamily: 'Poppins-Light' }}>
                                                                                                {meeting?.attendaces || 0} Orang
                                                                                            </p>
                                                                                        </Col>
                                                                                    </Row>

                                                                                    <Row>
                                                                                        <Col xs={8}>
                                                                                            <Form.Label style={formStyles.label} htmlFor='food'>Paket Makanan*</Form.Label>
                                                                                            <Form.Control
                                                                                                id='food'
                                                                                                type="text"
                                                                                                value={foodDetailRetrieve?.nama || ''}
                                                                                                readOnly
                                                                                                style={formStyles.input}
                                                                                            />
                                                                                        </Col>
                                                                                        <Col xs={4} className='my-auto text-end'>
                                                                                            <Form.Label style={formStyles.label}>Harga Paket</Form.Label>
                                                                                            <p className='mt-2' style={{ fontFamily: 'Poppins-Light' }}>
                                                                                                {numberFormat(foodDetailRetrieve?.price || 0)}
                                                                                            </p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <Table
                                                                                        bordered
                                                                                        responsive
                                                                                        className='mt-3'
                                                                                        data-bs-theme={theme === 'light' ? 'dark' : ''}
                                                                                    >
                                                                                        <thead>
                                                                                            <tr style={{ fontFamily: 'Poppins-Regular' }}>
                                                                                                <th>#</th>
                                                                                                <th>Nama Makanan</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody style={{ fontFamily: 'Poppins-Regular' }}>
                                                                                            {foodItemRetrieve.length > 0 ? (
                                                                                                foodItemRetrieve.map((item, index) => (
                                                                                                    <tr key={index}>
                                                                                                        <td>{index + 1}</td>
                                                                                                        <td>{item.nama}</td>
                                                                                                    </tr>
                                                                                                ))
                                                                                            ) : (
                                                                                                <tr>
                                                                                                    <td colSpan="3" className="text-center" style={{ fontFamily: 'Poppins-Light' }}>
                                                                                                        Tidak ada makanan
                                                                                                    </td>
                                                                                                </tr>
                                                                                            )}
                                                                                        </tbody>
                                                                                    </Table>
                                                                                    <div>
                                                                                        <Form.Label style={formStyles.label}>Total Cost</Form.Label>
                                                                                        <p style={{ fontFamily: 'Poppins-Light' }}>
                                                                                            {numberFormat(meeting?.cost || 0)}
                                                                                        </p>
                                                                                    </div>
                                                                                </Col>
                                                                            </>
                                                                        )
                                                                        :
                                                                        (
                                                                            <>
                                                                                <Col xs={12} md={12} lg={12} className="mb-3">
                                                                                    <Row>
                                                                                        <Col xs={6}>
                                                                                            <Form.Label style={formStyles.label} htmlFor='food-category'>Makanan Kategori*</Form.Label>
                                                                                            <div key="inline-checkbox" className="mb-3">
                                                                                                <Form.Check
                                                                                                    inline
                                                                                                    label="Snack"
                                                                                                    name="group1"
                                                                                                    type="checkbox"
                                                                                                    id="inline-checkbox-1"
                                                                                                    disabled={meeting.full_meal == true}
                                                                                                    checked={snackChecked}
                                                                                                    onChange={handleSnackChange}
                                                                                                    style={{ fontFamily: 'Poppins-Light' }}
                                                                                                />
                                                                                                <Form.Check
                                                                                                    inline
                                                                                                    label="Meal"
                                                                                                    name="group1"
                                                                                                    type="checkbox"
                                                                                                    id="inline-checkbox-2"
                                                                                                    disabled={meeting.snack == true}
                                                                                                    checked={fullMealChecked}
                                                                                                    onChange={handleFullMealChange}
                                                                                                    style={{ fontFamily: 'Poppins-Light' }}
                                                                                                />
                                                                                            </div>
                                                                                        </Col>
                                                                                        <Col xs={6} className='text-end'>
                                                                                            <Form.Label style={formStyles.label} htmlFor='attendances'>Jumlah Peserta</Form.Label>
                                                                                            <p className='mt-1' style={{ fontFamily: 'Poppins-Light' }}>
                                                                                                {meeting?.attendaces || 0} Orang
                                                                                            </p>
                                                                                        </Col>
                                                                                    </Row>

                                                                                    <Row>
                                                                                        <Col xs={8}>
                                                                                            <Form.Label style={formStyles.label} htmlFor='food'>Paket Makanan*</Form.Label>
                                                                                            <Select
                                                                                                options={foodOptions}
                                                                                                value={selectedFood}
                                                                                                onChange={handleSelectFood}
                                                                                                placeholder='Pilih paket makanan'
                                                                                                styles={selectStyles}
                                                                                            />
                                                                                        </Col>
                                                                                        <Col xs={4} className='my-auto text-end'>
                                                                                            <Form.Label style={formStyles.label}>Harga Paket</Form.Label>
                                                                                            <p className='mt-2' style={{ fontFamily: 'Poppins-Light' }}>
                                                                                                {numberFormat(selectedFood?.price || 0)}
                                                                                            </p>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <Table
                                                                                        bordered
                                                                                        responsive
                                                                                        className='mt-3'
                                                                                        data-bs-theme={theme === 'light' ? 'dark' : ''}
                                                                                    >
                                                                                        <thead>
                                                                                            <tr style={{ fontFamily: 'Poppins-Regular' }}>
                                                                                                <th>#</th>
                                                                                                <th>Nama Makanan</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody style={{ fontFamily: 'Poppins-Regular' }}>
                                                                                            {listFoodDetail.length > 0 ? (
                                                                                                listFoodDetail.map((item, index) => (
                                                                                                    <tr key={index}>
                                                                                                        <td>{index + 1}</td>
                                                                                                        <td>{item.nama}</td> {/* Access name property */}
                                                                                                    </tr>
                                                                                                ))
                                                                                            ) : (
                                                                                                <tr>
                                                                                                    <td colSpan="3" className="text-center" style={{ fontFamily: 'Poppins-Light' }}>
                                                                                                        Tidak ada makanan
                                                                                                    </td>
                                                                                                </tr>
                                                                                            )}
                                                                                        </tbody>
                                                                                    </Table>
                                                                                    <div>
                                                                                        <Form.Label style={formStyles.label}>Total Cost</Form.Label>
                                                                                        <p style={{ fontFamily: 'Poppins-Light' }}>
                                                                                            {numberFormat(totalCost || 0)}
                                                                                        </p>
                                                                                    </div>
                                                                                </Col>
                                                                            </>
                                                                        )
                                                                    }

                                                                </>
                                                            )
                                                        }
                                                    </>
                                                )}
                                                {
                                                    meeting?.online === true ?
                                                        <Col xs={12} md={12} lg={12} className="mb-3">
                                                            {
                                                                !meeting?.link_meeting && meeting?.status === "processing" ?
                                                                    (
                                                                        <>
                                                                            <Form.Label style={formStyles.label} htmlFor='radioAccount'>Akun Meeting Online</Form.Label>
                                                                            {dataSelectedAccount}

                                                                            {
                                                                                !selectedAccount ?
                                                                                    <></>
                                                                                    :

                                                                                    <>
                                                                                        <Form.Group className="mb-3">
                                                                                            <Form.Label style={formStyles.label} htmlFor='meetingTopic'>Topik Meeting*</Form.Label>
                                                                                            <Form.Control
                                                                                                id='meetingTopic'
                                                                                                type="text"
                                                                                                value={meetingTopic || ''}
                                                                                                required
                                                                                                placeholder="Masukkan topik meeting"
                                                                                                style={formStyles.input}
                                                                                            />
                                                                                        </Form.Group>
                                                                                        <Form.Group className="mb-3">
                                                                                            <Form.Label style={formStyles.label} htmlFor='meetingAgenda'>Agenda Meeting</Form.Label>
                                                                                            <Form.Control
                                                                                                id='meetingAgenda'
                                                                                                type="text"
                                                                                                as="textarea"
                                                                                                rows={3}
                                                                                                onChange={(e) => setMeetingAgenda(e.target.value)}
                                                                                                value={meetingAgenda}
                                                                                                placeholder="Masukkan topik agenda"
                                                                                                style={formStyles.input}
                                                                                            />
                                                                                            <small style={{ fontFamily: 'Poppins-Light', color: '#acacac' }}>Deskripsi meeting yang lebih detail (Opsional)</small>
                                                                                        </Form.Group>
                                                                                        <Form.Group className="mb-3">
                                                                                            <Form.Label style={formStyles.label} htmlFor='startMeeting'>Mulai Meeting*</Form.Label>
                                                                                            <Form.Control
                                                                                                id='startMeeting'
                                                                                                type="datetime-local"
                                                                                                value={meetingStartTime || ''}
                                                                                                min={getTodayDate()}
                                                                                                required
                                                                                                style={formStyles.input}
                                                                                            />
                                                                                        </Form.Group>
                                                                                        <Form.Group className="mb-3">
                                                                                            <Form.Label style={formStyles.label} htmlFor='meetingDuration'>Durasi Meeting*</Form.Label>
                                                                                            <Form.Control
                                                                                                id='meetingDuration'
                                                                                                type="number"
                                                                                                value={meetingDuration || ''}
                                                                                                required
                                                                                                placeholder="Masukkan durasi meeting"
                                                                                                style={formStyles.input}
                                                                                            />
                                                                                            <small style={{ fontFamily: 'Poppins-Light', color: '#acacac' }}>Durasi menggunakan hitungan menit</small>
                                                                                        </Form.Group>
                                                                                        <div className="d-grid gap-2 mt-4">
                                                                                            {isSubmitting ? (
                                                                                                <Button
                                                                                                    id={theme === 'light' ? 'actionButtonModalDark' : 'actionButtonModalLight'}
                                                                                                    variant='btn'
                                                                                                    disabled
                                                                                                >
                                                                                                    <Spinner
                                                                                                        animation="border"
                                                                                                        size='sm'
                                                                                                    />
                                                                                                </Button>
                                                                                            ) : (
                                                                                                <Button
                                                                                                    variant='btn'
                                                                                                    id={theme === 'light' ? 'buttonTambahTableDark' : 'buttonTambahTableLight'}
                                                                                                    onClick={handleSubmiNewToken}
                                                                                                    disabled={disabled}
                                                                                                >
                                                                                                    Buat Meeting
                                                                                                </Button>
                                                                                            )}
                                                                                        </div>
                                                                                    </>
                                                                            }
                                                                        </>
                                                                    )
                                                                    :
                                                                    (

                                                                        <>
                                                                            {
                                                                                meeting?.status === "approved" || meeting?.status === "denied" ?
                                                                                    (

                                                                                        <></>
                                                                                    )
                                                                                    :
                                                                                    (
                                                                                        <Form.Group >
                                                                                            <Form.Label style={formStyles.label} htmlFor='linkMeeting'>Link Meeting</Form.Label>
                                                                                            <Form.Control
                                                                                                id='linkMeeting'
                                                                                                type="text"
                                                                                                as="textarea"
                                                                                                rows={3}
                                                                                                value={meeting?.link_meeting || ''}
                                                                                                readOnly
                                                                                                style={formStyles.input}
                                                                                            />
                                                                                        </Form.Group>
                                                                                    )
                                                                            }
                                                                        </>
                                                                    )
                                                            }
                                                        </Col>
                                                        :
                                                        <></>
                                                }
                                            </Row>
                                        </Form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={12} lg={7} className='my-2'>
                            <Card id={theme === 'light' ? 'cardDetailRuanganDark' : 'cardDetailRuanganLight'}>
                                <Card.Body style={{ minHeight: '620px', maxHeight: isMobile ? 'none' : '620px' }}>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Detail Ruangan
                                    </p>
                                    {loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                            <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                                        </div>
                                    ) : (
                                        <div>
                                            <Row>
                                                <Col xs={12} md={6} lg={6}  >
                                                    <p className='label'>Nama Gedung:</p>
                                                    <p className='content mb-3'>{detailRuangan?.gedung}</p>
                                                    <p className='label'>Nama Ruangan:</p>
                                                    <p className='content mb-3'>{detailRuangan?.nama_ruangan}</p>
                                                    <p className='label'>Nomor Ruangan:</p>
                                                    <p className='content mb-3'>{detailRuangan?.no_ruangan}</p>
                                                </Col>
                                                <Col xs={12} md={6} lg={6} >
                                                    <p className='label'>Lantai:</p>
                                                    <p className='content mb-3'>{detailRuangan?.lantai}</p>
                                                    <p className='label'>Kapasitas Ruangan:</p>
                                                    <p className='content mb-3'>{detailRuangan?.kapasitas} orang</p>
                                                </Col>
                                                <Col xs={12}  >
                                                    <Table bordered responsive data-bs-theme={theme === "light" ? "dark" : "light"}>
                                                        <thead>
                                                            <tr style={{ fontFamily: 'Poppins-Regular', textAlign: 'center' }}>
                                                                <th>#</th>
                                                                <th>Nama Equipment</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                detailEquipment.map((data, index) => {

                                                                    return (
                                                                        <tr key={index} style={{ fontFamily: 'Poppins-Light' }}>
                                                                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                                            <td>{data?.nama_equipment}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} md={12} lg={12} className='mt-3 mb-2'>
                            <Card id={theme === 'light' ? 'cardDetailPesertaDark' : 'cardDetailPesertaLight'}>
                                <Card.Body>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Detail Peserta
                                    </p>
                                    {loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                            <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                                        </div>
                                    ) : (
                                        <div>
                                            <Table bordered responsive data-bs-theme={theme === "light" ? "dark" : "light"}>
                                                <thead>
                                                    <tr style={{ fontFamily: 'Poppins-Regular', textAlign: 'center' }}>
                                                        <th>#</th>
                                                        <th>Nama Peserta</th>
                                                        <th>Status Kehadiran</th>
                                                        {meeting?.finished === true ?
                                                            (
                                                                <>
                                                                </>
                                                            )
                                                            :
                                                            (
                                                                <th>Hapus</th>
                                                            )
                                                        }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        dataPeserta.map((data, index) => {

                                                            return (
                                                                <tr key={index} style={{ fontFamily: 'Poppins-Light' }}>
                                                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                                    <td>{data?.user_name}</td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        {(() => {
                                                                            switch (data?.hadir) {
                                                                                case true:
                                                                                    return <span>Hadir</span>;
                                                                                case false:
                                                                                    return <span className='text-muted'>Tidak Hadir</span>;
                                                                                default:
                                                                                    return null;
                                                                            }
                                                                        })()}
                                                                    </td>
                                                                    {meeting?.finished === true ?
                                                                        (
                                                                            <>
                                                                            </>
                                                                        )
                                                                        :
                                                                        (
                                                                            <td className='text-center'>
                                                                                <Button
                                                                                    variant='btn'
                                                                                    onClick={() => handleDelete(data.id)}
                                                                                    style={{ border: 'none' }}
                                                                                // disabled={index === 0}
                                                                                >
                                                                                    <FaWindowClose size={20} color='#FF0060' />
                                                                                </Button>
                                                                            </td>
                                                                        )
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                </div>
            </Container>
        </div>
    )
}

export default MeetingDetail;