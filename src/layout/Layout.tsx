import React, { useEffect, useState } from "react";

import { Outlet } from "react-router";


import "src/layout/Layout.css";

import LayoutHeader from "src/layout/Header/Header";
import LayoutFooter from "src/layout/Footer/Footer";

interface LayoutProps {}

function Layout({ }: LayoutProps) {
    return (
        <div className="layoutEntry">
            <LayoutHeader />
            <div className="contentEntry">
                <Outlet/>
            </div>
            <LayoutFooter />
        </div>
    );
}

export default Layout;
