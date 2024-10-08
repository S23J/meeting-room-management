import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { AuthContext, ThemeContext } from '../../auth';
import { useNavigate, useParams } from 'react-router-dom';
import
    {
        ModalAddAkun,
        ModalAddPerlengkapan,
        ModalEditAkun,
        ModalEditPerlengkapan,
        ModalEditPin,
        ModalSetupUUID,
        ModalTambahPin,
        SidebarComponent
    } from '../../components';
import { Button, Card, Col, Container, Dropdown, Row, Spinner, Table } from 'react-bootstrap';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { BsFillPencilFill, BsGearFill } from 'react-icons/bs';
import { FaWindowClose } from 'react-icons/fa';

function RuanganDetail ()
{
    const { ruangid } = useParams();
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { showSidebar, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const [ showAddAlat, setShowAddAlat ] = useState( false );
    const handleShowAddAlat = () =>
    {
        setShowAddAlat( true );
    };
    const [ showAddAkun, setShowAddAkun ] = useState( false );
    const handleShowAddAkun = () =>
    {
        setShowAddAkun( true );
    };
    const [ rowSelected, setRowSelected ] = useState();
    const [ showEditAlat, setShowEditAlat ] = useState( false );
    const handleShowEditAlat = ( data ) =>
    {
        setShowEditAlat( true );
        setRowSelected( data )
    };
    const [ showEditAkun, setShowEditAkun ] = useState( false );
    const handleShowEditAkun = ( data ) =>
    {
        setShowEditAkun( true );
        setRowSelected( data )
    };

    const tokenUser = tokens?.token;
    const navigate = useNavigate();

    const buttonBack = () =>
    {
        navigate( -1 )
    }

    const [ detailRuangan, setDetailRuangan ] = useState( {} );
    const [ detailEquipment, setDetailEquipment ] = useState( [] );
    const [ listMeeting, setListMeeting ] = useState( [] );
    const [ listAkun, setListAkun ] = useState( [] );
    const [ listUser, setListUser ] = useState( [] );
    const [ showAddPin, setShowAddPin ] = useState( false );
    const [ showEditPin, setShowEditPin ] = useState( false );
    const [ showAddUUID, setShowAddUUID ] = useState( false );
    const [ loading, setLoading ] = useState( true );

    const handleShowAddPin = () =>
    {
        setShowAddPin( true );
    }
    const handleShowEditPin = () =>
    {
        setShowEditPin( true );
    }
    const handleShowAddUUID = () =>
    {
        setShowAddUUID( true );
    }

    const retrieveMeeting = () =>
    {
        setLoading( true );
        axios.get( `/manage/requests/`,
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

                const filterData = res.data.filter( item => item.status === "approved" && item.finished === false && item.ruangan == ruangid );
                setListMeeting( filterData );
                setLoading( false ); 

            } ).catch( err =>
            {
                setLoading( false ); 
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

                } else ( console.error( err ) )
            } )
    };

    const retrieveAkun = () =>
    {
        setLoading( true );
        axios.get( `/manage/omplatform/filter_by_ruangan/?ruangan_id=${ruangid}`,
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

                setListAkun( res.data );
                setLoading( false ); 

            } ).catch( err =>
            {
                setLoading( false ); 
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

                } else ( console.error( err ) )
            } )
    };

    const retrieveUser = () =>
    {
        setLoading( true );
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
                setLoading( false ); 

            } ).catch( err =>
            {
                setLoading( false ); 
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

                } else ( console.error( err ) )
            } )
    };


    useEffect( () =>
    {
        if ( tokenUser !== undefined ) retrieveMeeting()
        if ( tokenUser !== undefined ) retrieveAkun()
        if ( tokenUser !== undefined ) retrieveUser()
    }, [ tokenUser ] );

    const [ dataTable, setDataTable ] = useState( [] );

    useEffect( () =>
    {
        const dataTableFilter = listMeeting.map( ( { ...rest } ) => rest );

        setDataTable(
            dataTableFilter.map( ( data ) =>
            {
                const user = listUser.find( ( user ) => user.id === data.user );
                const userName = user ? user.first_name + ' ' + user.last_name : '';

                return {
                    ...data,
                    user_name: userName,
                };
            } )
        );
    }, [ listMeeting, listUser ] );

    useEffect( () =>
    {
        const fetchData = async () =>
        {
            if ( ruangid !== undefined && tokenUser !== undefined ) {

                await retrieveDetailRuangan();
                await retrieveDetailEquipment();
            }
        };

        fetchData();
    }, [ ruangid, tokenUser ] );

    const retrieveDetailRuangan = () =>
    {
        setLoading( true );
        axios.get( `/manage/ruangan/${ruangid}/`,
            {
                headers:
                {
                    withCredentials: true,
                    Authorization: `Token ` + tokenUser,
                },

            } )
            .then( res =>
            {
                setDetailRuangan( res.data );
                setLoading( false ); 

            } ).catch( err =>
            {
                setLoading( false ); 
                if ( err.response?.status === 401 ) {
                    Swal.fire( {
                        icon: 'error',
                        title: 'Sesi telah habis',
                        text: 'Sesi anda telah berakhir. Silahkan login kembali.',
                        confirmButtonText: 'Log In',
                    } ).then( ( result ) =>
                    {
                        if ( result.isConfirmed ) {

                            navigate( '/' );
                        }
                    } );

                } else ( console.error( err ) )
            } )
    };

    const retrieveDetailEquipment = () =>
    {
        setLoading( true );
        axios.get( `/manage/equipment/filter_by_ruangan/?ruangan_id=${ruangid}`,
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
                setLoading( false ); 
            } ).catch( err =>
            {
                setLoading( false ); 
                if ( err.response?.status === 401 ) {
                    Swal.fire( {
                        icon: 'error',
                        title: 'Sesi telah habis',
                        text: 'Sesi anda telah berakhir. Silahkan login kembali.',
                        confirmButtonText: 'Log In',
                    } ).then( ( result ) =>
                    {
                        if ( result.isConfirmed ) {

                            navigate( '/' );
                        }
                    } );

                } else ( console.error( err ) )
            } )
    };

    const handleDelete = async ( dataId ) =>
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

                const responseDelete = await axios.delete( `/manage/equipment/${dataId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                } );
                Swal.fire( 'Terhapus!', 'Peralatan berhasil dihapus', 'success' );
                retrieveDetailEquipment();
            } catch ( err ) {
                console.error( err );
                Swal.fire( 'Error', 'Terjadi kesalahan saat menghapus!', 'error' );

            }
        } else {

            Swal.fire( 'Dibatalkan', 'Data kamu tidak terhapus', 'info' );
        }
    };

    const handleDeleteAkun = async ( dataId ) =>
    {

        const result = await Swal.fire( {
            title: 'Apakah anda yakin ingin menghapus akun ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus akun ini!',
            cancelButtonText: 'Batalkan',
        } );

        if ( result.isConfirmed ) {
            try {

                const responseDelete = await axios.delete( `/manage/omplatform/${dataId}/`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ` + tokenUser,
                    },
                } );
                Swal.fire( 'Terhapus!', 'Akun berhasil dihapus', 'success' );
                retrieveAkun();
            } catch ( err ) {
                console.error( err )
                Swal.fire( 'Error', 'Terjadi kesalahan saat menghapus!', 'error' );

            }
        } else {

            Swal.fire( 'Dibatalkan', 'Data kamu tidak terhapus', 'info' );
        }
    };


    useEffect( () =>
    {
        const handleToken = ( event ) =>
        {
            if ( event.data && event.data.accessToken ) {
                const accessToken = event.data.accessToken;
                window.sessionStorage.setItem( "refresh_token", JSON.stringify( accessToken ) );
            }
        };

        window.addEventListener( 'message', handleToken );

        return () =>
        {
            window.removeEventListener( 'message', handleToken );
        };
    }, [] );

    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div className='pt-4'>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '93vw' : '83vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='' style={ { fontFamily: 'Poppins-Medium', fontSize: '38px', color: theme === 'light' ? '#FFFFFF' : '', marginBottom: '0px' } }>
                                Informasi Ruangan
                            </h3>
                        </Col>
                        <Col xs={ 6 } lg={ 6 } className={ isMobile === false ? 'text-end my-auto' : 'my-auto' }>
                            <div className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '93vw' : '83vw' } }>
                                <Button variant='btn' id={ theme === 'light' ? 'actionButtonKembaliDark' : 'actionButtonKembaliLight' } onClick={ buttonBack }>Kembali</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91vw' : '82vw' } }>
                    <Row>
                        <Col xs={ 12 } md={ 5 } lg={ 5 } className='mb-3'>
                            <Card id={ theme === 'light' ? 'cardDetailRuanganDark' : 'cardDetailRuanganLight' }>
                                <Card.Body>
                                    <Row>
                                        <Col xs={ 12 } className='text-end'>
                                            <Dropdown drop='start'>
                                                <Dropdown.Toggle variant="btn" data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                                                    <BsGearFill size={ 25 } color={ theme === 'light' ? '#FFF471' : '#006CB8' } />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu id={ theme === 'light' ? 'dropdownMenuDark' : 'dropdownMenuLight' }>
                                                    {
                                                        !detailRuangan?.pincode ?
                                                            <>
                                                                <Dropdown.Item
                                                                    className='my-2'
                                                                    id={ theme === 'light' ? 'dropdownItem1Dark' : 'dropdownItem1Light' }
                                                                    onClick={ handleShowAddPin }
                                                                    style={ { color: theme === 'light' ? '#FFFFFF' : '#222', fontFamily: 'Poppins-Regular' } }
                                                                >
                                                                    Tambah PIN Ruangan
                                                                </Dropdown.Item>
                                                            </>
                                                            :
                                                            <>
                                                                <Dropdown.Item
                                                                    className='my-2'
                                                                    id={ theme === 'light' ? 'dropdownItem1Dark' : 'dropdownItem1Light' }
                                                                    onClick={ handleShowEditPin }
                                                                    style={ { color: theme === 'light' ? '#FFFFFF' : '#222', fontFamily: 'Poppins-Regular' } }
                                                                >
                                                                    PIN Ruangan
                                                                </Dropdown.Item>
                                                            </>
                                                    }
                                                    <Dropdown.Item
                                                        className='my-2'
                                                        id={ theme === 'light' ? 'dropdownItem2Dark' : 'dropdownItem2Light' }
                                                        onClick={ handleShowAddAkun }
                                                        style={ { color: theme === 'light' ? '#FFFFFF' : '#222', fontFamily: 'Poppins-Regular' } }
                                                    >
                                                        Tambah Akun Ruangan
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        className='my-2'
                                                        id={ theme === 'light' ? 'dropdownItem4Dark' : 'dropdownItem4Light' }
                                                        onClick={ handleShowAddUUID }
                                                        style={ { color: theme === 'light' ? '#FFFFFF' : '#222', fontFamily: 'Poppins-Regular' } }
                                                    >
                                                        Tambah UUID Ruangan
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Col>
                                    </Row>
                                    { loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={ { height: '200px' } }>
                                            <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                        </div>
                                    ) : (
                                        <div>
                                            <Row>
                                                <Col xs={ 12 } md={ 6 } lg={ 6 } >
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
                                                    <p className='content mb-3'>{ detailRuangan?.kapasitas } orang</p>
                                                    </Col>
                                                </Row>
                                            </div>
                                    ) }
                                    <hr style={ { marginBottom: '0px', marginTop: '0px' } } />
                                    <div className='mt-3'>
                                        <p
                                            className='head-content text-center'
                                        >
                                            Info Akun
                                        </p>
                                        { loading ? (
                                            <div className="d-flex justify-content-center align-items-center" style={ { height: '200px' } }>
                                                <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                            </div>
                                        ) : (
                                            <div>
                                                <Table bordered responsive data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                                                    <thead>
                                                        <tr style={ { fontFamily: 'Poppins-Regular', textAlign: 'center' } }>
                                                            <th>#</th>
                                                            <th>Akun</th>
                                                            <th>Platform</th>
                                                            <th>Ubah</th>
                                                            <th>Hapus</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            listAkun.map( ( data, index ) =>
                                                            {

                                                                return (
                                                                    <tr key={ index } style={ { fontFamily: 'Poppins-Light' } }>
                                                                        <td style={ { textAlign: 'center' } }>{ index + 1 }</td>
                                                                        <td>{ data?.account }</td>
                                                                        <td style={ { textAlign: 'center' } }>
                                                                            { data?.platform }
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            <Button
                                                                                variant='btn'
                                                                                onClick={ () => handleShowEditAkun( data ) }
                                                                            >
                                                                                <BsFillPencilFill size={ 20 } color={ theme === 'light' ? '#FFF471' : '#006CB8' } />
                                                                            </Button>
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            <Button
                                                                                variant='btn'
                                                                                onClick={ () => handleDeleteAkun( data.id ) }
                                                                            >
                                                                                <FaWindowClose size={ 20 } color='#FF0060' />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            } )
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>
                                        ) }
                                    </div>
                                    <hr style={ { marginBottom: '0px', marginTop: '0px' } } />
                                    <div className='mt-3'>
                                        <Row className='mb-3'>
                                            <Col className='text-start my-auto'>
                                                <p
                                                    className='head-content'
                                                >
                                                    Info Perlengkapan
                                                </p>
                                            </Col>
                                            <Col className='text-end'>
                                                <Button
                                                    id={ theme === 'light' ? 'buttonTambahTableDark' : 'buttonTambahTableLight' }
                                                    variant="btn"
                                                    onClick={ handleShowAddAlat }
                                                >
                                                    Tambah
                                                </Button>
                                            </Col>
                                        </Row>
                                        { loading ? (
                                            <div className="d-flex justify-content-center align-items-center" style={ { height: '200px' } }>
                                                <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                            </div>
                                        ) : (
                                            <div>
                                                <Table bordered responsive data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                                                    <thead>
                                                        <tr style={ { fontFamily: 'Poppins-Regular', textAlign: 'center' } }>
                                                            <th>#</th>
                                                            <th>Nama Equipment</th>
                                                            <th>Ubah</th>
                                                            <th>Hapus</th>
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
                                                                        <td className='text-center'>
                                                                            <Button
                                                                                variant='btn'
                                                                                onClick={ () => handleShowEditAlat( data ) }
                                                                            >
                                                                                <BsFillPencilFill size={ 20 } color={ theme === 'light' ? '#FFF471' : '#006CB8' } />
                                                                            </Button>
                                                                        </td>
                                                                        <td className='text-center'>
                                                                            <Button
                                                                                variant='btn'
                                                                                onClick={ () => handleDelete( data.id ) }
                                                                            >
                                                                                <FaWindowClose size={ 20 } color='#FF0060' />
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            } )
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </div>
                                        ) }
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={ 12 } md={ 7 } lg={ 7 } className='mb-3'>
                            <Card id={ theme === 'light' ? 'cardDetailEquipmentDark' : 'cardDetailEquipmentLight' }>
                                <Card.Body>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Meeting Yang Akan Datang
                                    </p>
                                    { loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={ { height: '200px' } }>
                                            <Spinner animation='border' style={ { color: theme === 'light' ? '#FFF471' : '#006CB8' } } />
                                        </div>
                                    ) : (
                                            <div>
                                                <Table bordered responsive data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                                                    <thead>
                                                        <tr style={ { fontFamily: 'Poppins-Regular', textAlign: 'center' } }>
                                                            <th>#</th>
                                                            <th>Nama Meeting</th>
                                                            <th>Permintaan dari</th>
                                                            <th>Tanggal</th>
                                                            <th>Mulai</th>
                                                            <th>Selesai</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            dataTable.map( ( data, index ) =>
                                                            {

                                                                const dateTime = new Date( data?.waktu_mulai );
                                                                const formattedDate = dateTime.toLocaleDateString( 'en-GB', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                } );

                                                                return (
                                                                    <tr key={ index } style={ { fontFamily: 'Poppins-Light' } }>
                                                                        <td style={ { textAlign: 'center' } }>{ index + 1 }</td>
                                                                        <td style={ { textAlign: 'center' } }>{ data?.nama_meeting }</td>
                                                                        <td style={ { textAlign: 'center' } }>{ data?.user_name }</td>
                                                                        <td style={ { textAlign: 'center' } }>{ formattedDate }</td>
                                                                        <td style={ { textAlign: 'center' } }>{ data.waktu_mulai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }</td>
                                                                        <td style={ { textAlign: 'center' } }>{ data.waktu_selesai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }</td>
                                                                    </tr>
                                                                )
                                                            } )
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                    ) }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
            </Container>
            <ModalAddPerlengkapan
                showAddAlat={ showAddAlat }
                setShowAddAlat={ setShowAddAlat }
                ruangid={ ruangid }
                retrieveDetailEquipment={ retrieveDetailEquipment }
                tokenUser={ tokenUser }
            />
            <ModalEditPerlengkapan
                showEditAlat={ showEditAlat }
                setShowEditAlat={ setShowEditAlat }
                rowSelected={ rowSelected }
                ruangid={ ruangid }
                retrieveDetailEquipment={ retrieveDetailEquipment }
                tokenUser={ tokenUser }
            />
            <ModalAddAkun
                showAddAkun={ showAddAkun }
                setShowAddAkun={ setShowAddAkun }
                ruangid={ ruangid }
                retrieveAkun={ retrieveAkun }
                tokenUser={ tokenUser }
            />
            <ModalEditAkun
                showEditAkun={ showEditAkun }
                setShowEditAkun={ setShowEditAkun }
                rowSelected={ rowSelected }
                retrieveAkun={ retrieveAkun }
                tokenUser={ tokenUser }
            />
            <ModalTambahPin
                showAddPin={ showAddPin }
                setShowAddPin={ setShowAddPin }
                ruangid={ ruangid }
                retrieveDetailRuangan={ retrieveDetailRuangan }
                tokenUser={ tokenUser }
            />
            <ModalEditPin
                showEditPin={ showEditPin }
                setShowEditPin={ setShowEditPin }
                detailRuangan={ detailRuangan }
                ruangid={ ruangid }
                retrieveDetailRuangan={ retrieveDetailRuangan }
                tokenUser={ tokenUser }
            />
            <ModalSetupUUID
                showAddUUID={ showAddUUID }
                setShowAddUUID={ setShowAddUUID }
                ruangid={ ruangid }
                retrieveDetailRuangan={ retrieveDetailRuangan }
                tokenUser={ tokenUser }
            />
        </div>
    )
}

export default RuanganDetail
