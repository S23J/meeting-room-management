import React, { useContext } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { SidebarComponent } from '../../components';

function Jadwal ()
{
    const { userInfo, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

    return (
        <>
            <SidebarComponent />
            <div className='pt-3 px-3'>
                <h5 className='display-6' style={ { fontFamily: 'Poppins-Light' } }>
                    Daftar Jadwal Meeting
                </h5>
            </div>
        </>
    )
}

export default Jadwal
