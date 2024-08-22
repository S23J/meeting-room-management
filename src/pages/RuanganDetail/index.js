import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive';
import { AuthContext, ThemeContext } from '../../auth';
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderDetailPage, HeaderMobile2, ModalAddAkun, ModalAddPerlengkapan, ModalEditAkun, ModalEditPerlengkapan, SidebarComponent } from '../../components';
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { CiEdit, CiTrash } from 'react-icons/ci';

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

    const retrieveMeeting = () =>
    {
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
                // console.log( res.data )
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
    };

    const retrieveAkun = () =>
    {
        axios.get( `/manage/omplatform/`,
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
    };

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

            } ).catch( err =>
            {
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

                } else ( console.log( err ) )
            } )
    };

    const retrieveDetailEquipment = () =>
    {
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

            } ).catch( err =>
            {
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

                } else ( console.log( err ) )
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
                console.log( err );
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
                console.log( err );
                Swal.fire( 'Error', 'Terjadi kesalahan saat menghapus!', 'error' );

            }
        } else {

            Swal.fire( 'Dibatalkan', 'Data kamu tidak terhapus', 'info' );
        }
    };

    return (
        <div style={ { overflowX: 'hidden', maxWidth: '100vw' } }>
            <SidebarComponent />
            <Container fluid id={ theme === 'light' ? 'containerAppDark' : 'containerAppLight' } style={ { marginLeft: isMobile ? '0px' : showSidebar ? '80px' : '210px' } }>
                <div>
                    <Row style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91vw' : '82vw' } }>
                        <Col xs={ 6 } lg={ 6 } className='text-start'>
                            <h3 className='pt-4' style={ { fontFamily: 'Poppins-Regular', color: theme === 'light' ? '#FFFFFF' : '' } }>
                                Detail Ruangan
                            </h3>
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
                <hr className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91vw' : '82vw', border: '1px solid', borderColor: theme === 'light' ? '#FFFFFF' : '#000A2E', marginTop: '5px' } } />
                <div className='text-end' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91vw' : '82vw' } }>
                    <Button variant='btn' id={ theme === 'light' ? 'actionButtonKembaliDark' : 'actionButtonKembaliLight' } onClick={ buttonBack }>Kembali</Button>
                </div>
                <div className='pt-4' style={ { maxWidth: isMobile ? '95vw' : showSidebar ? '91vw' : '82vw' } }>
                    <Row>
                        <Col xs={ 12 } md={ 5 } lg={ 5 } className='mb-3'>
                            <Card id={ theme === 'light' ? 'cardDetailRuanganDark' : 'cardDetailRuanganLight' }>
                                <Card.Body>
                                    <p
                                        className='head-content text-center'
                                    >
                                        Detail Ruangan
                                    </p>
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
                                                <p className='content mb-3'>{ detailRuangan?.kapasitas }</p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <hr style={ { marginBottom: '0px', marginTop: '0px' } } />
                                    <div className='mt-3'>
                                        <Row className='mb-3'>
                                            <Col className='text-start my-auto'>
                                                <p
                                                    className='head-content'
                                                >
                                                    Detail Akun
                                                </p>
                                            </Col>
                                            <Col className='text-end'>
                                                <Button
                                                    id={ theme === 'light' ? 'buttonTambahTableDark' : 'buttonTambahTableLight' }
                                                    variant="btn"
                                                    onClick={ handleShowAddAkun }
                                                >
                                                    Tambah
                                                </Button>
                                            </Col>
                                        </Row>
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
                                                                    <td>
                                                                        { data?.platform }
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        <Button
                                                                            variant='btn'
                                                                            id={ theme === 'light' ? 'buttonEditTableDarkEquip' : 'buttonEditTableLightEquip' }
                                                                            onClick={ () => handleShowEditAkun( data ) }
                                                                        >
                                                                            <CiEdit size={ 25 } />
                                                                        </Button>
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        <Button
                                                                            variant='btn'
                                                                            id={ theme === 'light' ? 'buttonDeleteTableDarkEquip' : 'buttonDeleteTableLightEquip' }
                                                                            onClick={ () => handleDeleteAkun( data.id ) }
                                                                        >
                                                                            <CiTrash size={ 25 } />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        } )
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                    <hr style={ { marginBottom: '0px', marginTop: '0px' } } />
                                    <div className='mt-3'>
                                        <Row className='mb-3'>
                                            <Col className='text-start my-auto'>
                                                <p
                                                    className='head-content'
                                                >
                                                    Detail Perlengkapan
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
                                                                            id={ theme === 'light' ? 'buttonEditTableDarkEquip' : 'buttonEditTableLightEquip' }
                                                                            onClick={ () => handleShowEditAlat( data ) }
                                                                        >
                                                                            <CiEdit size={ 25 } />
                                                                        </Button>
                                                                    </td>
                                                                    <td className='text-center'>
                                                                        <Button
                                                                            variant='btn'
                                                                            id={ theme === 'light' ? 'buttonDeleteTableDarkEquip' : 'buttonDeleteTableLightEquip' }
                                                                            onClick={ () => handleDelete( data.id ) }
                                                                        >
                                                                            <CiTrash size={ 25 } />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        } )
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
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
                                        Upcoming Meeting
                                    </p>
                                    <div>
                                        <Table bordered responsive data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                                            <thead>
                                                <tr style={ { fontFamily: 'Poppins-Regular', textAlign: 'center' } }>
                                                    <th>#</th>
                                                    <th>Nama Meeting</th>
                                                    <th>Request by</th>
                                                    <th>Tanggal</th>
                                                    <th>Waktu Mulai</th>
                                                    <th>Waktu Selesai</th>
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
                                                                <td>{ data?.nama_meeting }</td>
                                                                <td>{ data?.user_name }</td>
                                                                <td>{ formattedDate }</td>
                                                                <td style={ { textAlign: 'center' } }>{ data.waktu_mulai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }</td>
                                                                <td style={ { textAlign: 'center' } }>{ data.waktu_selesai.split( 'T' )[ 1 ].split( 'Z' )[ 0 ].slice( 0, 5 ) }</td>
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
                ruangid={ ruangid }
                retrieveAkun={ retrieveAkun }
                tokenUser={ tokenUser }
            />
        </div>
    )
}

export default RuanganDetail
