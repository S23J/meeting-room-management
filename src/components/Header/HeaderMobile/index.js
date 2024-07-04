import React, { useContext } from 'react'
import { AuthContext, ThemeContext } from '../../../auth';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../../api/axios';
import { Button, Dropdown } from 'react-bootstrap';
import { CiBellOn, CiLogout, CiUser } from 'react-icons/ci';

function HeaderMobile ()
{
    const { userInfo, tokens, setTokens, setUserInfo, toggleSidebar, mobileSidebar, setMobileSidebar, toggleMobileSidebar } = useContext( AuthContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
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
            <div className='text-end' style={ { minWidth: '185px' } }>
                <CiBellOn size={ 30 } />
            </div>
            <span className="container-logout-mobile" style={ { fontFamily: 'Poppins-Regular' } }>
                { userInfo?.first_name } { userInfo?.last_name }
                <Dropdown >
                    <Dropdown.Toggle variant="btn" >
                        <CiUser size={ 30 } />
                    </Dropdown.Toggle>
                    <Dropdown.Menu id='dropdownMenu'>
                        <Dropdown.Item
                            id={ theme === 'light' ? 'dropdownItem1LDark' : 'dropdownItem1DLight' }
                            className="d-flex align-items-center justify-content-center my-3"
                            onClick={ LogoutSession }
                        >
                            <CiLogout size={ 25 } className='me-2' />
                            <span style={ { fontFamily: 'Poppins-Light' } }>Keluar</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </span>
        </>
    )
}

export default HeaderMobile
