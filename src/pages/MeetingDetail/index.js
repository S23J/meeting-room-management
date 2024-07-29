import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext, ThemeContext } from '../../auth';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import
{
    HeaderDetailPage,
    HeaderMobile2,
    ModalEditLink,
    ModalEditPin,
    ModalTambahLink,
    ModalTambahPin,
    SidebarComponent
}
    from '../../components';
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { CiCirclePlus, CiEdit } from 'react-icons/ci';

function MeetingDetail ()
{
    const { meetingid } = useParams();
    const { tokens, showSidebar } = useContext( AuthContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { theme } = useContext( ThemeContext );
    const tokenUser = tokens?.token;
    const [ meeting, setMeeting ] = useState( null );
    const [ listUser, setListUser ] = useState( [] );
    const [ detailPeserta, setDetailPeserta ] = useState( [] );
    const [ detailRuangan, setDetailRuangan ] = useState();
    const [ detailEquipment, setDetailEquipment ] = useState( [] );
    const [ date, setDate ] = useState();
    const [ startTime, setStartTime ] = useState();
    const [ endTime, setEndTime ] = useState();
    const [ filteredUserObject, setFilteredUserObject ] = useState( {} );
    const navigate = useNavigate();
    const [ showAddPin, setShowAddPin ] = useState( false );
    const [ showEditPin, setShowEditPin ] = useState( false );
    const [ showAddLink, setShowAddLink ] = useState( false );
    const [ showEditLink, setShowEditLink ] = useState( false );

    const handleShowAddPin = () =>
    {
        setShowAddPin( true );
    }

    const handleShowEditPin = () =>
    {
        setShowEditPin( true );
    }

    const handleShowAddLink = () =>
    {
        setShowAddLink( true );
    }

    const handleShowEditLink = () =>
    {
        setShowEditLink( true );
    }

    const buttonBack = () =>
    {
        navigate( -1 )
    }

    const retrieveDetailMeeting = () =>
    {
        axios.get( `/manage/requests/${meetingid}/`,
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

                setMeeting( res.data );
                setDate( res?.data.waktu_mulai.split( 'T' )[ 0 ] )
                setStartTime( res?.data.waktu_mulai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) );
                setEndTime( res?.data.waktu_selesai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) );
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

                setListUser( res.data );
            } ).catch( err =>
            {
            } )
    }

    const retrievePeserta = () =>
    {
        axios.get( `/manage/peserta/filter_by_request/?request_id=${meeting?.id}`,
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

                setDetailPeserta( res.data );

            } ).catch( err =>
            {
            //    console.log( err )
            } )
    }


    const retrieveRuangan = () =>
    {
        axios.get( `/manage/ruangan/${meeting?.ruangan}/`,
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

                setDetailRuangan( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {

            } )
    }

    const retrieveDetailEquipment = () =>
    {
        axios.get( `/manage/equipment/filter_by_ruangan/?ruangan_id=${detailRuangan?.id}`,
            {
                headers:
                {
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {
                setDetailEquipment( res.data );
                // console.log( res.data )
            } ).catch( err =>
            {

            } )
    }

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( tokenUser !== undefined ) {

                await retrieveDetailMeeting();
                await retrieveUser();

                if ( meeting?.ruangan !== undefined ) {
                    await retrieveRuangan();
                }

                if ( meeting?.id !== undefined ) {
                    await retrievePeserta();
                }

                if ( detailRuangan?.id !== undefined ) {
                    await retrieveDetailEquipment();
                }
            }
        };

        fetchData();
    }, [ tokenUser, meeting?.ruangan, detailRuangan?.id ] );


    useEffect( () =>
    {
        if ( meeting && listUser.length > 0 ) {
            const filteredUsers = listUser.filter( user => user?.id === meeting?.user );
            const userObject = filteredUsers.reduce( ( obj, user ) =>
            {
                const userName = filteredUsers ? user.first_name + ' ' + user.last_name : '';
                return userName;
            }, {} );
            setFilteredUserObject( userObject );
        }
    }, [ meeting, listUser ] );

    const [ dataPeserta, setDataPeserta ] = useState( [] );

    useEffect( () =>
    {
        const dataPesertaFilter = detailPeserta.map( ( { ...rest } ) => rest );

        setDataPeserta(
            dataPesertaFilter.map( ( data ) =>
            {
                const userInfo = listUser.find( ( sales ) => sales.id === data.user );
                const userName = userInfo ? userInfo.first_name + ' ' + userInfo.last_name : '';

                return {
                    ...data,
                    user_name: userName,
                };
            } )
        );
    }, [ detailPeserta, listUser ] );

    const handleApprove = async ( event ) =>
    {

        const confirmApprove = await Swal.fire( {
            title: 'Apakah anda yakin ingin menyetujui meeting?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Setuju',
            cancelButtonText: 'Batal',
        } );

        event.preventDefault();
        const data = {
            status: "approved",
        };

        if ( !confirmApprove.isConfirmed ) {

            return;
        }
        // console.log( data )
        try {
            const response = await axios.patch( `/manage/requests/${meetingid}/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ${tokens.token}`,
                    },
                }
            );
            // console.log( response );
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil menyetujui meeting',
                showConfirmButton: false,
                timer: 3000,
            } );
            navigate( '/meeting/' );
        } catch ( error ) {
            console.log( error );
            Swal.fire( {
                icon: 'error',
                title: 'Warning!',
                text: 'Gagal menyetujui meeting',
            } );
        }
    };

    const handleDenied = async ( event ) =>
    {

        const confirmDenied = await Swal.fire( {
            title: 'Apakah anda yakin ingin menolak meeting?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal',
        } );

        event.preventDefault();
        const data = {
            status: "denied",
            finished: true,
        };

        if ( !confirmDenied.isConfirmed ) {

            return;
        }
        try {
            const response = await axios.patch( `/manage/requests/${meetingid}/`, data,
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ${tokens.token}`,
                    },
                }
            );
            // console.log( response );
            Swal.fire( {
                icon: 'success',
                title: 'Berhasil menolak meeting',
                showConfirmButton: false,
                timer: 3000,
            } );
            navigate( '/meeting/' );
        } catch ( error ) {
            console.log( error );
            Swal.fire( {
                icon: 'error',
                title: 'Warning!',
                text: 'Gagal menolak meeting',
            } );
        }
    };


    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '94vw' : '84.5vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            {
                                isMobile === false ? (
                                    <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '' } }>
                                        Detail Meeting
                                    </h3>
                                )
                                    :
                                    (
                                        <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '' } }>
                                            Detail Meeting
                                        </h3>
                                    )
                            }
                        </Col>
                        <Col xs={ 6 } lg={ 6 } className={ isMobile === false ? 'text-end my-auto' : 'my-auto' }>
                            { isMobile === false ? (
                                <HeaderDetailPage />
                            ) : (
                                    <HeaderMobile2 />
                            ) }
                        </Col>
                    </Row>
                </div>
                <hr className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '92.5vw' : '83vw', border: '1px solid', borderColor: theme === 'light' ? '#FFFFFF' : '#000A2E', marginTop: '5px' } } />
                <div className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91.5vw' : '81.7vw' } }>
                    { meeting?.status === 'processing' ? (
                        <>
                            <Button variant='btn' id={ theme === 'light' ? 'actionButtonApproveDark' : 'actionButtonApproveLight' } className='me-3' onClick={ handleApprove } disabled={ !meeting?.pincode }>Setuju</Button>
                            <Button variant='btn' id={ theme === 'light' ? 'actionButtonDeniedDark' : 'actionButtonDeniedLight' } className='me-3' onClick={ handleDenied }>Tolak</Button>
                            <Button variant='btn' id={ theme === 'light' ? 'actionButtonKembaliDark' : 'actionButtonKembaliLight' } onClick={ buttonBack }>Kembali</Button>
                        </>
                    )
                        :
                        (
                            <Button variant='btn' id={ theme === 'light' ? 'actionButtonKembaliDark' : 'actionButtonKembaliLight' } className='me-1' onClick={ buttonBack }>Kembali</Button>
                        )
                    }
                </div>
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91.5vw' : '81.7vw' } }>
                    <Row>
                        <Col xs={ 12 } md={ 5 } lg={ 5 } className='my-2'>
                            <Card id={ theme === 'light' ? 'cardDetailMeetingDark' : 'cardDetailMeetingLight' } >
                                <Card.Body style={ { minHeight: '620px', maxHeight: isMobile ? 'none' : '620px' } }>
                                    <>
                                        <Row>
                                            <Col xs={ !meeting?.finished ? 6 : 6 } className='text-start'>
                                                <p
                                                    className='head-content'
                                                >
                                                    Detail Meeting
                                                </p>
                                            </Col>
                                            <Col xs={ 6 } className='text-end my-auto'>
                                                <p
                                                    className='head-content'
                                                >
                                                    { ( () =>
                                                    {
                                                        switch ( meeting?.status ) {
                                                            case 'approved':
                                                                return <span style={ { color: 'green' } }>Approved</span>;
                                                            case 'denied':
                                                                return <span style={ { color: 'red' } }>Ditolak</span>;
                                                            default:
                                                                return null;
                                                        }
                                                    } )() }
                                                </p>
                                            </Col>
                                        </Row>
                                    </>
                                    <div>
                                        <Form>
                                            <Row>
                                                <Col xs={ 12 } md={ 12 } lg={ 12 } className="mb-3">
                                                    <Form.Group >
                                                        <Form.Label style={ formStyles.label } htmlFor='namaMeeting'>Nama Meeting</Form.Label>
                                                        <Form.Control
                                                            id='namaMeeting'
                                                            type="text"
                                                            value={ meeting?.nama_meeting || '' }
                                                            readOnly
                                                            style={ formStyles.input }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={ 12 } md={ 6 } lg={ 6 } className="mb-3">
                                                    <Form.Group >
                                                        <Form.Label style={ formStyles.label } htmlFor='requestBy'>Request by</Form.Label>
                                                        <Form.Control
                                                            id='requestBy'
                                                            type="text"
                                                            value={ filteredUserObject || '' }
                                                            readOnly
                                                            style={ formStyles.input }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={ 12 } md={ 6 } lg={ 6 } className="mb-3">
                                                    <Form.Group>
                                                        <Form.Label style={ formStyles.label } htmlFor='date'>Tanggal</Form.Label>
                                                        <Form.Control
                                                            id='date'
                                                            type="date"
                                                            value={ date || '' }
                                                            readOnly
                                                            style={ formStyles.input }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={ 6 } md={ 6 } lg={ 6 } className="mb-3">
                                                    <Form.Group >
                                                        <Form.Label style={ formStyles.label } htmlFor='startTime'>Waktu Mulai</Form.Label>
                                                        <Form.Control
                                                            id='startTime'
                                                            type="time"
                                                            value={ startTime || '' }
                                                            readOnly
                                                            style={ formStyles.input }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={ 6 } md={ 6 } lg={ 6 } className="mb-3">
                                                    <Form.Group >
                                                        <Form.Label style={ formStyles.label } htmlFor='endTime'>Waktu Selesai</Form.Label>
                                                        <Form.Control
                                                            id='endTime'
                                                            type="time"
                                                            value={ endTime || '' }
                                                            readOnly
                                                            style={ formStyles.input }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={ 12 } md={ 12 } lg={ 12 } className="mb-3">
                                                    { meeting?.status === 'processing' ? (
                                                        <>
                                                            <Form.Label style={ formStyles.label } htmlFor='pinCode'>Kode PIN</Form.Label>
                                                            <InputGroup>
                                                                <Form.Control
                                                                    id='pinCode'
                                                                    type="text"
                                                                    value={ meeting?.pincode || '' }
                                                                    readOnly
                                                                    style={ formStyles.input }
                                                                />
                                                                {
                                                                    !meeting?.pincode ?
                                                                        (
                                                                            <Button variant="primary" onClick={ handleShowAddPin } >
                                                                                <CiCirclePlus size={ 30 } />
                                                                            </Button>
                                                                        )
                                                                        :
                                                                        (

                                                                            <Button variant="success" onClick={ handleShowEditPin }>
                                                                                <CiEdit size={ 30 } />
                                                                            </Button>

                                                                        )
                                                                }
                                                            </InputGroup>
                                                        </>
                                                    )
                                                        :
                                                        (
                                                            <>
                                                                <Form.Label style={ formStyles.label } htmlFor='pinCode'>Kode PIN</Form.Label>
                                                                <InputGroup>
                                                                    <Form.Control
                                                                        id='pinCode'
                                                                        type="text"
                                                                        value={ meeting?.pincode || '' }
                                                                        readOnly
                                                                        style={ formStyles.input }
                                                                    />
                                                                </InputGroup>
                                                            </>
                                                        )
                                                    }

                                                </Col>
                                                <>
                                                    { meeting?.online === true ?
                                                        (
                                                            <Col xs={ 12 } md={ 12 } lg={ 12 } className="mb-3">
                                                                { meeting?.status === 'processing' ? (
                                                                    <>
                                                                        <Form.Label style={ formStyles.label } htmlFor='link'>Link Meeting</Form.Label>
                                                                        <InputGroup>
                                                                            <Form.Control
                                                                                id='link'
                                                                                as="textarea"
                                                                                rows={ 4 }
                                                                                type="text"
                                                                                value={ meeting?.link_meeting || '' }
                                                                                readOnly
                                                                                style={ formStyles.input }
                                                                            />
                                                                            {
                                                                                !meeting?.link_meeting ?
                                                                                    (
                                                                                        <Button variant="primary" onClick={ handleShowAddLink } >
                                                                                            <CiCirclePlus size={ 30 } />
                                                                                        </Button>
                                                                                    )
                                                                                    :
                                                                                    (

                                                                                        <Button variant="success" onClick={ handleShowEditLink }>
                                                                                            <CiEdit size={ 30 } />
                                                                                        </Button>

                                                                                    )
                                                                            }
                                                                        </InputGroup>
                                                                    </>
                                                                )
                                                                    : (
                                                                        <>
                                                                            <Form.Label style={ formStyles.label } htmlFor='link'>Link Meeting</Form.Label>
                                                                            <InputGroup>
                                                                                <Form.Control
                                                                                    id='link'
                                                                                    as="textarea"
                                                                                    rows={ 4 }
                                                                                    type="text"
                                                                                    value={ meeting?.link_meeting || '' }
                                                                                    readOnly
                                                                                    style={ formStyles.input }
                                                                                />
                                                                            </InputGroup>
                                                                        </>
                                                                    ) }

                                                            </Col>
                                                        )
                                                        :
                                                        (
                                                            <>

                                                            </>
                                                        )
                                                    }
                                                </>
                                            </Row>
                                        </Form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={ 12 } md={ 7 } lg={ 7 } className='my-2'>
                            <Card id={ theme === 'light' ? 'cardDetailRuanganDark' : 'cardDetailRuanganLight' }>
                                <Card.Body style={ { minHeight: '620px', maxHeight: isMobile ? 'none' : '620px' } }>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Detail Ruangan
                                    </p>
                                    <div>
                                        <Row>
                                            <Col xs={ 12 } md={ 6 } lg={ 6 }  >
                                                <p className='label'>Nama Gedung:</p>
                                                <p className='content mb-3'>{ detailRuangan?.gedung }</p>
                                                <p className='label'>Nama Ruangan:</p>
                                                <p className='content mb-3'>{ detailRuangan?.nama_ruangan }</p>
                                                <p className='label'>Nomor Ruangan:</p>
                                                <p className='content mb-3'>{ detailRuangan?.no_ruangan }</p>
                                            </Col>
                                            <Col xs={ 12 } md={ 6 } lg={ 6 } >
                                                <p className='label'>Lantai:</p>
                                                <p className='content mb-3'>{ detailRuangan?.lantai }</p>
                                                <p className='label'>Kapasitas Ruangan:</p>
                                                <p className='content mb-3'>{ detailRuangan?.kapasitas }</p>
                                            </Col>
                                            <Col xs={ 12 }  >
                                                <Table bordered responsive>
                                                    <thead>
                                                        <tr style={ { fontFamily: 'Poppins-Regular', textAlign: 'center' } }>
                                                            <th>#</th>
                                                            <th>Nama Equipment</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            detailEquipment.map( ( data, index ) =>
                                                            {

                                                                return (
                                                                    <tr key={ index } style={ { fontFamily: 'Poppins-Light' } }>
                                                                        <td style={ { textAlign: 'center' } }>{ index + 1 }</td>
                                                                        <td>{ data?.nama_equipment }</td>
                                                                    </tr>
                                                                )
                                                            } )
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={ 12 } md={ 12 } lg={ 12 } className='mt-2 mb-2'>
                            <Card id={ theme === 'light' ? 'cardDetailPesertaDark' : 'cardDetailPesertaLight' }>
                                <Card.Body>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Detail Peserta
                                    </p>
                                    <div>
                                        <Table bordered responsive>
                                            <thead>
                                                <tr style={ { fontFamily: 'Poppins-Regular', textAlign: 'center' } }>
                                                    <th>#</th>
                                                    <th>Nama Peserta</th>
                                                    <th>Status Kehadiran</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    dataPeserta.map( ( data, index ) =>
                                                    {

                                                        return (
                                                            <tr key={ index } style={ { fontFamily: 'Poppins-Light' } }>
                                                                <td style={ { textAlign: 'center' } }>{ index + 1 }</td>
                                                                <td>{ data?.user_name }</td>
                                                                <td style={ { textAlign: 'center' } }>
                                                                    { ( () =>
                                                                    {
                                                                        switch ( data?.hadir ) {
                                                                            case true:
                                                                                return <span>Hadir</span>;
                                                                            case null:
                                                                                return <span>Belum Konfirmasi</span>;
                                                                            default:
                                                                                return null;
                                                                        }
                                                                    } )() }
                                                                </td>
                                                            </tr>
                                                        )
                                                    } )
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                </div>
            </Container>
            <ModalTambahPin
                showAddPin={ showAddPin }
                setShowAddPin={ setShowAddPin }
                meetingid={ meetingid }
                retrieveDetailMeeting={ retrieveDetailMeeting }
                tokenUser={ tokenUser }
            />
            <ModalEditPin
                showEditPin={ showEditPin }
                setShowEditPin={ setShowEditPin }
                meeting={ meeting }
                meetingid={ meetingid }
                retrieveDetailMeeting={ retrieveDetailMeeting }
                tokenUser={ tokenUser }
            />
            <ModalTambahLink
                showAddLink={ showAddLink }
                setShowAddLink={ setShowAddLink }
                meetingid={ meetingid }
                retrieveDetailMeeting={ retrieveDetailMeeting }
                tokenUser={ tokenUser }
            />
            <ModalEditLink
                showEditLink={ showEditLink }
                setShowEditLink={ setShowEditLink }
                meeting={ meeting }
                meetingid={ meetingid }
                retrieveDetailMeeting={ retrieveDetailMeeting }
                tokenUser={ tokenUser }
            />
        </div>
    )
}

export default MeetingDetail;


const formStyles = {
    label: {
        fontFamily: 'Poppins-Medium',

    },
    input: {

        fontFamily: 'Poppins-Regular',
        minHeight: '50px',
        borderColor: '#ced4da', // Initial border color
    },
    button: {
        height: '50px',
    },
};
