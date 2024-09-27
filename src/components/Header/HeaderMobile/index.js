import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, ThemeContext } from '../../../auth';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../../api/axios';
import { Badge, Button, Dropdown } from 'react-bootstrap';
import { CiBellOn, CiLogout, CiUser } from 'react-icons/ci';

function HeaderMobile ()
{
    const { userInfo, tokens, setTokens, setUserInfo } = useContext( AuthContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const { theme } = useContext( ThemeContext );
    const tokenUser = tokens?.token;
    const [ meetingList, setMeetingList ] = useState( [] );
    const [ previousFilteredData, setPreviousFilteredData ] = useState( [] );
    const navigate = useNavigate();


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

                const filterData = res.data.filter( item => item.status === "processing" );
                setMeetingList( filterData );

            } ).catch( err =>
            {
                console.error( err )
            } );
    };


    useEffect( () =>
    {
        retrieveMeeting();
        const interval = setInterval( retrieveMeeting, 60000 );
        return () => clearInterval( interval );
    }, [] );


    useEffect( () =>
    {
        if ( tokenUser !== undefined ) retrieveMeeting()
    }, [ tokenUser ] );


    useEffect( () =>
    {

        if ( JSON.stringify( meetingList ) !== JSON.stringify( previousFilteredData ) ) {

            Swal.fire( {
                icon: 'info',
                title: 'Ada request masuk!',
                showConfirmButton: true,
            } ).then( ( result ) =>
            {
                if ( result.isConfirmed ) {
                    setPreviousFilteredData( meetingList.slice() );
                }
            } );
        }
    }, [ meetingList, previousFilteredData ] );

    const LogoutSession = async () =>
    {
        const confirmDelete = await Swal.fire( {
            title: 'Apakah anda yakin ingin keluar dari aplikasi?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Keluar',
            cancelButtonText: 'Batal',
        } );

        if ( !confirmDelete.isConfirmed ) {

            return;
        }
        try {
            await axios.post(
                '/auth/logout/',
                {},
                {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        withCredentials: true,
                        Authorization: `Token ${tokens.token}`,
                    },
                }
            );

            sessionStorage.removeItem( 'userInfo' );
            sessionStorage.removeItem( 'token' );
            setTokens();
            setUserInfo();
            Swal.fire( {
                icon: 'success',
                title: 'Proses keluar berhasil!',
                showConfirmButton: false,
                timer: 2000,
            } );
            navigate( '/' );
        } catch ( error ) {
            console.error( error )
            Swal.fire( {
                icon: 'error',
                title: 'Warning!',
                text: 'Proses keluar gagal!',
            } );
        }
    };

    return (
        <>
            <span className="container-logout-mobile" style={ { fontFamily: 'Poppins-Regular' } }>
                <span style={ { color: theme === 'light' ? '#FFFFFF' : '' } }>
                    { userInfo?.first_name } { userInfo?.last_name }
                </span>
                <Dropdown >
                    <Dropdown.Toggle variant="btn" data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                        <CiUser size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
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
            </span>
        </>
    )
}

export default HeaderMobile
