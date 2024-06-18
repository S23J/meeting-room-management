import React, { useContext } from 'react'
import { Container, Form, Image, Nav, Navbar, Offcanvas, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { LogoFlashklikMrm } from '../../assets'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from '@mdi/react'
import { mdiAccountCircle, mdiCalendarClock, mdiLogout, mdiOfficeBuildingCog, mdiThemeLightDark, mdiViewDashboard } from '@mdi/js'
import { AuthContext } from '../../auth'
import { useMediaQuery } from 'react-responsive'
import Swal from 'sweetalert2'
import axios from '../../api/axios'

function SidebarComponent ()
{

    const { userInfo, tokens, setTokens, setUserInfo } = useContext( AuthContext );
    const isMobile = useMediaQuery( { maxWidth: 767 } );
    const location = useLocation();

    const activeClassDashboard =
        location.pathname === '/dashboard/'
            ? 'active-menu'
            : 'menu-item';

    const activeClassRuangan =
        location.pathname === '/ruangan/'
            ? 'active-menu'
            : 'menu-item';

    const activeClassJadwal =
        location.pathname === '/jadwal/'
            ? 'active-menu'
            : 'menu-item';

    const activeClassTest =
        location.pathname === '/test/'
            ? 'active-menu'
            : 'menu-item';

    // const text = "Agustian Purnama Sebastian";
    const text = userInfo?.first_name + " " + userInfo?.last_name;
    const limit = 11;
    const truncatedText = text.length > limit ? text.substring( 0, limit ) + '...' : text;

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

        <Navbar expand={ false } className="mb-3" sticky="top" style={ { backgroundColor: '#000A2E', minHeight: '70px' } }>
            <Container fluid>
                <Navbar.Brand style={ { cursor: 'default' } }>
                    <Image
                        src={ LogoFlashklikMrm }
                        fluid
                        width={ 200 }
                    />
                </Navbar.Brand>
                <Navbar.Toggle style={ { backgroundColor: 'white' } } />
                <Navbar.Offcanvas
                    id={ `offcanvasNavbar-expand-${false}` }
                    aria-labelledby={ `offcanvasNavbarLabel-expand-${false}` }
                    placement="end"
                    data-bs-theme="dark"
                    className='bg-dark'
                    style={ { maxWidth: isMobile ? '220px' : '300px', backgroundColor: '#1E1E1E', color: 'white' } }
                >
                    <Offcanvas.Header closeButton style={ {
                        fontFamily: 'Poppins-Medium',
                        textDecoration: 'none',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                    } }>
                        <Offcanvas.Title id={ `offcanvasNavbarLabel-expand-${false}` } style={ { fontSize: '17px' } }>
                            <OverlayTrigger
                                placement="bottom"
                                overlay={ <Tooltip id="tooltip">{ text }</Tooltip> }
                            >
                                <span className="truncated-text" style={ { paddingTop: '10px' } }>
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
                                className={ `${activeClassDashboard} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    color: 'white',
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
                                className={ `${activeClassRuangan} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    color: 'white',
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
                                className={ `${activeClassJadwal} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    color: 'white',
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
                                    color: 'white',
                                    fontSize: '18px',
                                    display: 'flex',
                                    alignItems: 'center'
                                } }
                            >
                                <Icon className='me-3' path={ mdiThemeLightDark } size={ 1.3 } />
                                <Form.Check
                                    type='switch'
                                    className='custom-switch'
                                // checked={ theme === 'dark' }
                                // onChange={ handleToggle }
                                />
                            </div>
                            <NavLink
                                className={ `${activeClassTest} my-2` }
                                style={ {
                                    textDecoration: 'none',
                                    color: 'white',
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
            {/* <NavLink className='my-2' onClick={ LogoutSession } style={ { textDecoration: 'none', color: 'white' } }>Keluar</NavLink> */ }
        </Navbar>
    )
}

export default SidebarComponent
