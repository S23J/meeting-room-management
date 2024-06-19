import React, { useContext } from 'react'
import { Container, Form, Image, Nav, Navbar, Offcanvas, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { LogoFlashklikMrm } from '../../assets'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from '@mdi/react'
import { mdiAccountCircle, mdiCalendarClock, mdiLogout, mdiOfficeBuildingCog, mdiViewDashboard, mdiWeatherNight } from '@mdi/js'
import { AuthContext, ThemeContext } from '../../auth'
import { useMediaQuery } from 'react-responsive'
import Swal from 'sweetalert2'
import axios from '../../api/axios'

function SidebarComponent ()
{

    const { userInfo, tokens, setTokens, setUserInfo } = useContext( AuthContext );
    const { theme, setTheme } = useContext( ThemeContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const location = useLocation();

    const menuItemClass = theme === 'light' ? 'menu-item-dark' : 'menu-item-light';

    const activeClassDashboard =
        location.pathname === '/dashboard/'
            ? theme === 'light'
                ? 'active-menu-item-dark'
                : 'active-menu-item-light'
            : '';

    const activeClassRuangan =
        location.pathname === '/ruangan/'
            ? theme === 'light'
                ? 'active-menu-item-dark'
                : 'active-menu-item-light'
            : '';


    const activeClassJadwal =
        location.pathname === '/jadwal/'
            ? theme === 'light'
                ? 'active-menu-item-dark'
                : 'active-menu-item-light'
            : '';


    const activeClassTest =
        location.pathname === '/test/'
            ? theme === 'light'
                ? 'active-menu-item-light'
                : 'active-menu-item-dark'
            : '';

    const text = userInfo?.first_name + " " + userInfo?.last_name;
    const limit = 11;
    const truncatedText = text.length > limit ? text.substring( 0, limit ) + '...' : text;

    const navigate = useNavigate();

    const handleToggle = () =>
    {
        setTheme( theme === 'light' ? 'dark' : 'light' );
        // console.log( theme );
    };

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

        <Navbar expand={ false } variant={ theme === 'light' ? 'light' : 'dark' } sticky="top" style={ { boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)', backgroundColor: theme === 'light' ? '#000A2E' : '#FFFFFF' } }>
            <Container fluid>
                <Navbar.Brand style={ { cursor: 'default' } }>
                    <Image
                        src={ LogoFlashklikMrm }
                        fluid
                        width={ 190 }
                    />
                </Navbar.Brand>
                <Navbar.Toggle style={ { backgroundColor: theme === 'light' ? '#FFFFFF' : '#000A2E' } } />
                <Navbar.Offcanvas
                    id='offCanvasNav'
                    placement="end"
                    data-bs-theme={ theme === 'light' ? 'dark' : 'light' }
                    style={ { maxWidth: isMobile ? '220px' : '250px', color: '#22222', backgroundColor: theme === 'light' ? '#070E25' : '#F0F0F0' } }
                >
                    <Offcanvas.Header closeButton style={ {
                        fontFamily: 'Poppins-Medium',
                        textDecoration: 'none',
                        color: theme === 'light' ? '#FFFFFF' : '#222222',
                        display: 'flex',
                        alignItems: 'center',
                    } }>
                        <Offcanvas.Title id={ `offcanvasNavbarLabel-expand-${false}` } style={ { fontSize: '17px' } }>
                            <OverlayTrigger
                                placement="bottom"
                                overlay={ <Tooltip id="tooltip">{ text }</Tooltip> }
                            >
                                <span className="truncated-text ms-3" style={ { paddingTop: '10px', color: theme === 'light' ? '#FFFFFF' : '#222222' } }>
                                    <Icon className='me-1' path={ mdiAccountCircle } size={ 1.5 } /> { truncatedText }
                                </span>
                            </OverlayTrigger>
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr style={ { marginTop: '0px' } } />
                    <Offcanvas.Body style={ { fontFamily: 'Poppins-Regular', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }>
                        <Nav className='mt-2'>
                            <NavLink
                                to='/dashboard/'
                                className={ `${menuItemClass} ${activeClassDashboard} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                } }
                            >

                                <Icon className='me-2' path={ mdiViewDashboard } size={ 1.3 } />
                                Dashboard
                            </NavLink>
                            <NavLink
                                to='/ruangan/'
                                className={ `${menuItemClass} ${activeClassRuangan} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                } }
                            >
                                <Icon className='me-2' path={ mdiOfficeBuildingCog } size={ 1.3 } />
                                Ruangan
                            </NavLink>
                            <NavLink
                                to='/jadwal/'
                                className={ `${menuItemClass} ${activeClassJadwal} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                } }
                            >
                                <Icon className='me-2' path={ mdiCalendarClock } size={ 1.3 } />
                                Jadwal
                            </NavLink>
                        </Nav>
                        <Nav className='mt-auto'>
                            <div
                                className={ `darkmode-button my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                } }
                            >
                                <Icon className='me-3' path={ mdiWeatherNight } size={ 1.3 } color={ theme === 'light' ? '#FFFFFF' : '#222222' } />
                                <Form.Check
                                    type='switch'
                                    className='custom-switch'
                                    checked={ theme === 'light' }
                                    onChange={ handleToggle }
                                />
                            </div>
                            <NavLink
                                className={ `${menuItemClass} ${activeClassTest} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                } }
                                onClick={ LogoutSession }
                            >
                                <Icon className='me-3' path={ mdiLogout } size={ 1.3 } />
                                Keluar
                            </NavLink>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}

export default SidebarComponent
