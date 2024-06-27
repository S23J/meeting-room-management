import React, { useContext } from 'react'
import { AuthContext, ThemeContext } from '../../auth';
import { SidebarComponent } from '../../components';
import { Button, Col, Row } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiOfficeBuildingPlus } from '@mdi/js';

function Ruangan ()
{
    const { userInfo, tokens } = useContext( AuthContext );
    const { theme } = useContext( ThemeContext );

    return (
        <>
            <SidebarComponent />
            <div className='pt-3 px-3'>
                <Row>
                    <Col xs={ 6 } lg={ 6 } className='text-start'>
                        <h5 className='display-6' style={ { fontFamily: 'Poppins-Light' } }>
                            Daftar Ruangan
                        </h5>
                    </Col>
                    <Col xs={ 6 } lg={ 6 } className='text-end'>
                        <Button
                            style={ {
                                fontSize: '18px',
                                fontFamily: 'Poppins-Regular',
                                alignItems: 'center',
                                minHeight: '50px'
                            } }
                        >
                            Tambah
                            <Icon className='ms-1' path={ mdiOfficeBuildingPlus } size={ 1.3 } />
                        </Button>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Ruangan
