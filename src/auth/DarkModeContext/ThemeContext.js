import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ( { children } ) =>
{
    const [ theme, setTheme ] = useState( 'dark' );

    useEffect( () =>
    {
        const savedTheme = localStorage.getItem( 'theme' );
        if ( savedTheme ) {
            setTheme( savedTheme );
        }
    }, [] );

    useEffect( () =>
    {
        localStorage.setItem( 'theme', theme );
    }, [ theme ] );

    return (
        <ThemeContext.Provider value={ { theme, setTheme } }>
            { children }
        </ThemeContext.Provider>
    );
};
