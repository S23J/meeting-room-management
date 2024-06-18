import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext( {} );

export const AuthProvider = ( { children } ) =>
{
    const [ userInfo, setUserInfo ] = useState();
    const [ tokens, setTokens ] = useState();
    const [ showSidebar, setShowSidebar ] = useState( false );
    const toggleSidebar = () =>
    {
        setShowSidebar( !showSidebar );
    };

    const [ mobileSidebar, setMobileSidebar ] = useState( false );
    const toggleMobileSidebar = () =>
    {
        setMobileSidebar( !mobileSidebar );
    };
    const isLoggedIn = async () =>
    {
        try {

            let user_info = await window.sessionStorage.getItem( "userInfo" )
            user_info = JSON.parse( user_info )

            if ( user_info ) {
                setUserInfo( user_info )
            }

            let token = await window.sessionStorage.getItem( "token" )

            let tokenMeta = JSON.parse( token )

            if ( tokenMeta ) {

                setTokens( tokenMeta )
            }

        } catch ( e ) {

        }
    }

    useEffect( () =>
    {
        isLoggedIn()
    }, [] )

    return (
        <AuthContext.Provider value={ { userInfo, setUserInfo, tokens, setTokens, showSidebar, setShowSidebar, toggleSidebar, mobileSidebar, setMobileSidebar, toggleMobileSidebar } }>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext;