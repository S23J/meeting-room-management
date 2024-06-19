import React, { createContext, useState, useEffect } from 'react';

// Create a context for the theme
export const ThemeContext = createContext();

export const ThemeProvider = ( { children } ) =>
{
    const [ theme, setTheme ] = useState( 'light' );

    // Load theme from local storage when component mounts
    useEffect( () =>
    {
        const savedTheme = localStorage.getItem( 'theme' );
        if ( savedTheme ) {
            setTheme( savedTheme );
        }
    }, [] );

    // Save theme to local storage when it changes
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
