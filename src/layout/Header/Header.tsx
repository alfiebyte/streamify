import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

import {
    nav
} from "@src/assets";

import "@src/layout/Header/Header.css";

interface NavItemProps {
    text: string;
    logo: string;
    href: string;
}

function NavItem({ text, logo, href }: NavItemProps) {
    const { pathname } = useLocation();
    const isActive = pathname === href;
    return (
        <Link to={href}>
            <div className={`item ${isActive ? "active" : ""}`}>
                {" "}
                <img src={logo} /> <span>{text}</span>{" "}
                <div className="backdrop" />
            </div>
        </Link>
    );
}

function useScrolled() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return scrolled;
}

interface LayoutProps {}

function LayoutHeader({}: LayoutProps) {
    const scrolled = useScrolled();

    return (
        <div className="header">
            <div className="fade" style={{ opacity: scrolled ? 1 : 0 }} />
            <div className="left">
                <Link to="/" className="logo">
                    Streamify
                </Link>
                <div className="navigation">
                    <NavItem text="Home" logo={nav.home} href="/" />
                    <NavItem text="Movies" logo={nav.movie} href="/movies" />
                    <NavItem
                        text="Series"
                        logo={nav.tvSeries}
                        href="/series"
                    />
                </div>
            </div>
            <div className="right">
                <div className="profile">
                    <span className="name">OnlyTwentyCharacters</span>
                    <img className="pfp" src={nav.defaultPfp} />
                </div>
            </div>
        </div>
    );
}

export default LayoutHeader;
