import React, { useContext } from 'react'
import { Container, Form, Image } from 'react-bootstrap'
import { LogoBundar, LogoFlashklikMrm } from '../../assets'
import { NavLink, useLocation } from 'react-router-dom'
import { AuthContext, ThemeContext } from '../../auth'
import { useMediaQuery } from 'react-responsive'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { CiCalendarDate, CiDark, CiGrid41, CiHome, CiLight, CiSquareChevLeft, CiSquareChevRight } from 'react-icons/ci'

function SidebarComponent ()
{

    const { showSidebar, mobileSidebar, toggleSidebar, toggleMobileSidebar } = useContext( AuthContext );
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


    const handleToggle = () =>
    {
        setTheme( theme === 'light' ? 'dark' : 'light' );
    };

    return (
        <>
            <Sidebar
                id={ theme === 'light' ? 'mySidebar-dark' : 'mySidebar-light' }
                backgroundColor='rgba(0, 0, 0, 0)'
                width='210px'
                collapsed={ showSidebar }
                defaultCollapsed={ true }
                onToggle={ toggleSidebar }
                style={ { display: 'flex', flexDirection: 'column', height: '100vh', border: 'none' } }
            >
                <Menu style={ { minHeight: '95%', overflowY: 'hidden' } }>
                    <Container id='sidebarHeader' className='mx-auto mt-4'>
                        <Image
                            className={ showSidebar ? 'collapsed' : 'expanded' }
                            src={ LogoFlashklikMrm }
                            fluid
                            width={ 300 }
                            style={ { position: showSidebar ? 'absolute' : 'relative' } }
                        />
                        <Image
                            className={ showSidebar ? 'expanded' : 'collapsed' }
                            src={ LogoBundar }
                            fluid
                            width={ 300 }
                            style={ { position: showSidebar ? 'relative' : 'absolute', top: 0, left: 0 } }
                        />
                    </Container>
                    <div style={ { minHeight: '15vh' } }></div>
                    <div className='icon-box-sidebar'
                        onClick={ toggleSidebar }
                        style={ { left: showSidebar ? '60px' : '190px', cursor: 'pointer' } }
                    >
                        {
                            showSidebar ?
                                <CiSquareChevRight size={ 35 } color='#707070' style={ { backgroundColor: 'white', borderRadius: '5px' } } />
                                :
                                <CiSquareChevLeft size={ 35 } color='#707070' style={ { backgroundColor: 'white', borderRadius: '5px' } } />
                        }
                    </div>
                    {
                        showSidebar ?
                            <>
                                <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassDashboard}` }
                                    component={ <NavLink to="/dashboard/" /> }
                                >
                                    <CiGrid41 size={ 25 } />
                                </MenuItem>
                                <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassRuangan}` }
                                    component={ <NavLink to="/ruangan/" /> }
                                >
                                    <CiHome size={ 25 } />
                                </MenuItem>
                                <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassJadwal}` }
                                    component={ <NavLink to="/jadwal/" /> }
                                >
                                    <CiCalendarDate size={ 25 } />
                                </MenuItem>
                            </>

                            :
                            <>
                                <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassDashboard}` }
                                    component={ <NavLink to="/dashboard/" /> }
                                    icon={ <CiGrid41 size={ 25 } /> }
                                    style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                                >
                                    Dashboard
                                </MenuItem>
                                <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassRuangan}` }
                                    component={ <NavLink to="/ruangan/" /> }
                                    icon={ <CiHome size={ 25 } /> }
                                    style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                                >
                                    Ruangan
                                </MenuItem>
                                <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassJadwal}` }
                                    component={ <NavLink to="/jadwal/" /> }
                                    icon={ <CiCalendarDate size={ 25 } /> }
                                    style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                                >
                                    Jadwal
                                </MenuItem>
                            </>

                    }

                </Menu>
                <div className='mt-auto text-center' style={ { fontFamily: 'Poppins-Medium', fontSize: '13px' } }>
                    <span className="theme-toggle-container">
                        <CiLight size={ 30 } color='#707070' />
                        <Form.Check
                            type="switch"
                            className="custom-switch"
                            checked={ theme === 'light' }
                            onChange={ handleToggle }
                        />
                        <CiDark size={ 30 } color='#707070' />
                    </span>

                </div>
            </Sidebar>
        </>
    )
}

export default SidebarComponent
