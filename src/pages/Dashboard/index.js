import React, { useContext, useEffect, useState } from 'react'
import { ChartComponent, ChartDivisi, HeaderMobile, HeaderWeb, SidebarComponent } from '../../components'
import { Card, Col, Container, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap'
import { AuthContext, ThemeContext } from '../../auth';
import { useMediaQuery } from 'react-responsive';
import axios from '../../api/axios';
import { FaDoorOpen } from 'react-icons/fa';
import { MdLibraryBooks, MdWorkHistory } from 'react-icons/md';
import { IoCalendar, IoTime } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const { theme } = useContext(ThemeContext);
    const isMobile = useMediaQuery({ maxWidth: 1024 });
    const { userInfo, showSidebar, tokens } = useContext(AuthContext);
    const [listMeeting, setListMeeting] = useState([]);
    const [meetingIncoming, setMeetingIncoming] = useState([]);
    const [meetingToday, setMeetingToday] = useState([]);
    const [historyMeeting, setHistoryMeeting] = useState([]);
    const [listRuangan, setListRuangan] = useState([]);
    const [loading, setLoading] = useState(true);
    const tokenUser = tokens?.token;
    const navigate = useNavigate();

    const retrieveMeeting = (showLoading = true) => {
        if (showLoading) setLoading(true);

        axios
            .get(`/manage/requests/`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },
            })
            .then((res) => {
                const filterData = res.data.filter((item) => item.status === 'processing');
                setListMeeting(filterData);

                const onGoingMeeting = res.data.filter(
                    (item) => item.status === 'approved' && item.finished === false
                );
                setMeetingIncoming(onGoingMeeting);


                const today = new Date();
                const filteredTodayMeetings = onGoingMeeting.filter((item) => {
                    const meetingStart = new Date(item.waktu_mulai);

                    return (
                        meetingStart.getFullYear() === today.getFullYear() &&
                        meetingStart.getMonth() === today.getMonth() &&
                        meetingStart.getDate() === today.getDate()
                    );
                });

                setMeetingToday(filteredTodayMeetings);

                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const currentMonthMeetings = res.data.filter((item) => {
                    const isApprovedAndFinished = item.status === 'approved' && item.finished === true;

                    if (item.waktu_selesai && isApprovedAndFinished) {
                        // Parse waktu_selesai as a UTC date
                        const endDate = new Date(item.waktu_selesai);
                        const endMonthUTC = endDate.getUTCMonth();
                        const endYearUTC = endDate.getUTCFullYear();

                        // Compare against current month and year in UTC
                        return endMonthUTC === currentMonth && endYearUTC === currentYear;
                    }
                    return false;
                });

                setHistoryMeeting(currentMonthMeetings);
                // console.log( currentMonthMeetings );
                if (showLoading) setLoading(false);
            })
            .catch((err) => {
                if (showLoading) setLoading(false);
                console.error(err);
            });
    };

    // console.log( meetingIncoming );

    const retrieveRuangan = () => {
        setLoading(true);
        axios.get(`/manage/ruangan/`,
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

                setListRuangan(res.data);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            })
    }

    useEffect(() => {
        if (tokenUser !== undefined) retrieveMeeting(true);
        if (tokenUser !== undefined) retrieveRuangan(true);
    }, [tokenUser]);

    // useEffect( () =>
    // {
    //     const interval = setInterval( () =>
    //     {
    //         if ( tokenUser !== undefined ) retrieveMeeting( false ); 
    //     }, 5000 );

    //     return () => clearInterval( interval ); 
    // }, [ tokenUser ] );

    const intervalMinutes = 2;

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (tokenUser !== undefined) {
                retrieveMeeting(false);
            }
        }, intervalMinutes * 60000);

        return () => clearInterval(intervalId);
    }, [tokenUser]);

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const renderTooltip = (props, fullName) => (
        <Tooltip id="button-tooltip" {...props}>
            {fullName}
        </Tooltip>
    );

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    }


    const dataOngoingMeeting = meetingIncoming.map((data, index) => {


        if (index > 2) {
            return null;
        }

        return (
            <div className='pt-2' key={index}>
                <Row>
                    <Col xs={8} className='text-start'>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div
                                className='my-auto'
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: theme === 'light' ? '2px solid #FFF471' : '2px solid #006CB8',
                                    backgroundColor: 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '8px',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '16px',
                                    color: theme === 'light' ? '#FFF471' : '#006CB8',
                                }}
                            >
                                {index + 1}
                            </div>
                            <div className='pt-2'>
                                <p
                                    style={{
                                        fontFamily: 'Poppins-Regular',
                                        fontSize: '18px',
                                        marginBottom: '0px',
                                        color: theme === 'light' ? '#FFFFFF' : '#222'
                                    }}
                                >
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip({}, data?.nama_meeting)}
                                    >
                                        <span>
                                            {truncateText(data?.nama_meeting || '', 25)}
                                        </span>
                                    </OverlayTrigger>
                                    {/* { data?.nama_meeting } */}
                                </p>
                                <p
                                    style={{
                                        fontFamily: 'Poppins-Light',
                                        fontSize: '15px',
                                        color: '#707070',
                                        marginTop: '0px',
                                    }}
                                >
                                    {formatDate(data?.waktu_mulai.split('T')[0])}
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col xs={4} className='text-end'>
                        <p
                            className='pt-3'
                            style={{
                                fontFamily: 'Poppins-Light',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                color: theme === 'light' ? '#FFFFFF' : '#222',
                                margin: 0,
                            }}
                        >
                            <IoTime size={18} color={theme === 'light' ? '#FFF471' : '#006CB8'} style={{ marginRight: '8px' }} />
                            {data?.waktu_mulai.split('T')[1].split('Z')[0].slice(0, 5)}
                        </p>
                    </Col>
                </Row>
                {index === 2 && (
                    <div className='text-center mt-1'>
                        <button
                            onClick={() => navigate('/meeting/')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: theme === 'light' ? '#FFF471' : '#006CB8',
                                fontFamily: 'Poppins-Regular',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                        >
                            lihat selengkapnya
                        </button>
                    </div>
                )}
            </div>
        );
    });


    return (
        <div style={{ overflowX: 'hidden', maxWidth: '100vw' }}>
            <SidebarComponent />
            <Container fluid id={theme === 'light' ? 'containerAppDark' : 'containerAppLight'} style={{ marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' }}>
                <Row className='mb-2 pt-2 ms-1' style={{ maxWidth: isMobile ? '100vw' : showSidebar ? '90vw' : '82vw' }}>
                    <Col xs={12} md={12} lg={12} className='mt-3'>
                        <Row >
                            <Col xs={8} lg={8} className='text-start'>
                                <h3 style={{ fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' }}>
                                    Dashboard
                                </h3>
                                <p style={{ fontFamily: 'Poppins-Light', color: theme === 'light' ? '#FFFFFF' : '#707070', marginTop: '0px', marginBottom: '0px' }}>
                                    {/* Selamat datang, Surya Juniawan */}
                                    Selamat datang, {userInfo?.first_name}  {userInfo?.last_name}
                                </p>
                            </Col>
                            <Col xs={4} lg={4} className={isMobile === false ? 'text-end my-auto' : 'text-end mt-1'}>
                                {isMobile === false ? (
                                    <HeaderWeb />
                                ) : (
                                    <HeaderMobile />
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Row>
                        <Col xs={12} lg={6}>
                            <div className='py-4' style={{ maxWidth: isMobile ? '100vw' : showSidebar ? '89vw' : '82vw' }}>
                                <ChartComponent />
                            </div>
                        </Col>
                        <Col xs={12} lg={6}>
                            <div className='py-4'>
                                <ChartDivisi />
                            </div>
                        </Col>
                    </Row>
                </Row>
                <div className='ms-3 mt-5' style={{
                    backgroundColor: theme === 'light' ? 'rgba(52,58,64, 0.4)' : 'rgba(52, 80, 133, 0.15)',
                    minHeight: '250px',
                    borderRadius: '30px',
                    maxWidth: isMobile ? '100vw' : showSidebar ? '89vw' : '81vw'
                }}>
                    <Row className="justify-content-center align-items-center" style={{ minHeight: '250px' }}>
                        <Col xs={12} md={12} lg={4} className="my-auto text-center">
                            <h4 className={isMobile ? 'mt-3' : 'pt-3'} style={{ fontFamily: 'Poppins-Medium', color: theme === 'light' ? '#FFF471' : '#006CB8' }}>
                                Meetings
                            </h4>
                            <p style={{ fontFamily: 'Poppins-Light', color: '#707070' }}>
                                Informasi terkait meeting
                            </p>
                        </Col>
                        <Col xs={12} md={12} lg={8} className="d-flex justify-content-center my-3">
                            <Row id='cardMeetinDashboard'>
                                <Col xs={12} md={6} lg={3} className='my-4'>
                                    <Card
                                        id={theme === 'light' ? 'cardDashboard1-Dark' : 'cardDashboard1-Light'}
                                        style={{ minHeight: '150px', minWidth: isMobile ? '80px' : '150px' }}
                                    >
                                        <div
                                            className='icon-box'
                                            style={{
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            }}
                                        >
                                            <span>
                                                <IoCalendar size={25} color={theme === 'light' ? '#121212' : '#FFFFFF'} />
                                            </span>
                                        </div>

                                        {loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={{
                                                        fontFamily: 'Poppins-Regular',
                                                        fontSize: '18px',
                                                        marginBottom: '0px',
                                                        color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                    }}
                                                >
                                                    Permintaan
                                                </p>

                                                <h2 className='mt-2 text-center' style={{ fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' }}>
                                                    {listMeeting?.length || '0'}
                                                </h2>
                                            </div>
                                        )}
                                    </Card>
                                </Col>
                                <Col xs={12} md={6} lg={3} className='my-4'>
                                    <Card
                                        id={theme === 'light' ? 'cardDashboard2-Dark' : 'cardDashboard2-Light'}
                                        style={{ minHeight: '150px', minWidth: isMobile ? '80px' : '150px' }}
                                    >
                                        <div
                                            className='icon-box'
                                            style={{
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            }}
                                        >
                                            <span >
                                                <MdLibraryBooks size={25} color={theme === 'light' ? '#121212' : '#FFFFFF'} />
                                            </span>
                                        </div>

                                        {loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={{
                                                        fontFamily: 'Poppins-Regular',
                                                        fontSize: '18px',
                                                        marginBottom: '0px',
                                                        color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                    }}
                                                >
                                                    Meeting
                                                </p>
                                                <h2 className='mt-2 text-center' style={{ fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' }}>
                                                    {meetingToday?.length || '0'}
                                                </h2>
                                            </div>
                                        )}

                                    </Card>
                                </Col>
                                <Col xs={12} md={6} lg={3} className='my-4'>
                                    <Card
                                        id={theme === 'light' ? 'cardDashboard3-Dark' : 'cardDashboard3-Light'}
                                        style={{ minHeight: '150px', minWidth: isMobile ? '80px' : '150px' }}
                                    >
                                        <div
                                            className='icon-box'
                                            style={{
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            }}
                                        >
                                            <span >
                                                <MdWorkHistory size={25} color={theme === 'light' ? '#121212' : '#FFFFFF'} />
                                            </span>
                                        </div>

                                        {loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={{
                                                        fontFamily: 'Poppins-Regular',
                                                        fontSize: '18px',
                                                        marginBottom: '0px',
                                                        color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                    }}
                                                >
                                                    Riwayat
                                                </p>
                                                <h2 className='mt-2 text-center' style={{ fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' }}>
                                                    {historyMeeting?.length || '0'}
                                                </h2>
                                            </div>
                                        )}

                                    </Card>
                                </Col>
                                <Col xs={12} md={6} lg={3} className='my-4'>
                                    <Card
                                        id={theme === 'light' ? 'cardDashboard4-Dark' : 'cardDashboard4-Light'}
                                        style={{ minHeight: '150px', minWidth: isMobile ? '80px' : '150px' }}
                                    >
                                        <div
                                            className='icon-box'
                                            style={{
                                                background: theme === 'light' ? '#FFF471' : '#006CB8'
                                            }}
                                        >
                                            <span >
                                                <FaDoorOpen size={25} color={theme === 'light' ? '#121212' : '#FFFFFF'} />
                                            </span>
                                        </div>

                                        {loading ? (
                                            <div
                                                className='mt-5 d-flex justify-content-center align-items-center'
                                            >
                                                <Spinner animation='border' style={{ color: theme === 'light' ? '#FFF471' : '#006CB8' }} />
                                            </div>
                                        ) : (
                                            <div>
                                                <p
                                                    className='mt-3 text-center'
                                                    style={{
                                                        fontFamily: 'Poppins-Regular',
                                                        fontSize: '18px',
                                                        marginBottom: '0px',
                                                        color: theme === 'light' ? '#FFF471' : '#006CB8'
                                                    }}
                                                >
                                                    Ruangan
                                                </p>
                                                <h2 className='mt-2 text-center' style={{ fontFamily: 'Poppins-SemiBold', color: theme === 'light' ? '#FFF471' : '#006CB8' }}>
                                                    {listRuangan?.length || '0'}
                                                </h2>
                                            </div>
                                        )}

                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <br />
            </Container>
        </div>
    )
}

export default Dashboard
