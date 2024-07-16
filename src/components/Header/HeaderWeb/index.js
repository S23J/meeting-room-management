import React, { useContext, useEffect, useState } from 'react';
import { CiBellOn, CiLogout, CiUser } from 'react-icons/ci';
import { Badge, Dropdown, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext, ThemeContext } from '../../../auth';
import axios from '../../../api/axios';



function HeaderWeb ()
{
    const { userInfo, tokens, setTokens, setUserInfo } = useContext( AuthContext );
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
                // console.log( err )
            } );
    };


    useEffect( () =>
    {
        const interval = setInterval( () =>
        {
            if ( tokenUser !== undefined ) retrieveMeeting();
        }, 60000 ); // Interval set to 60 seconds
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
            title: 'Apakah anda yakin ingin keluar?',
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
                title: 'Logout Berhasil',
                showConfirmButton: false,
                timer: 2000,
            } );
            navigate( '/' );
        } catch ( error ) {
            // console.log( error );
            Swal.fire( {
                icon: 'error',
                title: 'Warning!',
                text: 'Logout gagal!',
            } );
        }
    };

    return (
        <>
            <span className="container-logout-web" style={ { fontFamily: 'Poppins-Regular' } }>
                <div >
                    <CiBellOn size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } style={ { borderRadius: '70px', fontFamily: 'Poppins-Regular', position: 'absolute', right: '210px', top: '20px' } } />
                    {
                        meetingList?.length === 0 ? (
                            <></>
                        ) : (
                            <Badge style={ { fontFamily: 'Poppins-Regular', position: 'absolute', right: '200px', top: '10px' } }>{ meetingList?.length }</Badge>
                        )
                    }
                </div>
                <span style={ { color: theme === 'light' ? '#FFFFFF' : '' } }>
                    { userInfo?.first_name } { userInfo?.last_name }
                </span>
                <Dropdown className='ms-2'>
                    <Dropdown.Toggle variant="btn" >
                        <CiUser size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
                    </Dropdown.Toggle>
                    <Dropdown.Menu id={ theme === 'light' ? 'dropdownMenuDark' : 'dropdownMenuLight' }>
                        <Dropdown.Item
                            id={ theme === 'light' ? 'dropdownItem1Dark' : 'dropdownItem1Light' }
                            className="d-flex align-items-center justify-content-center my-3"
                            onClick={ LogoutSession }
                        >
                            <CiLogout size={ 25 } className='me-2' color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
                            <span style={ { fontFamily: 'Poppins-Light', color: theme === 'light' ? '#FFFFFF' : '#707070' } }>Keluar</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </span>

        </>
    )
}

export default HeaderWeb
