import React, { useContext } from 'react';
import { CiBellOn, CiLogout, CiUser } from 'react-icons/ci';
import { AuthContext, ThemeContext } from '../../auth';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../api/axios';

function Header ()
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
            <span className="container-logout" style={ { fontFamily: 'Poppins-Regular' } }>
                <CiBellOn size={ 30 } className='me-5' />
                { userInfo?.first_name } { userInfo?.last_name }
                <Dropdown className='ms-2'>
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

export default Header
