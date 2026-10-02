import React, { useEffect, useState } from "react";

import "@src/components/Layout/Layout.Component.css";

import LayoutHeader from "@src/components/Layout/Header/Header";

interface LayoutProps extends React.PropsWithChildren {}

function Layout({ children }: LayoutProps) {
    return (
        <div className="layoutEntry">
            <LayoutHeader />
            <div className="contentEntry">{children}</div>
        </div>
    );
}

export default Layout;
