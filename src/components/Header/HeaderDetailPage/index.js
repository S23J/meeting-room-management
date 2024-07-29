import React, { useContext } from 'react';
import { CiLogout, CiUser } from 'react-icons/ci';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext, ThemeContext } from '../../../auth';
import axios from '../../../api/axios';



function HeaderDetailPage ()
{
    const { userInfo, tokens, setTokens, setUserInfo } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );
    const navigate = useNavigate();

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
                <span style={ { color: theme === 'light' ? '#FFFFFF' : '' } }>
                    { userInfo?.first_name } { userInfo?.last_name }
                </span>
                <Dropdown className='ms-2'>
                    <Dropdown.Toggle variant="btn" data-bs-theme={ theme === 'light' ? 'dark' : '' }>
                        <CiUser size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
                    </Dropdown.Toggle>
                    <Dropdown.Menu id={ theme === 'light' ? 'dropdownMenuDark' : 'dropdownMenuLight' }>
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

export default HeaderDetailPage
