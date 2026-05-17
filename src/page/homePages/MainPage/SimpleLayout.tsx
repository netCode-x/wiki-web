// src/components/Layout/SimpleLayout.tsx
import React from 'react';
import {Outlet} from 'react-router-dom';
import Topbar from '@/page/homePages/Topbar/Topbar';

/**
 *
 *  只需要topbar 的 页面
 * */

const SimpleLayout: React.FC = () => {
    return (
        <>
            <Topbar/>
            <main className="main-content">
                <Outlet/>
            </main>
        </>
    );
};

export default SimpleLayout;