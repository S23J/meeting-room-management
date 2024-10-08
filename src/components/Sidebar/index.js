import React, { useContext } from 'react'
import { Container, Form, Image } from 'react-bootstrap'
import { LogoBundar, LogoBundarDark, LogoFlashklikMrm, LogoFlashklikMrmDark } from '../../assets'
import { NavLink, useLocation } from 'react-router-dom'
import { AuthContext, ThemeContext } from '../../auth'
import { useMediaQuery } from 'react-responsive'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { CiCalendarDate, CiDark, CiGrid41, CiLight, CiViewList } from 'react-icons/ci'
import { VscChevronRight } from 'react-icons/vsc'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { PiUserCircleGearLight } from 'react-icons/pi'

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
        location.pathname === '/ruangan/' ||
            location.pathname.startsWith( '/detail-ruangan/' )
            ? theme === 'light'
                ? 'active-menu-item-dark'
                : 'active-menu-item-light'
            : '';

    const activeClassUser =
        location.pathname === '/user/'
            ? theme === 'light'
                ? 'active-menu-item-dark'
                : 'active-menu-item-light'
            : '';


    const activeClassJadwal =
        location.pathname === '/meeting/' ||
            location.pathname.startsWith( '/detail-meeting/' )
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
            { isMobile === false ? (
                <Sidebar
                    id={ theme === 'light' ? 'mySidebarDark' : 'mySidebarLight' }
                    backgroundColor='rgba(0, 0, 0, 0)'
                    width='210px'
                    collapsed={ showSidebar }
                    defaultCollapsed={ true }
                    onToggle={ toggleSidebar }
                    style={ { display: 'flex', flexDirection: 'column', height: '100vh' } }
                >
                    <Menu style={ { minHeight: '95%', overflowY: 'hidden' } }>
                        <Container id='sidebarHeader' className='px-auto py-2 text-center'>
                            <Image
                                className={ showSidebar ? 'collapsed' : 'expanded pt-4' }
                                src={ theme === 'light' ? LogoFlashklikMrmDark : LogoFlashklikMrm }
                                fluid
                                width={ theme === 'light' ? 180 : 180 }
                                style={ { position: showSidebar ? 'absolute' : 'relative' } }
                            />
                            <Image
                                className={ showSidebar ? 'expanded pt-4' : 'collapsed' }
                                src={ theme === 'light' ? LogoBundarDark : LogoBundar }
                                fluid
                                width={ theme === 'light' ? 45 : 180 }
                                style={ { position: showSidebar ? 'relative' : 'absolute', top: 0, left: 0 } }
                            />
                        </Container>
                        <div className='text-center mt-4' style={ { minHeight: '9vh' } } >
                        </div>
                        <div className='icon-box-sidebar'
                            onClick={ toggleSidebar }
                            style={ { left: showSidebar ? '70px' : '200px', cursor: 'pointer' } }
                        >
                            {
                                showSidebar ?
                                    <IoIosArrowForward size={ 30 } className='icon-arrow-sidebar ms-1' color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
                                    :
                                    <IoIosArrowBack size={ 30 } className='icon-arrow-sidebar ms-1' color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
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
                                        className={ `mb-3 mx-auto ${menuItemClass} ${activeClassUser}` }
                                        component={ <NavLink to="/user/" /> }
                                    >
                                        <PiUserCircleGearLight size={ 25 } />
                                    </MenuItem>
                                    <MenuItem
                                        className={ `mb-3 mx-auto ${menuItemClass} ${activeClassRuangan}` }
                                        component={ <NavLink to="/ruangan/" /> }
                                    >
                                        <CiViewList size={ 25 } />
                                    </MenuItem>
                                    <MenuItem
                                        className={ `mb-3 mx-auto ${menuItemClass} ${activeClassJadwal}` }
                                        component={ <NavLink to="/meeting/" /> }
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
                                        className={ `mb-3 mx-auto ${menuItemClass} ${activeClassUser}` }
                                        component={ <NavLink to="/user/" /> }
                                        icon={ <PiUserCircleGearLight size={ 25 } /> }
                                        style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                                    >
                                        User
                                    </MenuItem>
                                    <MenuItem
                                        className={ `mb-3 mx-auto ${menuItemClass} ${activeClassRuangan}` }
                                        component={ <NavLink to="/ruangan/" /> }
                                        icon={ <CiViewList size={ 25 } /> }
                                        style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                                    >
                                        Ruangan
                                    </MenuItem>
                                    <MenuItem
                                        className={ `mb-3 mx-auto ${menuItemClass} ${activeClassJadwal}` }
                                        component={ <NavLink to="/meeting/" /> }
                                        icon={ <CiCalendarDate size={ 25 } /> }
                                        style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                                    >
                                        Meeting
                                    </MenuItem>
                                </>

                        }

                    </Menu>
                    <div className='mt-auto text-center' style={ { fontFamily: 'Poppins-Medium', fontSize: '13px' } }>
                        <span className="theme-toggle-container">
                            <CiLight size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#222222' } />
                            <Form.Check
                                type="switch"
                                className="custom-switch"
                                checked={ theme === 'light' }
                                onChange={ handleToggle }
                            />
                            <CiDark size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#222222' } />
                        </span>

                    </div>
                </Sidebar>
            ) : (
                <>
                    <Sidebar
                            id={ theme === 'light' ? 'mySidebarDark' : 'mySidebarLight' }
                            backgroundColor={ theme === 'light' ? '#222222' : '#FFFFFF' }
                        width='210px'
                        onBackdropClick={ toggleMobileSidebar }
                        toggled={ mobileSidebar }
                        breakPoint="all"
                        style={ { display: 'flex', flexDirection: 'column', height: '100vh' } }
                    >
                        <Menu style={ { minHeight: '95%', overflowY: 'hidden' } }>
                                <Container id='sidebarHeader' className='px-auto py-2'>
                                <Image
                                    src={ LogoFlashklikMrm }
                                    fluid
                                    width={ 300 }
                                />
                            </Container>
                                <div className='text-center mt-4' style={ { minHeight: '9vh' } } >
                                </div>
                            <div className='icon-box-sidebar'
                                onClick={ toggleMobileSidebar }
                                style={ { left: mobileSidebar ? '0px' : '0px', cursor: 'pointer' } }
                            >
                                {
                                    mobileSidebar ?
                                        <></>
                                        :
                                        <VscChevronRight size={ 25 } className='icon-toggle-mobile ms-2' />
                                }
                            </div>
                            <MenuItem
                                className={ `mb-3 mx-auto ${menuItemClass} ${activeClassDashboard}` }
                                component={ <NavLink to="/dashboard/" /> }
                                icon={ <CiGrid41 size={ 25 } /> }
                                    onClick={ toggleMobileSidebar }
                                style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                            >
                                Dashboard
                            </MenuItem>
                                <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassUser}` }
                                    component={ <NavLink to="/user/" /> }
                                    icon={ <PiUserCircleGearLight size={ 25 } /> }
                                    onClick={ toggleMobileSidebar }
                                    style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                                >
                                    User
                                </MenuItem>
                            <MenuItem
                                    className={ `mb-3 mx-auto ${menuItemClass} ${activeClassRuangan}` }
                                    component={ <NavLink to="/ruangan/" /> }
                                    icon={ <CiViewList size={ 25 } /> }
                                    onClick={ toggleMobileSidebar }
                                style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                            >
                                    Ruangan
                            </MenuItem>
                            <MenuItem
                                className={ `mb-3 mx-auto ${menuItemClass} ${activeClassJadwal}` }
                                    component={ <NavLink to="/meeting/" /> }
                                icon={ <CiCalendarDate size={ 25 } /> }
                                    onClick={ toggleMobileSidebar }
                                style={ { fontFamily: 'Poppins-Regular', fontSize: '15px' } }
                            >
                                    Meeting
                            </MenuItem>
                        </Menu>
                        <div className='mt-auto text-center' style={ { fontFamily: 'Poppins-Medium', fontSize: '13px' } }>
                            <span className="theme-toggle-container">
                                    <CiLight size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
                                <Form.Check
                                    type="switch"
                                    className="custom-switch"
                                    checked={ theme === 'light' }
                                    onChange={ handleToggle }
                                />
                                    <CiDark size={ 30 } color={ theme === 'light' ? '#FFFFFF' : '#707070' } />
                            </span>

                        </div>
                    </Sidebar>
                </>
            )
            }

        </>
    )
}

export default SidebarComponent
